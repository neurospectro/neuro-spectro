import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/lib/supabase";
import { runIntegrationChecks, type IntegrationCheck } from "@/lib/integrations.functions";

const SERVICES: { id: string; name: string; role: string }[] = [
  { id: "database", name: "Banco de dados", role: "Pedidos, acessos, avaliações" },
  { id: "auth", name: "Login", role: "Acesso por link no e-mail" },
  { id: "storage", name: "Armazenamento", role: "Documentos privados (PDF)" },
  { id: "edge_functions", name: "Funções do servidor", role: "Pagamento, webhook, avisos" },
  { id: "mercadopago", name: "Mercado Pago", role: "Cobrança Pix e cartão" },
  { id: "mercadopago_webhook", name: "Webhook Mercado Pago", role: "Confirma pagamento e libera acesso" },
  { id: "turnstile", name: "Cloudflare Turnstile", role: "Proteção contra robôs" },
  { id: "ai", name: "IA", role: "Narrativa editorial do PDF" },
  { id: "email", name: "E-mail", role: "Avisos transacionais" },
  { id: "deploy", name: "Publicação", role: "Site no ar" },
];

const LABEL: Record<IntegrationCheck["status"], string> = {
  ok: "Funcionando",
  warning: "Atenção",
  error: "Erro",
  not_configured: "Não configurado",
  unverified: "Não verificável aqui",
};
const TONE: Record<IntegrationCheck["status"], string> = {
  ok: "bg-primary/10 text-primary",
  warning: "bg-accent text-accent-foreground",
  error: "bg-destructive/10 text-destructive",
  not_configured: "bg-muted text-muted-foreground",
  unverified: "bg-secondary text-secondary-foreground",
};
const STORE = "ns-admin-integration-checks";

export function IntegrationsCenter() {
  const run = useServerFn(runIntegrationChecks);
  const [checks, setChecks] = useState<Record<string, IntegrationCheck>>({});
  const [checkedAt, setCheckedAt] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORE) ?? "null");
      if (saved) {
        setChecks(saved.checks);
        setCheckedAt(saved.checkedAt);
      }
    } catch {
      /* ignore corrupted cache */
    }
  }, []);

  async function test() {
    if (!supabase) return;
    setRunning(true);
    setError("");
    try {
      const { data: s } = await supabase.auth.getSession();
      if (!s.session) throw new Error("Sessão expirada. Entre novamente.");
      const res = await run({ data: { accessToken: s.session.access_token } });
      if (res.error) throw new Error(res.error);
      const map: Record<string, IntegrationCheck> = {};
      for (const c of res.checks) map[c.service] = c;
      map["deploy"] = { service: "deploy", status: "ok", environment: window.location.hostname, detail: "Esta página está sendo servida agora." };
      const at = res.checkedAt ?? new Date().toISOString();
      setChecks(map);
      setCheckedAt(at);
      localStorage.setItem(STORE, JSON.stringify({ checks: map, checkedAt: at }));
    } catch (e) {
      setError(`Não foi possível executar os testes: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-ink">Central de Integrações</h2>
          <p className="text-sm text-muted-foreground">Testes seguros: não cobram, não liberam produto e não alteram dados.</p>
        </div>
        <button onClick={test} disabled={running} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} /> {running ? "Testando..." : "Testar tudo"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((s) => {
          const c = checks[s.id];
          return (
            <div key={s.id} className="rounded-2xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">{s.name}</p>
                  <p className="text-xs text-muted-foreground">{s.role}</p>
                </div>
                <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${c ? TONE[c.status] : "bg-muted text-muted-foreground"}`}>{c ? LABEL[c.status] : "Não verificado"}</span>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">{c?.detail ?? "Clique em Testar tudo."}</p>
              {c && <p className="mt-2 text-[11px] text-muted-foreground">{c.environment ? `Ambiente: ${c.environment} · ` : ""}Última verificação: {checkedAt ? new Date(checkedAt).toLocaleString("pt-BR") : "—"}</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
