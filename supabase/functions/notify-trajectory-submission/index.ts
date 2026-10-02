import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://neurospectro.com.br",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Método não permitido." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim();
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  const resendKey = Deno.env.get("RESEND_API_KEY")?.trim();
  const fromEmail = Deno.env.get("RESEND_FROM_EMAIL")?.trim();

  if (!supabaseUrl || !anonKey || !serviceKey || !resendKey || !fromEmail) {
    console.error("TRAJECTORY_EMAIL_CONFIG_ERROR");
    return json({ error: "Serviço de e-mail não configurado." }, 503);
  }

  const authHeader = req.headers.get("Authorization");
  const accessToken = authHeader?.replace(/^Bearer\s+/i, "");
  if (!accessToken) return json({ error: "Autenticação necessária." }, 401);

  const authClient = createClient(supabaseUrl, anonKey);
  const admin = createClient(supabaseUrl, serviceKey);
  const { data: userData, error: userError } = await authClient.auth.getUser(accessToken);
  if (userError || !userData.user) return json({ error: "Sessão inválida ou expirada." }, 401);

  const body = await req.json().catch(() => null);
  const readingId = String(body?.readingId ?? "").trim();
  if (!readingId) return json({ error: "Leitura não informada." }, 400);

  const { data: reading, error: readingError } = await admin
    .from("leituras_trajetoria")
    .select("id,user_id,email,status,story,development_notes,current_context,submitted_at,notification_sent_at")
    .eq("id", readingId)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (readingError) {
    console.error("TRAJECTORY_EMAIL_READ_ERROR", readingError);
    return json({ error: "Não foi possível localizar o envio." }, 500);
  }
  if (!reading) return json({ error: "Envio não encontrado." }, 404);
  if (!["submitted", "in_review", "completed"].includes(reading.status)) {
    return json({ error: "O relato ainda não foi enviado." }, 409);
  }
  if (reading.notification_sent_at) return json({ ok: true, alreadySent: true });

  const adminEmail = Deno.env.get("TRAJECTORY_NOTIFICATION_EMAIL")?.trim() || "neurospectro@gmail.com";
  const submittedAt = reading.submitted_at ? new Date(reading.submitted_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "não informado";
  const subject = `Nova Leitura de Trajetória NeuroSpectro — ${reading.email}`;

  const html = `
    <h2>Nova Leitura de Trajetória recebida</h2>
    <p><strong>Prazo operacional informado ao cliente:</strong> até 3 dias após o envio.</p>
    <hr />
    <p><strong>ID da leitura:</strong> ${escapeHtml(reading.id)}</p>
    <p><strong>Usuário:</strong> ${escapeHtml(reading.user_id)}</p>
    <p><strong>E-mail:</strong> ${escapeHtml(reading.email)}</p>
    <p><strong>Enviado em:</strong> ${escapeHtml(submittedAt)}</p>
    <h3>História</h3>
    <p style="white-space:pre-wrap">${escapeHtml(reading.story ?? "")}</p>
    <h3>Primeiros anos / desenvolvimento</h3>
    <p style="white-space:pre-wrap">${escapeHtml(reading.development_notes ?? "Não informado")}</p>
    <h3>Contexto atual</h3>
    <p style="white-space:pre-wrap">${escapeHtml(reading.current_context ?? "Não informado")}</p>
  `;

  const confirmationHtml = `
    <h2>Recebemos sua Leitura de Trajetória</h2>
    <p>Seu relato foi recebido pelo NeuroSpectro e encaminhado para a fila de leitura.</p>
    <p><strong>Prazo de resposta: até 3 dias após o envio.</strong></p>
    <p>A devolutiva será disponibilizada na sua área do NeuroSpectro.</p>
    <p>Este serviço é informativo e não constitui diagnóstico, laudo, consulta ou avaliação psicológica.</p>
  `;

  try {
    const [adminResponse, clientResponse] = await Promise.all([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: [adminEmail],
          reply_to: reading.email,
          subject,
          html,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: [reading.email],
          subject: "NeuroSpectro — recebemos sua Leitura de Trajetória",
          html: confirmationHtml,
        }),
      }),
    ]);

    if (!adminResponse.ok || !clientResponse.ok) {
      const adminText = await adminResponse.text().catch(() => "");
      const clientText = await clientResponse.text().catch(() => "");
      console.error("TRAJECTORY_EMAIL_PROVIDER_ERROR", {
        adminStatus: adminResponse.status,
        clientStatus: clientResponse.status,
        adminText,
        clientText,
      });
      return json({ error: "Não foi possível enviar as confirmações.", retryable: true }, 502);
    }

    await admin
      .from("leituras_trajetoria")
      .update({ notification_sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq("id", reading.id)
      .eq("user_id", userData.user.id)
      .is("notification_sent_at", null);

    return json({ ok: true });
  } catch (error) {
    console.error("TRAJECTORY_EMAIL_NETWORK_ERROR", error);
    return json({ error: "Falha temporária no envio de e-mail.", retryable: true }, 502);
  }
});
