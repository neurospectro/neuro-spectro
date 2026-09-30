import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import mark from "@/assets/mark.png.asset.json";
import { ASSESSMENT, DIMENSIONS } from "@/lib/assessment/questions";
import { supabase } from "@/lib/supabase";
import "@/styles/report-print.css";

type Score = { id: string; label: string; raw: number; max: number };
type Result = {
  id: string;
  created_at: string;
  total_raw: number;
  max_raw: number;
  scores: Score[];
};

export const Route = createFileRoute("/relatorio-pdf")({ component: RelatorioPdf });

function RelatorioPdf() {
  const [result, setResult] = useState<Result | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void load();
  }, []);

  async function load() {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setLoading(false);
      return;
    }
    setEmail(auth.user.email ?? "");
    const { data: access } = await supabase
      .from("acessos")
      .select("status,expires_at,produtos(slug)")
      .eq("status", "active")
      .eq("produtos.slug", "relatorio-completo")
      .limit(1)
      .maybeSingle();

    const accessRow = access as { status: string; expires_at: string | null; produtos?: { slug: string } | null } | null;
    const validAccess = Boolean(
      accessRow?.status === "active" &&
      accessRow?.produtos?.slug === "relatorio-completo" &&
      (!accessRow.expires_at || new Date(accessRow.expires_at).getTime() > Date.now()),
    );
    if (!validAccess) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("resultados")
      .select("id,created_at,total_raw,max_raw,scores")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setResult((data ?? null) as Result | null);
    setLoading(false);
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-muted-foreground">Preparando seu relatório...</main>;
  }

  if (!result) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Relatório indisponível</h1>
          <p className="mt-2 text-sm text-muted-foreground">Faça uma avaliação e entre na sua conta para visualizar o relatório.</p>
          <Link to="/dashboard" className="mt-5 inline-block text-primary">Voltar para minha área</Link>
        </div>
      </main>
    );
  }

  const generatedAt = new Date(result.created_at);
  const date = generatedAt.toLocaleDateString("pt-BR");
  const reportId = `NS-${result.id.slice(0, 8).toUpperCase()}`;

  return (
    <main className="min-h-screen bg-secondary/40 px-4 py-8 font-sans print:bg-white print:p-0">
      <div className="mx-auto mb-5 flex max-w-[210mm] items-center justify-between print:hidden">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Minha área
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
        >
          <Download className="h-4 w-4" /> Salvar como PDF
        </button>
      </div>

      <article className="report-paper mx-auto min-h-[297mm] w-full max-w-[210mm] bg-white text-slate-800 shadow-xl print:min-h-0 print:max-w-none print:shadow-none">
        <div className="report-header">
          <div className="flex items-start justify-between gap-8">
            <div className="flex items-center gap-4">
              <img src={mark.url} alt="NeuroSpectro" className="h-14 w-14" />
              <div>
                <p className="font-display text-xl font-semibold tracking-tight">NeuroSpectro</p>
                <p className="text-xs tracking-wide text-slate-500">Entenda seu perfil. Descubra novas perspectivas.</p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-500">
              <p className="font-semibold uppercase tracking-[0.18em]">Relatório de Autoavaliação</p>
              <p className="mt-1">ID {reportId}</p>
              <p>{date}</p>
            </div>
          </div>
          <div className="mt-7 h-1 rounded-full bg-spectrum" />
        </div>

        <div className="report-body">
          <section className="report-cover">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">NeuroSpectro · Relatório Completo</p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-slate-900">
              Uma leitura organizada das suas respostas
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Este documento reúne os resultados informativos da sua autoavaliação, organizados por dimensões para facilitar o autoconhecimento e uma eventual conversa com um profissional qualificado.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <InfoCard label="Titular" value={email || "Conta NeuroSpectro"} />
              <InfoCard label="Data da avaliação" value={date} />
              <InfoCard label="Avaliação" value={ASSESSMENT.name} />
              <InfoCard label="Versão" value={ASSESSMENT.version} />
            </div>
          </section>

          <section className="report-section">
            <SectionTitle eyebrow="01" title="Sobre esta avaliação" />
            <p>{ASSESSMENT.description} O objetivo é oferecer um ponto de partida para reflexão sobre características e experiências pessoais.</p>
            <div className="report-note mt-5">
              <strong>Importante:</strong> este relatório é informativo e de autoconhecimento. Ele não constitui diagnóstico, não estabelece ponto de corte clínico e não substitui avaliação realizada por profissional qualificado.
            </div>
          </section>

          <section className="report-section">
            <SectionTitle eyebrow="02" title="Perfil por dimensões" />
            <div className="grid gap-5">
              {result.scores.map((score) => {
                const pct = score.max ? Math.round((score.raw / score.max) * 100) : 0;
                const dimension = DIMENSIONS.find((d) => d.id === score.id);
                return (
                  <div key={score.id} className="rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{score.label}</h3>
                        {dimension && <p className="mt-1 text-xs leading-5 text-slate-500">{dimension.description}</p>}
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{score.raw}/{score.max}</span>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{pct}% da pontuação possível nesta dimensão, sem interpretação clínica ou ponto de corte.</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="report-section">
            <SectionTitle eyebrow="03" title="Como interpretar estes resultados" />
            <p>As pontuações representam a forma como as respostas foram distribuídas nas dimensões avaliadas. Uma pontuação maior ou menor não determina, por si só, uma condição clínica.</p>
            <p className="mt-4">O valor deste relatório está em identificar temas que podem merecer observação, reflexão e, se fizer sentido para você, uma conversa mais aprofundada com um profissional.</p>
          </section>

          <section className="report-section">
            <SectionTitle eyebrow="04" title="Pontos para explorar" />
            <div className="grid gap-3 sm:grid-cols-2">
              {result.scores
                .slice()
                .sort((a, b) => (b.max ? b.raw / b.max : 0) - (a.max ? a.raw / a.max : 0))
                .slice(0, 4)
                .map((score) => (
                  <div key={`explore-${score.id}`} className="rounded-2xl bg-slate-50 p-5">
                    <p className="font-semibold text-slate-900">{score.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Observe como características relacionadas a esta dimensão aparecem no seu cotidiano, em diferentes contextos e ao longo do tempo.
                    </p>
                  </div>
                ))}
            </div>
          </section>

          <section className="report-section">
            <SectionTitle eyebrow="05" title="Perguntas para uma conversa com profissional" />
            <ol className="space-y-3">
              {[
                "Quais aspectos deste relatório fazem sentido para a minha experiência?",
                "Existem outros fatores que poderiam explicar essas características ou experiências?",
                "Seria pertinente realizar uma avaliação clínica mais aprofundada?",
                "Quais estratégias poderiam ajudar nas situações que mais me causam desgaste?",
              ].map((question, index) => (
                <li key={question} className="flex gap-3 rounded-2xl border border-slate-200 p-4 text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-primary">{index + 1}.</span>
                  <span>{question}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="report-section">
            <SectionTitle eyebrow="06" title="Metodologia e limitações" />
            <p>{ASSESSMENT.methodological_notes}</p>
            <p className="mt-4">Os itens são autorais e foram construídos a partir de construtos descritos em referências metodológicas. As referências não significam que o NeuroSpectro seja equivalente ou validado como qualquer instrumento citado.</p>
            <div className="mt-5 rounded-2xl border border-slate-200 p-5 text-xs leading-6 text-slate-600">
              <p className="font-semibold text-slate-800">Referências metodológicas</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {ASSESSMENT.scientific_references.map((reference) => <li key={reference}>{reference}</li>)}
              </ul>
            </div>
          </section>

          <section className="report-section report-final">
            <div className="rounded-3xl bg-slate-50 p-7">
              <div className="flex gap-4">
                <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h2 className="font-display text-xl font-semibold text-slate-900">Uma descoberta é um ponto de partida</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Use este relatório para entender melhor suas próprias experiências, formular perguntas e decidir quais próximos passos fazem sentido para você.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="report-footer">
          <div>
            <p className="font-semibold">NeuroSpectro</p>
            <p>Entenda seu perfil. Descubra novas perspectivas.</p>
          </div>
          <div className="text-right">
            <p>Material informativo e de autoconhecimento.</p>
            <p>Não constitui diagnóstico ou avaliação clínica.</p>
          </div>
        </footer>
      </article>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-medium leading-5 text-slate-800">{value}</p>
    </div>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">{eyebrow}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-slate-900">{title}</h2>
    </div>
  );
}

