import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Users, FileText, Clock, Zap, Mail } from "lucide-react";
import mark from "@/assets/mark.png.asset.json";
import { ASSESSMENT, DIMENSIONS, SCALE, getVisibleQuestions, scoreByDimension } from "@/lib/assessment/questions";
import { persistCompletedAssessment } from "@/lib/assessment/persistence";
import { getOffer, formatBRL } from "@/lib/offers";
import { supabase } from "@/lib/supabase";

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
type Session = { answers: Record<string, number>; index: number; startedAt: string; finishedAt?: string | undefined };

function Avaliacao() {
  const questions = useMemo(() => getVisibleQuestions(), []);
  const [session, setSession] = useState<Session | null>(null);
  const [started, setStarted] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [leadSaving, setLeadSaving] = useState(false);

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

  const begin = async (fresh: boolean) => {
    setLeadError("");
    const email = leadEmail.trim().toLowerCase();

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setLeadError("Digite um e-mail válido para continuar.");
      return;
    }

    if (!marketingConsent) {
      setLeadError("Marque a opção para receber novidades e conteúdos da NeuroSpectro.");
      return;
    }

    if (!supabase) {
      setLeadError("Não foi possível conectar agora. Tente novamente.");
      return;
    }

    setLeadSaving(true);
    try {
      const { error } = await supabase.from("marketing_leads").upsert(
        { email, marketing_consent: true, source: "assessment" },
        { onConflict: "email", ignoreDuplicates: true },
      );

      if (error) throw error;

      if (fresh || !session) {
        setSession({ answers: {}, index: 0, startedAt: new Date().toISOString() });
      }
      setStarted(true);
    } catch (error) {
      console.error("MARKETING_LEAD_SAVE_FAILED", error);
      setLeadError("Não foi possível salvar seu e-mail. Tente novamente.");
    } finally {
      setLeadSaving(false);
    }
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

        <div className="mx-auto mt-7 max-w-md rounded-3xl border border-primary/20 bg-primary/5 p-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Depois da avaliação</p>
          <div className="mt-4 space-y-4">
            <div className="flex gap-3">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-ink">Resultado completo e relatório em PDF</p>
                <p className="mt-1 text-sm text-muted-foreground">Uma leitura organizada para seu autoconhecimento e para levar a uma conversa com um profissional, se desejar.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="font-semibold text-ink">Comunidade de Apoio - NeuroSpectro</p>
                <p className="mt-1 text-sm text-muted-foreground">Uma comunidade opcional com conteúdos exclusivos, troca de experiências e conversas sobre neurodiversidade.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-md rounded-2xl bg-secondary p-4 text-sm text-secondary-foreground">
          Esta é uma autoavaliação informativa e de autoconhecimento. Não é um diagnóstico e não substitui a avaliação de um profissional de saúde.
        </p>
        <div className="mx-auto mt-7 max-w-md rounded-3xl border border-border bg-card p-5 text-left shadow-soft">
          <div className="flex gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-ink">Antes de começar, deixe seu e-mail</p>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">Assim podemos enviar seu resultado, novidades e conteúdos da NeuroSpectro para você acompanhar sua jornada mesmo depois de concluir a avaliação.</p>
            </div>
          </div>
          <input
            id="assessment-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={leadEmail}
            onChange={(event) => { setLeadEmail(event.target.value); setLeadError(""); }}
            placeholder="seu@email.com"
            className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <label className="mt-3 flex cursor-pointer gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={marketingConsent}
              onChange={(event) => { setMarketingConsent(event.target.checked); setLeadError(""); }}
              className="mt-0.5 h-4 w-4 accent-primary"
            />
            <span>Quero receber por e-mail conteúdos, novidades e ofertas da NeuroSpectro. Posso cancelar quando quiser.</span>
          </label>
          {leadError && <p className="mt-3 text-xs font-medium text-destructive">{leadError}</p>}
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          {hasSaved ? (
            <>
              <button onClick={() => void begin(false)} disabled={leadSaving} className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground shadow-soft">
                Continuar de onde parei ({count}/{questions.length})
              </button>
              <button onClick={() => void begin(true)} disabled={leadSaving} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <RotateCcw className="h-4 w-4" /> Recomeçar do zero
              </button>
            </>
          ) : (
            <button onClick={() => void begin(true)} disabled={leadSaving} className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground shadow-soft">
              Começar avaliação
            </button>
          )}
        </div>
      </Shell>
    );
  }

  if (session.finishedAt) return <Done session={session} onReview={() => setSession({ ...session, finishedAt: undefined, index: 0 })} />;

  const q = questions[session.index]!;
  const answered = Object.keys(session.answers).length;
  const current = session.answers[q.question_id];
  const dim = DIMENSIONS.find((d) => d.id === q.dimension)!;
  const isLast = session.index === questions.length - 1;
  const allDone = answered === questions.length;

  const go = (i: number) =>
    setSession((s) =>
      s ? { ...s, index: Math.max(0, Math.min(questions.length - 1, i)) } : s,
    );

  const choose = (v: number) => {
    setSession((s) => {
      if (!s) return s;

      // Ignore stale/duplicate clicks from the previous question. This prevents
      // rapid taps from queuing multiple advances and skipping unanswered items.
      const currentQuestion = questions[s.index];
      if (!currentQuestion || currentQuestion.question_id !== q.question_id) return s;

      const answers = { ...s.answers, [q.question_id]: v };

      return {
        ...s,
        answers,
        index: isLast ? s.index : Math.min(s.index + 1, questions.length - 1),
      };
    });
  };
  const finish = () => {
    const finishedAt = new Date().toISOString();
    const completed = { ...session, finishedAt };
    setSession(completed);
    void persistCompletedAssessment({
      session: completed,
      assessmentId: ASSESSMENT.assessment_id,
      assessmentVersion: ASSESSMENT.version,
      questions,
      scores: scoreByDimension(completed.answers),
    }).catch((error) => {
      // Local session stays the source for the anonymous flow; record the failure so it is detectable.
      console.error("ASSESSMENT_PERSIST_FAILED", error);
      try {
        localStorage.setItem("ns-persist-failed", JSON.stringify({ at: new Date().toISOString(), message: String(error?.message ?? error) }));
      } catch {
        /* storage unavailable */
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <header className="mx-auto w-full max-w-2xl px-5 pt-16 sm:pt-6">
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
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Esta é uma prévia informativa da sua pontuação por dimensão. O Relatório Completo organiza essa leitura em uma experiência mais aprofundada.</p>
      <div className="mx-auto mt-8 grid max-w-md gap-3 text-left">
        {scores.map((s) => (
          <div key={s.dimension.id}>
            <div className="flex justify-between text-sm"><span className="font-medium text-ink">{s.dimension.label}</span><span className="text-muted-foreground">{s.raw}/{s.max}</span></div>
            <div className="mt-1 h-2 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${(s.raw / s.max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-6 max-w-md text-xs text-muted-foreground">Não é diagnóstico. Pontuações indicam maior ou menor presença de características em cada dimensão, sem pontos de corte clínicos.</p>

      <ReportOffer session={session} />

      <button onClick={onReview} className="mt-6 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary">Revisar respostas</button>
    </Shell>
  );
}

function ReportOffer({ session }: { session: Session }) {
  const offer = getOffer("report-full-2490");
  const ends = new Date(session.finishedAt!).getTime() + 7 * 60 * 1000;
  const [remaining, setRemaining] = useState(Math.max(0, ends - Date.now()));
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(Math.max(0, ends - Date.now())), 1000);
    const popupTimer = window.setTimeout(() => setOpen(true), 1400);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(popupTimer);
    };
  }, [ends]);

  const expired = remaining <= 0;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  return (
    <>
      <div className="mx-auto mt-7 max-w-md rounded-3xl border-2 border-red-500 bg-card p-6 text-left shadow-[0_0_35px_rgba(239,68,68,0.18)]">
        <div className="rounded-2xl bg-gradient-to-r from-red-700 via-red-500 to-red-700 p-5 text-white">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-100">Oferta especial da sua avaliação</p>
          <h2 className="mt-2 font-display text-[1.65rem] font-black leading-tight sm:text-3xl">Seu Relatório Completo NeuroSpectro</h2>
          <p className="mt-2 text-sm font-medium text-red-50">Desbloqueie a leitura completa das suas respostas.</p>
        </div>
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex items-end justify-between">
            <div><p className="text-xs font-bold text-red-700">DE</p><p className="text-lg line-through text-red-900/60">R$ 69,90</p></div>
            <div className="text-right"><p className="text-xs font-black text-red-700">HOJE</p><p className="text-3xl font-black text-red-700">R$ 24,90</p></div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 p-4">
          <Clock className="h-6 w-6 text-red-500" />
          <div><p className="text-sm font-bold text-ink">{expired ? "Condição encerrada" : "Condição especial da sua sessão"}</p><p className="font-display text-2xl font-black tabular-nums text-red-600">{expired ? "00:00" : `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`}</p></div>
        </div>
        <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
          <li>✓ Análise completa das dimensões</li><li>✓ Leitura organizada dos padrões</li><li>✓ Pontos para explorar com profissional</li>
        </ul>
        <button
          type="button"
          disabled={expired}
          onClick={() => setOpen(true)}
          className="mt-6 w-full rounded-2xl bg-red-600 px-6 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_8px_24px_rgba(220,38,38,0.3)] transition-transform hover:bg-red-500 active:scale-[0.99] disabled:opacity-40"
        >
          {expired ? "Condição encerrada" : "LIBERAR AGORA"}
        </button>
        <p className="mt-3 text-center text-xs text-muted-foreground">Pagamento único · acesso por tempo indeterminado.</p>
      </div>

      {open && !expired && offer && <OfferCheckoutModal offer={offer} />}
    </>
  );
}

function OfferCheckoutModal({ offer }: { offer: ReturnType<typeof getOffer> }) {
  if (!offer) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center bg-black/70 p-2 backdrop-blur-md sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="checkout-offer-title">
      <div className="max-h-[94dvh] w-full max-w-lg overflow-y-auto rounded-[1.5rem] border-2 border-red-500 bg-background shadow-[0_0_70px_rgba(239,68,68,0.35)] sm:max-h-[90vh] sm:rounded-[2rem]">
        <div className="bg-gradient-to-r from-red-700 via-red-500 to-red-700 px-4 py-4 text-white sm:px-7 sm:py-7">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-red-100">Sua condição especial</p>
          <h2 id="checkout-offer-title" className="mt-2 max-w-[18ch] font-display text-[1.55rem] font-black leading-[1.08] sm:text-3xl">
            Seu Relatório Completo NeuroSpectro
          </h2>
          <p className="mt-2 max-w-md text-xs leading-5 text-red-50 sm:mt-3 sm:text-sm">
            Veja uma leitura mais completa das suas respostas e organize os próximos pontos para explorar.
          </p>
        </div>

        <div className="p-4 sm:p-7">
          <div className="flex items-end justify-between gap-4 rounded-2xl border border-red-200 bg-red-50 p-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-red-700">Valor de referência</p>
              <p className="text-lg font-semibold text-red-900/50 line-through">{formatBRL(offer.referenceCents ?? 6990)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] font-black uppercase tracking-wide text-red-700">Sua condição</p>
              <p className="text-3xl font-black text-red-700">{formatBRL(offer.totalCents)}</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:mt-5 sm:grid-cols-2">
            {["Análise completa das dimensões", "Leitura organizada dos padrões", "Pontos para explorar com profissional"].map((item) => (
              <div key={item} className="rounded-xl border border-red-300 bg-red-50 px-3 py-2.5 text-xs font-semibold leading-5 text-red-900 shadow-sm sm:px-3 sm:py-3 sm:text-sm">
                <span className="mr-2">✓</span>{item}
              </div>
            ))}
          </div>

          <Link
            to="/checkout/$offerId"
            params={{ offerId: offer.id }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-base font-black uppercase tracking-wide text-white shadow-[0_10px_28px_rgba(220,38,38,0.32)] transition-transform hover:bg-red-500 active:scale-[0.99]"
          >
            <Zap className="h-5 w-5" aria-hidden="true" />
            LIBERAR AGORA
          </Link>

          <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
            Você será levado à página de pagamento seguro do Mercado Pago. Pagamento único · acesso por tempo indeterminado.
          </p>
        </div>
      </div>
    </div>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12 text-center font-sans">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  );
}
