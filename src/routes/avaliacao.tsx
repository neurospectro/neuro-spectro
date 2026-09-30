import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import mark from "@/assets/mark.png.asset.json";
import { ASSESSMENT, DIMENSIONS, SCALE, getVisibleQuestions, scoreByDimension } from "@/lib/assessment/questions";

export const Route = createFileRoute("/avaliacao")({
  head: () => ({
    meta: [
      { title: "Avaliação — NeuroSpectro" },
      { name: "description", content: "Autoavaliação NeuroSpectro: 48 afirmações, uma por tela, com progresso salvo automaticamente." },
      { property: "og:title", content: "Avaliação — NeuroSpectro" },
      { property: "og:description", content: "Comece sua autoavaliação NeuroSpectro. Rastreio inicial, não diagnóstico." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Avaliacao,
});

const KEY = `ns-session-${ASSESSMENT.assessment_id}-${ASSESSMENT.version}`;
type Session = { answers: Record<string, number>; index: number; startedAt: string; finishedAt?: string };

function Avaliacao() {
  const questions = useMemo(() => getVisibleQuestions(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [started, setStarted] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw) as Session;
        setSession(s);
        setHasSaved(Object.keys(s.answers).length > 0);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (session) localStorage.setItem(KEY, JSON.stringify(session));
  }, [session]);

  const begin = (fresh: boolean) => {
    if (fresh || !session) setSession({ answers: {}, index: 0, startedAt: new Date().toISOString() });
    setStarted(true);
  };

  if (!started || !session) {
    const count = session ? Object.keys(session.answers).length : 0;
    return (
      <Shell>
        <img src={mark.url} alt="" className="mx-auto h-16 w-16" />
        <h1 className="mt-6 font-display text-3xl font-semibold text-ink md:text-4xl">Antes de começar</h1>
        <ul className="mx-auto mt-6 max-w-md space-y-3 text-left text-muted-foreground">
          <li>• São {questions.length} afirmações, uma por tela.</li>
          <li>• Responda pensando em como você costuma ser na maior parte da vida.</li>
          <li>• Não há respostas certas ou erradas. Você pode voltar e mudar qualquer resposta.</li>
          <li>• Seu progresso fica salvo neste aparelho.</li>
        </ul>
        <p className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
          Esta é uma autoavaliação informativa e de autoconhecimento. Não é um diagnóstico e não substitui a avaliação de um profissional de saúde.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          {hasSaved ? (
            <>
              <button onClick={() => begin(false)} className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground shadow-soft">
                Continuar de onde parei ({count}/{questions.length})
              </button>
              <button onClick={() => begin(true)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <RotateCcw className="h-4 w-4" /> Recomeçar do zero
              </button>
            </>
          ) : (
            <button onClick={() => begin(true)} className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground shadow-soft">
              Começar avaliação
            </button>
          )}
        </div>
      </Shell>
    );
  }

  if (session.finishedAt) return <Done session={session} onReview={() => setSession({ ...session, finishedAt: undefined, index: 0 })} />;

  const q = questions[session.index];
  const answered = Object.keys(session.answers).length;
  const current = session.answers[q.question_id];
  const dim = DIMENSIONS.find((d) => d.id === q.dimension)!;
  const isLast = session.index === questions.length - 1;
  const allDone = answered === questions.length;

  const go = (i: number) => setSession({ ...session, index: Math.max(0, Math.min(questions.length - 1, i)) });
  const choose = (v: number) => {
    const answers = { ...session.answers, [q.question_id]: v };
    setSession({ ...session, answers });
    if (!isLast) setTimeout(() => setSession((s) => (s ? { ...s, index: Math.min(s.index + 1, questions.length - 1) } : s)), 280);
  };
  const finish = () => setSession({ ...session, finishedAt: new Date().toISOString() });

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="mx-auto w-full max-w-2xl px-5 pt-6">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <Link to="/" className="flex items-center gap-2"><img src={mark.url} alt="NeuroSpectro" className="h-7 w-7" /></Link>
          <span>{session.index + 1} de {questions.length}</span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={answered} aria-valuemax={questions.length} aria-label="Progresso">
          <div className="h-full rounded-full bg-spectrum transition-all duration-500" style={{ width: `${(answered / questions.length) * 100}%` }} />
        </div>
        <div className="mt-3 flex gap-1" aria-hidden>
          {DIMENSIONS.map((d) => {
            const qs = questions.filter((x) => x.dimension === d.id);
            const done = qs.filter((x) => session.answers[x.question_id] !== undefined).length;
            return <div key={d.id} className={`h-1 flex-1 rounded-full transition-colors ${done === qs.length ? "bg-primary" : done > 0 ? "bg-spec-violet/50" : "bg-border"}`} />;
          })}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-10">
        <div key={q.question_id} className="animate-in fade-in slide-in-from-right-4 duration-300">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">{dim.label}</p>
          <h1 className="mt-4 font-display text-2xl font-semibold leading-snug text-ink md:text-3xl">{q.text}</h1>
          <div className="mt-8 grid gap-3" role="radiogroup" aria-label="Sua resposta">
            {SCALE.map((o) => {
              const sel = current === o.value;
              return (
                <button
                  key={o.value}
                  role="radio"
                  aria-checked={sel}
                  onClick={() => choose(o.value)}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 text-left font-medium transition-all active:scale-[0.99] ${sel ? "border-primary bg-primary/10 text-ink shadow-soft" : "border-border bg-card hover:border-primary/50"}`}
                >
                  {o.label}
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${sel ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                    {sel && <Check className="h-4 w-4" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="mx-auto flex w-full max-w-2xl items-center justify-between px-5 pb-8">
        <button onClick={() => go(session.index - 1)} disabled={session.index === 0} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground disabled:opacity-30">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </button>
        {isLast || allDone ? (
          <button onClick={finish} disabled={!allDone} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-soft disabled:opacity-40">
            {allDone ? "Concluir" : `Faltam ${questions.length - answered}`}
          </button>
        ) : (
          <button onClick={() => go(session.index + 1)} disabled={current === undefined} className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink disabled:opacity-30">
            Avançar <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </footer>
    </div>
  );
}

function Done({ session, onReview }: { session: Session; onReview: () => void }) {
  const scores = scoreByDimension(session.answers);
  const mins = Math.max(1, Math.round((new Date(session.finishedAt!).getTime() - new Date(session.startedAt).getTime()) / 60000));
  return (
    <Shell>
      <div className="mx-auto h-1 w-32 rounded-full bg-spectrum" />
      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Respostas concluídas</h1>
      <p className="mx-auto mt-3 max-w-md text-muted-foreground">Obrigado. Suas respostas foram salvas neste aparelho (tempo: cerca de {mins} min).</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">A página de resultado está em construção. Abaixo, uma prévia interna da pontuação por dimensão.</p>
      <div className="mx-auto mt-8 grid max-w-md gap-3 text-left">
        {scores.map((s) => (
          <div key={s.dimension.id}>
            <div className="flex justify-between text-sm"><span className="font-medium text-ink">{s.dimension.label}</span><span className="text-muted-foreground">{s.raw}/{s.max}</span></div>
            <div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${(s.raw / s.max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-md text-xs text-muted-foreground">Não é diagnóstico. Pontuações indicam maior ou menor presença de características em cada dimensão, sem pontos de corte clínicos.</p>
      <button onClick={onReview} className="mt-6 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary">Revisar respostas</button>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12 text-center font-sans">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  );
}
