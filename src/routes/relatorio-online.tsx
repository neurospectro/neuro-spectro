import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Compass, FileText, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { AssessmentAnalysis } from "@/lib/assessment/analysis";

type Score = { id: string; label: string; raw: number; max: number };
type Result = { id: string; created_at: string; total_raw: number; max_raw: number; scores: Score[]; analysis: AssessmentAnalysis | null };

export const Route = createFileRoute("/relatorio-online")({ component: OnlineReport });

function OnlineReport() {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [locked, setLocked] = useState(false);
  const [firstName, setFirstName] = useState("");

  useEffect(() => { void load(); }, []);

  async function load() {
    if (!supabase) { setLoading(false); return; }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setLoading(false); return; }
    const metadataName = String(auth.user.user_metadata?.full_name ?? auth.user.user_metadata?.name ?? "").trim();
    setFirstName((metadataName || auth.user.email?.split("@")[0] || "").split(/\s+/)[0]);

    const { data: access } = await supabase
      .from("acessos")
      .select("status,expires_at,produtos(slug)")
      .eq("status", "active")
      .eq("produtos.slug", "relatorio-completo")
      .limit(1)
      .maybeSingle();

    const row = access as { status: string; expires_at: string | null; produtos?: { slug: string } | null } | null;
    const valid = Boolean(row?.status === "active" && row?.produtos?.slug === "relatorio-completo" && (!row.expires_at || new Date(row.expires_at).getTime() > Date.now()));
    if (!valid) { setLocked(true); setLoading(false); return; }

    const { data } = await supabase
      .from("resultados")
      .select("id,created_at,total_raw,max_raw,scores,analysis")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    setResult((data ?? null) as Result | null);
    setLoading(false);
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-muted-foreground">Preparando seu relatório...</main>;

  if (locked) {
    return (
      <main className="min-h-screen bg-background px-5 py-12">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-soft">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-5 font-display text-3xl font-semibold text-ink">Seu relatório completo está bloqueado</h1>
          <p className="mt-3 leading-6 text-muted-foreground">A prévia da avaliação é gratuita. O relatório completo reúne a análise detalhada das dimensões, padrões, pontos de exploração e perguntas para levar a um profissional.</p>
          <Link to="/checkout/$offerId" params={{ offerId: "report-full-2490" }} className="mt-6 inline-flex rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground">Liberar relatório completo · R$ 24,90</Link>
          <div className="mt-4"><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Voltar para minha área</Link></div>
        </div>
      </main>
    );
  }

  if (!result) {
    return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center"><div><h1 className="font-display text-2xl font-semibold text-ink">Relatório indisponível</h1><p className="mt-2 text-sm text-muted-foreground">Conclua uma avaliação para gerar seu relatório.</p><Link to="/avaliacao" className="mt-5 inline-block text-primary">Fazer avaliação</Link></div></main>;
  }

  const analysis = result.analysis;
  if (!analysis) {
    return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-center"><div><h1 className="font-display text-2xl font-semibold text-ink">Estamos atualizando sua análise</h1><p className="mt-2 text-sm text-muted-foreground">Seu resultado foi salvo, mas a análise detalhada ainda não está disponível para esta avaliação.</p><Link to="/dashboard" className="mt-5 inline-block text-primary">Voltar para minha área</Link></div></main>;
  }

  return (
    <main className="min-h-screen bg-secondary/40 px-4 py-7 font-sans sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-3">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Minha área</Link>
          <span className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">Relatório completo</span>
        </div>

        <section className="mt-6 rounded-[2rem] border border-primary/15 bg-card p-6 shadow-soft sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">NeuroSpectro · leitura personalizada</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{firstName ? `${firstName}, este é o seu resultado NeuroSpectro` : "Este é o seu resultado NeuroSpectro"}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground">{analysis.overview}</p>
          <div className="mt-6 rounded-2xl border border-primary/15 bg-primary/5 p-5 text-sm leading-6 text-muted-foreground">
            <strong className="text-ink">Contexto clínico:</strong> {analysis.clinicalContext}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-8">
          <Header title="Principais pontos observados" icon={<Sparkles className="h-5 w-5" />} />
          <div className="mt-5 grid gap-3">{analysis.highlights.map((item) => <div key={item} className="flex gap-3 rounded-2xl bg-secondary/50 p-4 text-sm leading-6 text-ink"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</div>)}</div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-8">
          <Header title="Leitura por dimensão" icon={<Compass className="h-5 w-5" />} />
          <div className="mt-5 space-y-4">
            {analysis.dimensions.map((d) => (
              <article key={d.id} className="rounded-2xl border border-border p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div><h3 className="font-semibold text-ink">{d.label}</h3><p className="mt-1 text-xs text-muted-foreground">{d.level === "elevado" ? "Maior intensidade relativa" : d.level === "moderado" ? "Intensidade intermediária" : "Menor intensidade relativa"} · {d.percentage}%</p></div>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-spectrum" style={{ width: `${d.percentage}%` }} /></div>
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">{d.summary}</p>
                {d.signals.length > 0 && <p className="mt-3 text-sm leading-6 text-ink"><strong>Sinais de maior intensidade:</strong> {d.signals.join(", ")}.</p>}
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{d.interpretation}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <Panel title="Padrões para observar">
            {analysis.patternDetails?.length
              ? analysis.patternDetails.map((pattern) => (
                  <article key={pattern.id} className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
                    <h3 className="font-semibold text-ink">{pattern.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{pattern.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Baseado nas dimensões: {pattern.evidence.join(" · ")}</p>
                  </article>
                ))
              : analysis.patterns.map((x) => <Bullet key={x} text={x} />)}
          </Panel>
          <Panel title="Pontos para explorar">{analysis.explore.map((x) => <Bullet key={x} text={x} />)}</Panel>
        </section>

        <section className="mt-6 rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-8">
          <Header title="Estratégias práticas de baixo risco" icon={<ShieldCheck className="h-5 w-5" />} />
          <p className="mt-2 text-xs leading-5 text-muted-foreground">São sugestões de organização e adaptação, não tratamento médico.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{analysis.practicalSupports.map((x) => <div key={x} className="rounded-2xl bg-secondary/50 p-4 text-sm leading-6 text-ink">{x}</div>)}</div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-8">
          <Header title="Leve estas perguntas para um especialista" icon={<ShieldCheck className="h-5 w-5" />} />
          <ol className="mt-5 space-y-3">{analysis.professionalQuestions.map((q, i) => <li key={q} className="flex gap-3 rounded-2xl border border-border p-4 text-sm leading-6 text-ink"><span className="font-bold text-primary">{i + 1}.</span><span>{q}</span></li>)}</ol>
        </section>

        <section className="mt-6 rounded-[2rem] border border-primary/15 bg-card p-6 shadow-soft sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Próximos passos</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Seu relatório é um ponto de partida.</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">Se você quiser se preparar melhor para uma futura conversa com um profissional, existem três formas de continuar sua jornada.</p>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Link to="/leitura-trajetoria-oferta" className="group rounded-3xl border border-primary/20 bg-primary/5 p-5 transition hover:border-primary/40 hover:shadow-soft">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold text-ink">Leitura de Trajetória</h3>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">Conte sua história com suas próprias palavras e receba uma devolutiva humana de um especialista parceiro.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Saiba mais · R$ 149,90 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
            <Link to="/checkout/$offerId" params={{ offerId: "pdf-report-1490" }} className="group rounded-3xl border border-border bg-background p-5 transition hover:border-primary/30 hover:shadow-soft">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold text-ink">Gerar PDF para consulta</h3>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">Leve suas informações organizadas para uma conversa com um profissional habilitado.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Conhecer <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
            <Link to="/checkout/$offerId" params={{ offerId: "community-6x-1490" }} className="group rounded-3xl border border-border bg-background p-5 transition hover:border-primary/30 hover:shadow-soft">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="mt-4 font-semibold text-ink">Comunidade de Apoio</h3>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">Continue a jornada em um espaço de troca e acolhimento sobre neurodiversidade.</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Conhecer <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-border bg-card p-6 sm:p-8">
          <Header title="Limitações importantes" icon={<ShieldCheck className="h-5 w-5" />} />
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{analysis.limitations.map((x) => <li key={x}>{x}</li>)}</ul>
          <div className="mt-5 rounded-2xl bg-secondary/50 p-4 text-xs leading-5 text-muted-foreground"><strong className="text-ink">Aviso:</strong> {analysis.disclaimer}</div>
        </section>
      </div>
    </main>
  );
}

function Header({ title, icon }: { title: string; icon: React.ReactNode }) {
  return <div className="flex items-center gap-3"><span className="rounded-xl bg-primary/10 p-2 text-primary">{icon}</span><h2 className="font-display text-2xl font-semibold text-ink">{title}</h2></div>;
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-8"><h2 className="font-display text-xl font-semibold text-ink">{title}</h2><div className="mt-5 space-y-3">{children}</div></section>;
}
function Bullet({ text }: { text: string }) {
  return <div className="rounded-2xl bg-secondary/50 p-4 text-sm leading-6 text-ink">{text}</div>;
}
