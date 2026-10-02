import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ClipboardCheck, FileText, LogOut, ShieldCheck, Sparkles, Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatBRL } from "@/lib/offers";

type ResultRow = {
  id: string;
  created_at: string;
  total_raw: number;
  max_raw: number;
  scores: Array<{ id: string; label: string; raw: number; max: number }>;
};

type AccessRow = {
  id: string;
  status: string;
  starts_at: string;
  expires_at: string | null;
  produto_id: string;
  produtos?: { slug: string } | null;
};

type OrderRow = {
  id: string;
  status: string;
  amount_cents: number;
  installments: number;
  created_at: string;
};

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [results, setResults] = useState<ResultRow[]>([]);
  const [accesses, setAccesses] = useState<AccessRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { void load(); }, []);

  async function load() {
    if (!supabase) {
      setError("O serviço de acesso ainda não foi configurado neste ambiente.");
      setLoading(false);
      return;
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      await navigate({ to: "/login" });
      return;
    }

    setEmail(auth.user.email ?? "");

    const [resultQuery, accessQuery, orderQuery] = await Promise.all([
      supabase.from("resultados").select("id,created_at,total_raw,max_raw,scores").order("created_at", { ascending: false }),
      supabase.from("acessos").select("id,status,starts_at,expires_at,produto_id,produtos(slug)").order("created_at", { ascending: false }),
      supabase.from("pedidos").select("id,status,amount_cents,installments,created_at").order("created_at", { ascending: false }),
    ]);

    const firstError = resultQuery.error ?? accessQuery.error ?? orderQuery.error;
    if (firstError) setError(firstError.message);
    setResults((resultQuery.data ?? []) as ResultRow[]);
    setAccesses((accessQuery.data ?? []) as unknown as AccessRow[]);
    setOrders((orderQuery.data ?? []) as OrderRow[]);
    setLoading(false);
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    await navigate({ to: "/" });
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-muted-foreground">Carregando seu NeuroSpectro...</main>;
  }

  const latest = results[0];
  const hasReport = accesses.some((a) => a.status === "active" && a.produtos?.slug === "relatorio-completo");
  const hasPdf = accesses.some((a) => a.status === "active" && a.produtos?.slug === "relatorio-pdf");
  const hasCommunity = accesses.some((a) => a.status === "active" && a.produtos?.slug === "comunidade-apoio");
  const hasTrajectory = accesses.some((a) => a.status === "active" && a.produtos?.slug === "leitura-trajetoria");

  const completionLabel = useMemo(() => {
    if (hasReport && hasPdf && hasCommunity && hasTrajectory) return "Experiência completa";
    if (hasReport) return "Relatório completo liberado";
    if (latest) return "Avaliação concluída";
    return "Comece sua jornada";
  }, [hasReport, hasPdf, hasCommunity, latest]);

  return (
    <main className="min-h-screen bg-background px-4 py-5 font-sans sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between gap-4 border-b border-border/70 pb-5">
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink">NeuroSpectro</Link>
          <div className="flex items-center gap-2">
            <span className="hidden max-w-[260px] truncate text-sm text-muted-foreground sm:inline">{email}</span>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-ink transition hover:border-primary/40 hover:bg-secondary">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </header>

        <section className="relative mt-7 overflow-hidden rounded-[2rem] border border-primary/15 bg-card p-6 shadow-soft sm:mt-9 sm:p-8">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">Minha área</span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">{completionLabel}</span>
            </div>
            <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">Seu espaço para acompanhar o que você descobriu.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Aqui você encontra suas avaliações, acessos e próximos passos da experiência NeuroSpectro.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/avaliacao" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition hover:opacity-90">
                <ClipboardCheck className="h-4 w-4" /> Nova avaliação <ArrowRight className="h-4 w-4" />
              </Link>
              {hasCommunity && (
                <Link to="/comunidade" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-ink transition hover:border-primary/40">
                  <Users className="h-4 w-4" /> Comunidade
                </Link>
              )}
            </div>
          </div>
        </section>

        {error && <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <AccessCard icon={<FileText className="h-5 w-5" />} title="Relatório online" active={hasReport} description={hasReport ? "Sua análise completa está liberada." : "Transforme sua prévia em uma leitura mais completa."} href={hasReport ? "/relatorio-online" : "/checkout/$offerId"} params={hasReport ? undefined : { offerId: "report-full-2490" }} />
          <AccessCard icon={<Sparkles className="h-5 w-5" />} title="Leitura de Trajetória" active={hasTrajectory} description={hasTrajectory ? "Conte sua história e acompanhe a devolutiva do especialista." : "Uma leitura humana da sua trajetória para organizar melhor o que você vive."} href={hasTrajectory ? "/leitura-trajetoria" : "/leitura-trajetoria-oferta"} params={undefined} />
          <AccessCard icon={<FileText className="h-5 w-5" />} title="Gerar PDF para consulta" active={hasPdf} description={hasPdf ? "Seu documento para levar ao especialista está disponível." : "Gere uma versão organizada para guardar e levar à consulta."} href={hasPdf ? "/relatorio-pdf" : "/checkout/$offerId"} params={hasPdf ? undefined : { offerId: "pdf-report-1490" }} />
          <AccessCard icon={<Users className="h-5 w-5" />} title="Comunidade de Apoio" active={hasCommunity} description={hasCommunity ? "Seu acesso está registrado." : "Trocas, conteúdos e conversas sobre neurodiversidade."} href={!hasCommunity ? "/checkout/$offerId" : "/comunidade"} params={!hasCommunity ? { offerId: "community-6x-1490" } : undefined} />
        </section>

        {latest && (
          <section className="mt-6 rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Último resultado</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Uma visão geral das suas respostas</h2>
                <p className="mt-2 text-sm text-muted-foreground">Registrado em {new Date(latest.created_at).toLocaleDateString("pt-BR")} · {latest.total_raw}/{latest.max_raw} pontos informativos.</p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">Sem ponto de corte clínico</span>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {latest.scores.map((score) => (
                <div key={score.id} className="rounded-2xl border border-border/80 bg-background p-4">
                  <div className="flex justify-between gap-3 text-sm"><span className="font-semibold text-ink">{score.label}</span><span className="text-muted-foreground">{score.raw}/{score.max}</span></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-spectrum" style={{ width: score.max ? `${Math.min(100, (score.raw / score.max) * 100)}%` : "0%" }} /></div>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-muted-foreground">Esta pontuação é informativa e não estabelece diagnóstico. Use o relatório como apoio ao autoconhecimento e, se desejar, a uma conversa profissional.</p>
          </section>
        )}

        {!hasReport && latest && (
          <section className="mt-6 overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-soft sm:p-7">
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-primary p-3 text-primary-foreground"><Sparkles className="h-5 w-5" /></div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Próximo passo</p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Leve sua avaliação além da prévia.</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">O Relatório Completo organiza suas dimensões, padrões observados e pontos que podem orientar novas reflexões.</p>
                <Link to="/checkout/$offerId" params={{ offerId: "report-full-2490" }} className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft">Ver Relatório Completo · {formatBRL(2490)} <ArrowRight className="h-4 w-4" /></Link>
              </div>
            </div>
          </section>
        )}

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <Panel title="Histórico de avaliações">
            {results.length === 0 ? <p className="text-sm text-muted-foreground">Ainda não há avaliações vinculadas à sua conta.</p> : <div className="mt-4 space-y-2">{results.map((r) => <div key={r.id} className="flex items-center justify-between rounded-2xl bg-secondary/50 p-3 text-sm"><span>{new Date(r.created_at).toLocaleDateString("pt-BR")}</span><span className="font-medium text-ink">{r.total_raw}/{r.max_raw}</span></div>)}</div>}
          </Panel>
          <Panel title="Pedidos">
            {orders.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum pedido registrado.</p> : <div className="mt-4 space-y-2">{orders.map((o) => <div key={o.id} className="flex items-center justify-between rounded-2xl bg-secondary/50 p-3 text-sm"><span>{new Date(o.created_at).toLocaleDateString("pt-BR")} · {formatBRL(o.amount_cents)}</span><span className="font-medium capitalize text-ink">{o.status}</span></div>)}</div>}
          </Panel>
        </section>

        <section className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-soft">
          <div className="flex gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div><p className="font-semibold text-ink">Privacidade e segurança</p><p className="mt-1 text-sm leading-5 text-muted-foreground">Seus resultados ficam vinculados à sua conta e protegidos pelas regras de acesso do NeuroSpectro.</p></div>
          </div>
        </section>

        <div className="mt-7 pb-4 text-center">
          <Link to="/depoimento" className="text-sm font-medium text-primary hover:underline">Enviar ou acompanhar meu depoimento →</Link>
        </div>
      </div>
    </main>
  );
}

function AccessCard({ icon, title, active, description, href, params }: { icon: React.ReactNode; title: string; active: boolean; description: string; href?: "/checkout/$offerId" | "/comunidade" | "/relatorio-online" | "/relatorio-pdf" | "/leitura-trajetoria" | "/leitura-trajetoria-oferta"; params?: { offerId: string } | undefined }) {
  const content = (
    <div className="h-full rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:border-primary/30 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-2xl bg-primary/10 p-2.5 text-primary">{icon}</span>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{active ? "Liberado" : "Disponível"}</span>
      </div>
      <h2 className="mt-4 font-semibold text-ink">{title}</h2>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
      {!active && href && <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Conhecer <ArrowRight className="h-4 w-4" /></span>}
    </div>
  );

  if (!href) return content;
  return href === "/checkout/$offerId" ? <Link to={href} params={params!}>{content}</Link> : <Link to={href}>{content}</Link>;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-3xl border border-border bg-card p-6 shadow-soft"><h2 className="font-semibold text-ink">{title}</h2><div className="mt-3">{children}</div></section>;
}
