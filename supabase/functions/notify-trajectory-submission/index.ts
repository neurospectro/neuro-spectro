import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set([
  "https://neurospectro.com.br",
  "https://www.neurospectro.com.br",
  "https://hello-world-maker-6497.lovable.app",
]);

function corsHeaders(req: Request) {
  const origin = req.headers.get("Origin")?.trim() ?? "";
  return {
    "Access-Control-Allow-Origin": allowedOrigins.has(origin) ? origin : "https://neurospectro.com.br",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

const json = (req: Request, body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(req), "Content-Type": "application/json" },
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
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(req) });
  if (req.method !== "POST") return json(req, { error: "Método não permitido." }, 405);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")?.trim();
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")?.trim();
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")?.trim();
  const resendKey = Deno.env.get("RESEND_API_KEY")?.trim();
  const fromEmail = Deno.env.get("RESEND_FROM_EMAIL")?.trim();

  if (!supabaseUrl || !anonKey || !serviceKey || !resendKey || !fromEmail) {
    return json(req, { error: "Serviço de e-mail não configurado." }, 503);
  }

  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return json(req, { error: "Autenticação necessária." }, 401);

  const authClient = createClient(supabaseUrl, anonKey);
  const admin = createClient(supabaseUrl, serviceKey);
  const { data: userData, error: userError } = await authClient.auth.getUser(token);
  if (userError || !userData.user) return json(req, { error: "Sessão inválida ou expirada." }, 401);

  const body = await req.json().catch(() => null);
  const readingId = String(body?.readingId ?? "").trim();
  if (!readingId) return json(req, { error: "Leitura não informada." }, 400);

  const { data: reading, error: readingError } = await admin
    .from("leituras_trajetoria")
    .select("id,user_id,email,status,story,development_notes,current_context,submitted_at,notification_sent_at")
    .eq("id", readingId)
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (readingError) return json(req, { error: "Não foi possível localizar o envio." }, 500);
  if (!reading) return json(req, { error: "Envio não encontrado." }, 404);
  if (!["submitted", "in_review", "completed"].includes(reading.status)) return json(req, { error: "O relato ainda não foi enviado." }, 409);
  if (reading.notification_sent_at) return json(req, { ok: true, alreadySent: true });

  const adminEmail = Deno.env.get("TRAJECTORY_NOTIFICATION_EMAIL")?.trim() || "neurospectro@gmail.com";
  const submittedAt = reading.submitted_at
    ? new Date(reading.submitted_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })
    : "não informado";

  const html = [
    "<h2>Nova Leitura de Trajetória recebida</h2>",
    "<p><strong>Prazo informado ao cliente:</strong> até 3 dias após o envio.</p>",
    "<hr />",
    "<p><strong>ID:</strong> " + escapeHtml(reading.id) + "</p>",
    "<p><strong>Usuário:</strong> " + escapeHtml(reading.user_id) + "</p>",
    "<p><strong>E-mail:</strong> " + escapeHtml(reading.email) + "</p>",
    "<p><strong>Enviado em:</strong> " + escapeHtml(submittedAt) + "</p>",
    "<h3>História</h3><p style='white-space:pre-wrap'>" + escapeHtml(reading.story ?? "") + "</p>",
    "<h3>Primeiros anos / desenvolvimento</h3><p style='white-space:pre-wrap'>" + escapeHtml(reading.development_notes ?? "Não informado") + "</p>",
    "<h3>Contexto atual</h3><p style='white-space:pre-wrap'>" + escapeHtml(reading.current_context ?? "Não informado") + "</p>",
  ].join("");

  const confirmationHtml = [
    "<h2>Recebemos sua Leitura de Trajetória</h2>",
    "<p>Seu relato foi recebido pelo NeuroSpectro e encaminhado para a fila de leitura.</p>",
    "<p><strong>Prazo de resposta: até 3 dias após o envio.</strong></p>",
    "<p>A devolutiva será disponibilizada na sua área do NeuroSpectro.</p>",
    "<p>Este serviço é informativo e não constitui diagnóstico, laudo, consulta ou avaliação psicológica.</p>",
  ].join("");

  try {
    const [adminResponse, clientResponse] = await Promise.all([
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + resendKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: [adminEmail],
          reply_to: reading.email,
          subject: "Nova Leitura de Trajetória NeuroSpectro — " + reading.email,
          html,
        }),
      }),
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: "Bearer " + resendKey, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: fromEmail,
          to: [reading.email],
          subject: "NeuroSpectro — recebemos sua Leitura de Trajetória",
          html: confirmationHtml,
        }),
      }),
    ]);

    if (!adminResponse.ok || !clientResponse.ok) {
      return json(req, { error: "Não foi possível enviar as confirmações.", retryable: true }, 502);
    }

    await admin
      .from("leituras_trajetoria")
      .update({
        notification_sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", reading.id)
      .eq("user_id", userData.user.id)
      .is("notification_sent_at", null);

    return json(req, { ok: true });
  } catch (error) {
    console.error("TRAJECTORY_EMAIL_NETWORK_ERROR", error);
    return json(req, { error: "Falha temporária no envio de e-mail.", retryable: true }, 502);
  }
});
