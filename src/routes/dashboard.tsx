import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FileText, LogOut, Users, ClipboardCheck, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    if (!supabase) {
      setError("O Supabase ainda não foi configurado neste ambiente.");
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
    setAccesses((accessQuery.data ?? []) as AccessRow[]);
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
  const hasCommunity = accesses.some((a) => a.status === "active" && a.produtos?.slug === "comunidade-apoio");

  return (
    <main className="min-h-screen bg-background px-5 py-8 font-sans">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-lg font-semibold text-ink">NeuroSpectro</Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
            <button onClick={signOut} className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium">
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </header>

        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Minha área</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink md:text-4xl">Seu NeuroSpectro</h1>
          <p className="mt-2 text-muted-foreground">Aqui ficam suas avaliações, resultados e acessos vinculados à sua conta.</p>
        </section>

        {error && <div className="mt-6 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Link to="/avaliacao" className="rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:border-primary/40">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-semibold text-ink">Nova avaliação</h2>
            <p className="mt-1 text-sm text-muted-foreground">Comece uma nova jornada de autoconhecimento.</p>
          </Link>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <FileText className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-semibold text-ink">Relatório completo</h2>
            <p className="mt-1 text-sm text-muted-foreground">{hasReport ? "Seu acesso está registrado." : "Será liberado após confirmação do pagamento."}</p>
          </div>
          <Link to="/comunidade" className="rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:border-primary/40">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-semibold text-ink">Comunidade</h2>
            <p className="mt-1 text-sm text-muted-foreground">{hasCommunity ? "Seu acesso está registrado." : "Conheça a Comunidade de Apoio."}</p>
          </Link>
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <div>
              <h2 className="font-semibold text-ink">Seus dados</h2>
              <p className="text-sm text-muted-foreground">O acesso aos seus resultados é protegido por RLS no Supabase.</p>
            </div>
          </div>
        </section>

        {latest && (
          <section className="mt-8 rounded-3xl border border-primary/20 bg-card p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Último resultado</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <h2 className="font-display text-2xl font-semibold text-ink">Sua avaliação registrada</h2>
              <span className="text-sm text-muted-foreground">{new Date(latest.created_at).toLocaleDateString("pt-BR")}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Pontuação informativa: {latest.total_raw}/{latest.max_raw}. Não é diagnóstico nem possui ponto de corte clínico.</p>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {latest.scores.map((score) => (
                <div key={score.id}>
                  <div className="flex justify-between text-sm"><span className="font-medium text-ink">{score.label}</span><span className="text-muted-foreground">{score.raw}/{score.max}</span></div>
                  <div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: score.max ? `${(score.raw / score.max) * 100}%` : "0%" }} /></div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-semibold text-ink">Histórico de avaliações</h2>
            {results.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Ainda não há avaliações vinculadas à sua conta.</p> : <div className="mt-4 space-y-2">{results.map((r) => <div key={r.id} className="flex justify-between rounded-2xl bg-secondary/50 p-3 text-sm"><span>{new Date(r.created_at).toLocaleDateString("pt-BR")}</span><span>{r.total_raw}/{r.max_raw}</span></div>)}</div>}
          </div>
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="font-semibold text-ink">Pedidos</h2>
            {orders.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">Nenhum pedido registrado.</p> : <div className="mt-4 space-y-2">{orders.map((o) => <div key={o.id} className="flex items-center justify-between rounded-2xl bg-secondary/50 p-3 text-sm"><span>{new Date(o.created_at).toLocaleDateString("pt-BR")}</span><span className="font-medium">{o.status}</span></div>)}</div>}
          </div>
        </section>

        <div className="mt-8 text-center">
          <Link to="/depoimento" className="text-sm font-medium text-primary">Enviar ou acompanhar meu depoimento →</Link>
        </div>
      </div>
    </main>
  );
}
