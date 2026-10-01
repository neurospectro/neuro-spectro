import { MERCADOPAGO_PUBLIC_KEY } from "@/lib/mercadopago";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Users, FileText, Clock, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import mark from "@/assets/mark.png.asset.json";
import { ASSESSMENT, DIMENSIONS, SCALE, getVisibleQuestions, scoreByDimension } from "@/lib/assessment/questions";
import { persistCompletedAssessment } from "@/lib/assessment/persistence";
import { getOffer, formatBRL } from "@/lib/offers";
import { supabase } from "@/lib/supabase";
import { linkCheckoutEmail } from "@/lib/checkout-account";

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

declare global { interface Window { MercadoPago?: new (key: string, options?: { locale?: string }) => { bricks: () => { create: (type: string, id: string, settings: Record<string, unknown>) => Promise<{ unmount: () => void }> } } } }
const MP_SCRIPT_ID = "mercadopago-js-v2";
function preloadMercadoPago() { if (document.getElementById(MP_SCRIPT_ID) || window.MercadoPago) return; const s=document.createElement("script"); s.id=MP_SCRIPT_ID; s.src="https://sdk.mercadopago.com/js/v2"; s.async=true; document.head.appendChild(s); }

const KEY = `ns-session-${ASSESSMENT.assessment_id}-${ASSESSMENT.version}`;
type Session = { answers: Record<string, number>; index: number; startedAt: string; finishedAt?: string | undefined };

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
    }).catch(() => {
      // The local session remains the source for this anonymous flow; persistence can retry after login.
    });
  };

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
    preloadMercadoPago();
    const timer = window.setInterval(() => setRemaining(Math.max(0, ends - Date.now())), 1000);
    const popupTimer = window.setTimeout(() => setOpen(true), 1400);
    return () => { window.clearInterval(timer); window.clearTimeout(popupTimer); };
  }, [ends]);

  const expired = remaining <= 0;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);

  return <>
    <div className="mx-auto mt-7 max-w-md rounded-3xl border-2 border-red-500 bg-card p-6 text-left shadow-[0_0_35px_rgba(239,68,68,0.18)]">
      <div className="rounded-2xl bg-gradient-to-r from-red-700 via-red-500 to-red-700 p-5 text-white">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-100">Oferta especial da sua avaliação</p>
        <h2 className="mt-2 font-display text-2xl font-black">Seu Relatório Completo NeuroSpectro</h2>
        <p className="mt-2 text-sm font-medium text-red-50">Desbloqueie a leitura completa das suas respostas.</p>
      </div>
      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4">
        <div className="flex items-end justify-between">
          <div><p className="text-xs font-bold text-red-700">DE</p><p className="text-lg line-through text-red-900/60">R$ 69,90</p></div>
          <div className="text-right"><p className="text-xs font-black text-red-700">HOJE</p><p className="text-3xl font-black text-red-700">R$ 24,90</p></div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-red-200 p-4">
        <Clock className="h-6 w-6 text-red-500"/>
        <div><p className="text-sm font-bold text-ink">{expired ? "Condição encerrada" : "Condição especial da sua sessão"}</p><p className="font-display text-2xl font-black tabular-nums text-red-600">{expired ? "00:00" : `${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`}</p></div>
      </div>
      <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
        <li>✓ Análise completa das dimensões</li><li>✓ Leitura organizada dos padrões</li><li>✓ Pontos para explorar com profissional</li><li>✓ Conteúdo informativo e não diagnóstico</li>
      </ul>
      <button type="button" disabled={expired} onClick={() => setOpen(true)} className="mt-6 w-full rounded-full bg-red-600 px-6 py-4 font-black text-white shadow-[0_8px_24px_rgba(220,38,38,0.3)] hover:bg-red-500 disabled:opacity-40">
        {expired ? "Condição encerrada" : "QUERO MEU RELATÓRIO COMPLETO"}
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">Pagamento único · acesso por tempo indeterminado.</p>
    </div>
    {open && !expired && offer && <OfferCheckoutModal offer={offer}/>}
  </>;
}
function OfferCheckoutModal({offer}:{offer: ReturnType<typeof getOffer>}) {
  const brickRef=useRef<{unmount:()=>void}|null>(null); const [loading,setLoading]=useState(true),[processing,setProcessing]=useState(false),[error,setError]=useState(""),[success,setSuccess]=useState(""); const [accountEmail,setAccountEmail]=useState(""); const [accountLinked,setAccountLinked]=useState(false);
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow=""}},[]);
  useEffect(()=>{let cancelled=false;
    const mount=async()=>{try{
      const key=MERCADOPAGO_PUBLIC_KEY; if(!offer) throw new Error("Oferta indisponível."); if(!supabase) throw new Error("Checkout aguardando a conexão com o servidor de pagamentos (VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY).");
      const sessionPromise=supabase.auth.getSession(); const sdkPromise=new Promise<void>((resolve,reject)=>{if(window.MercadoPago)return resolve();const s=document.getElementById(MP_SCRIPT_ID);if(!s)return reject(new Error("Não foi possível iniciar o Mercado Pago."));const t=window.setTimeout(()=>reject(new Error("O checkout demorou mais que o esperado.")),12000);s.addEventListener("load",()=>{window.clearTimeout(t);window.MercadoPago?resolve():reject(new Error("SDK indisponível."))},{once:true});s.addEventListener("error",()=>{window.clearTimeout(t);reject(new Error("Falha ao carregar o Mercado Pago."))},{once:true})});
      const [{data}]=await Promise.all([sessionPromise,sdkPromise]); if(!data.session){const anon=await supabase.auth.signInAnonymously(); if(anon.error||!anon.data.session) throw new Error("Não foi possível iniciar sua sessão de compra. Tente novamente.");}
      if(cancelled||!window.MercadoPago)return; const mp=new window.MercadoPago(key,{locale:"pt-BR"});
      const promise=mp.bricks().create("payment","neurospectro-payment-brick",{initialization:{amount:offer.totalCents/100,payer:{email:data.session?.user.email??""}},customization:{paymentMethods:{bankTransfer:"all",creditCard:"all",debitCard:"all"}},callbacks:{
        onReady:()=>!cancelled&&setLoading(false),
        onSubmit:async({formData}:{selectedPaymentMethod:string;formData:Record<string,unknown>})=>{setError("");setProcessing(true);try{const {data:cur}=await supabase!.auth.getSession();const token=cur.session?.access_token;if(!token)throw new Error("Sua sessão expirou.");const res=await fetch(`${import.meta.env["VITE_SUPABASE_URL"]}/functions/v1/process-payment`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({offerId:offer.id,formData})});const result=await res.json().catch(()=>({}));if(!res.ok)throw new Error(result.error??"Não foi possível processar o pagamento."); const payerEmail=String((formData as {payer?:{email?:string}})?.payer?.email??"").trim(); if(payerEmail){setAccountEmail(payerEmail); const {error:linkError}=await linkCheckoutEmail(payerEmail); if(!linkError){setAccountLinked(true);setSuccess("Pagamento recebido. Enviamos a confirmação para seu e-mail. Depois de confirmar, seu acesso ficará vinculado a ele.");}else{setAccountLinked(false);setSuccess("Pagamento recebido. Seu acesso foi reservado. Conclua a confirmação pelo e-mail informado no pagamento.");}}else setSuccess(result.paymentStatus==="processed"||result.paymentStatus==="approved"?"Pagamento aprovado. Seu acesso foi liberado.":"Pagamento criado. Aguarde a confirmação do Mercado Pago.");}catch(e){setError(e instanceof Error?e.message:"Não foi possível processar o pagamento.");throw e}finally{setProcessing(false)}},
        onError:()=>{setError("O formulário encontrou um problema. Confira os dados e tente novamente.");setProcessing(false)}
      }});
      const brick=await new Promise<Awaited<typeof promise>>((resolve,reject)=>{const t=window.setTimeout(()=>reject(new Error("O checkout demorou mais que o esperado. Tente novamente.")),10000);promise.then(b=>{window.clearTimeout(t);cancelled?b.unmount():resolve(b)},e=>{window.clearTimeout(t);reject(e)})}); if(cancelled){brick.unmount();return} brickRef.current=brick;setLoading(false);
    }catch(e){if(!cancelled){setLoading(false);setError(e instanceof Error?e.message:"Não foi possível carregar o checkout.")}}};
    void mount();return()=>{cancelled=true;brickRef.current?.unmount();brickRef.current=null};
  },[offer?.id,offer?.totalCents]);
  if(!offer)return null;
  return <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 backdrop-blur-md sm:p-5" role="dialog" aria-modal="true" aria-labelledby="checkout-offer-title">
    <div className="flex max-h-[96vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border-2 border-red-500 bg-background shadow-[0_0_70px_rgba(239,68,68,0.35)]">
      <div className="shrink-0 bg-gradient-to-r from-red-700 via-red-500 to-red-700 px-5 py-5 text-white sm:px-7"><p className="text-[11px] font-black uppercase tracking-[0.22em] text-red-100">Oferta especial liberada</p><div className="mt-1 flex items-end justify-between gap-4"><div><h2 id="checkout-offer-title" className="font-display text-2xl font-black sm:text-3xl">Seu Relatório Completo</h2><p className="text-sm text-red-50">Finalize seu relatório com pagamento seguro.</p></div><div className="text-right"><p className="text-xs line-through text-red-100">{formatBRL(offer.referenceCents??6990)}</p><p className="text-3xl font-black">{formatBRL(offer.totalCents)}</p></div></div><div className="mt-4 rounded-xl bg-white/15 px-4 py-2 text-center text-sm font-bold ring-1 ring-white/25">Seu acesso será vinculado ao e-mail informado no pagamento.</div></div>
      <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-7"><div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{["✓ Análise completa","✓ Dimensões avaliadas","✓ Padrões organizados","✓ Não é diagnóstico"].map(x=><div key={x} className="rounded-xl bg-red-50 px-2 py-2 text-center text-[11px] font-bold text-red-800">{x}</div>)}</div>
      <div className="rounded-2xl border border-red-200 bg-white p-3">{loading&&!error&&<div className="flex min-h-28 items-center justify-center gap-3 text-sm text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin text-red-500"/>Preparando pagamento seguro...</div>}<div id="neurospectro-payment-brick"/></div>
      {processing&&<div className="mt-3 flex justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin"/>Processando pagamento...</div>}
      {error&&<div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}
      {success&&<div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"><div className="flex gap-3"><CheckCircle2 className="h-5 w-5"/><div><p>{success}</p>{accountEmail&&<p className="mt-2 font-semibold">{accountLinked?"Verifique seu e-mail para concluir a confirmação.":"Use o e-mail informado no pagamento para finalizar seu acesso."}</p>}</div></div></div>}
      <div className="mt-4 flex items-start gap-3 rounded-2xl bg-muted p-3 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0 text-red-500"/><p>Pagamento processado com segurança pelo Mercado Pago. A NeuroSpectro não armazena dados sensíveis do cartão.</p></div></div>
    </div>
  </div>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 py-12 text-center font-sans">
      <div className="w-full max-w-xl">{children}</div>
    </div>
  );
}
