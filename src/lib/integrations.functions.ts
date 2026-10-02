// Central de Integrações: testes seguros e somente leitura, executados no servidor do site.
// Os secrets privados ficam no Supabase (externo) e não são acessíveis aqui; por isso,
// cada teste verifica apenas o que pode ser provado sem revelar ou usar esses secrets.
import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export type IntegrationCheck = {
  service: string;
  status: "ok" | "warning" | "error" | "not_configured" | "unverified";
  environment: string | null;
  detail: string;
};

const SUPABASE_URL = "https://lihduwskppoxjnuwndnp.supabase.co";
const SUPABASE_KEY = "sb_publishable_qsneVU-BAuVl0tZW6GjMsg_-YUGye0x";

async function status(url: string, init?: RequestInit) {
  try {
    const r = await fetch(url, init);
    return r.status;
  } catch {
    return 0;
  }
}

export const runIntegrationChecks = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ accessToken: z.string().min(10).max(4096) }).parse(d))
  .handler(async ({ data }) => {
    const url = process.env["VITE_SUPABASE_URL"] || SUPABASE_URL;
    const key = process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || SUPABASE_KEY;
    const sb = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: { headers: { Authorization: `Bearer ${data.accessToken}` } },
    });

    const { data: u, error: ue } = await sb.auth.getUser(data.accessToken);
    if (ue || !u.user) return { error: "Sessão inválida.", checks: [] as IntegrationCheck[] };
    const { data: adm } = await sb.from("admin_users").select("user_id").eq("user_id", u.user.id).maybeSingle();
    if (!adm) return { error: "Acesso administrativo não autorizado.", checks: [] as IntegrationCheck[] };

    const checks: IntegrationCheck[] = [];
    checks.push({ service: "auth", status: "ok", environment: null, detail: "Sessão do administrador validada pelo servidor." });

    const db = await sb.from("ofertas").select("slug,total_cents,active").limit(20);
    checks.push({
      service: "database",
      status: db.error ? "error" : "ok",
      environment: null,
      detail: db.error ? db.error.message : `Leitura OK — ${db.data?.length ?? 0} oferta(s) cadastrada(s).`,
    });

    const st = await sb.storage.listBuckets();
    checks.push({
      service: "storage",
      status: st.error ? "unverified" : st.data.length ? "ok" : "warning",
      environment: null,
      detail: st.error
        ? "Não foi possível listar buckets com a chave pública (exige permissão de servidor)."
        : st.data.length
          ? `${st.data.length} bucket(s) visível(is).`
          : "Nenhum bucket visível — documentos privados (PDF) ainda não têm armazenamento.",
    });

    const fn = (name: string) => `${url}/functions/v1/${name}`;
    const [pp, wh, nt] = await Promise.all([
      status(fn("process-payment"), { method: "OPTIONS" }),
      status(fn("mercadopago-webhook"), { method: "POST", body: "{}" }),
      status(fn("notify-trajectory-submission"), { method: "OPTIONS" }),
    ]);
    const live = (s: number) => s > 0 && s !== 404;
    checks.push({
      service: "edge_functions",
      status: live(pp) && live(wh) ? (live(nt) ? "ok" : "warning") : "error",
      environment: null,
      detail: `process-payment: ${live(pp) ? "publicada" : `não encontrada (${pp})`} · mercadopago-webhook: ${live(wh) ? "publicada" : `não encontrada (${wh})`} · notify-trajectory-submission: ${live(nt) ? "publicada" : `não encontrada (${nt})`}.`,
    });
    checks.push({
      service: "mercadopago_webhook",
      status: wh === 401 ? "ok" : live(wh) ? "warning" : "error",
      environment: null,
      detail:
        wh === 401
          ? "Notificação sem assinatura foi recusada (401), como deve ser. Recebimento real depende do cadastro no Mercado Pago."
          : `Resposta inesperada ao teste sem assinatura: ${wh}.`,
    });

    const ev = await sb.from("webhook_events").select("event_type,created_at,processed_at").order("created_at", { ascending: false }).limit(1);
    if (!ev.error && ev.data?.[0]) {
      const e = ev.data[0];
      checks[checks.length - 1].detail += ` Último evento: ${e.event_type} em ${new Date(e.created_at).toLocaleString("pt-BR")} (${e.processed_at ? "processado" : "pendente"}).`;
    } else if (!ev.error) {
      checks[checks.length - 1].detail += " Nenhum evento recebido ainda.";
    }

    const pk = process.env["VITE_MERCADOPAGO_PUBLIC_KEY"] || "APP_USR-9475958e-da67-4a96-bb00-5dcb91a6900d";
    checks.push({
      service: "mercadopago",
      status: "unverified",
      environment: pk.startsWith("TEST-") ? "teste" : "credencial APP_USR (teste ou produção — conferir no painel)",
      detail: "Public Key presente no site. O Access Token fica só no Supabase; ele é validado quando um pagamento é criado.",
    });

    checks.push({
      service: "turnstile",
      status: "unverified",
      environment: null,
      detail: "Site key presente. A secret key fica no Supabase e é validada a cada pagamento; sem ela, pagamentos são recusados.",
    });
    checks.push({ service: "ai", status: "not_configured", environment: null, detail: "Nenhuma integração de IA implementada no código ainda." });
    checks.push({
      service: "email",
      status: "unverified",
      environment: null,
      detail: "Envio via Resend implementado só para avisos da Leitura de Trajetória (exige RESEND_API_KEY e RESEND_FROM_EMAIL no Supabase). Nenhum e-mail é enviado neste teste.",
    });
    return { error: null as string | null, checks, checkedAt: new Date().toISOString() };
  });
