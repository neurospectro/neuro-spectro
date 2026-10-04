import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Target, MessageCircle, Heart, Infinity as InfinityIcon, Sun, User, Star, ShieldCheck, FileText, Lock, Instagram, Check, PenLine, LineChart, Sparkles } from "lucide-react";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

const wordmarkUrl = "/neurospectro-wordmark-production.svg?v=3";
const markUrl = "/neurospectro-mark-production.svg?v=3";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroSpectro — Entenda seu perfil. Descubra novas perspectivas." },
      { name: "description", content: "Rastreio inicial online, com base em referências científicas, de características associadas ao espectro autista em adultos. Não é diagnóstico." },
      { property: "og:title", content: "NeuroSpectro — Existe mais sobre você para descobrir" },
      { property: "og:description", content: "Autoavaliação premium e acolhedora sobre características associadas ao espectro autista em adultos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: markUrl, type: "image/webp" }],
  }),
  component: Index,
});

const dims = [
  { icon: Brain, label: "Cognição" },
  { icon: Target, label: "Atenção" },
  { icon: MessageCircle, label: "Comunicação" },
  { icon: Heart, label: "Sensibilidade" },
  { icon: InfinityIcon, label: "Rotina" },
  { icon: Sun, label: "Concentração" },
  { icon: User, label: "Personalidade" },
  { icon: Star, label: "Funcionamento cotidiano" },
];

const refs = ["AQ-50", "AQ-10", "RAADS-R", "CAT-Q", "AAA"];

const steps = [
  { n: "01", icon: PenLine, t: "Responda", d: "48 afirmações simples, no seu ritmo." },
  { n: "02", icon: LineChart, t: "Analisamos", d: "Suas respostas são organizadas em 8 dimensões." },
  { n: "03", icon: Sparkles, t: "Descubra", d: "Veja uma prévia e decida se quer o relatório completo." },
];

const identification = [
  "Você sente que pensa ou percebe o mundo de um jeito diferente.",
  "Situações sociais exigem mais energia do que parecem exigir dos outros.",
  "Sons, luzes ou mudanças de rotina afetam você mais do que o esperado.",
  "Você quer organizar essas percepções antes de conversar com um profissional.",
];

const deliverables = [
  "Leitura detalhada das 8 dimensões avaliadas",
  "Pontos de destaque do seu perfil, em linguagem acolhedora",
  "Material para levar a uma conversa com um profissional",
  "Acesso protegido, vinculado à sua conta",
];

function Cta({ className = "" }: { className?: string }) {
  return (
    <Link
      to="/avaliacao"
      className={`inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 font-display text-base font-semibold text-primary-foreground shadow-soft transition-transform hover:-translate-y-0.5 ${className}`}
    >
      Iniciar minha avaliação
    </Link>
  );
}

function MarkImage({ className = "", eager = false }: { className?: string; eager?: boolean }) {
  return (
    <img
      src={markUrl}
      alt="Cérebro formado por peças de quebra-cabeça em cores suaves, símbolo da NeuroSpectro"
      width={500}
      height={480}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      className={`h-auto w-full object-contain ${className}`}
    />
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:py-5">
        <Link to="/" className="flex items-center" aria-label="NeuroSpectro — início">
          <img src={wordmarkUrl} alt="NeuroSpectro" width={894} height={180} className="h-8 w-auto md:h-9" />
        </Link>
        <Link
          to="/avaliacao"
          className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
        >
          Começar avaliação
        </Link>
      </header>

      <main>
        {/* 1. HERO */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-spec-violet/30 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-spec-mint/50 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-4 md:grid-cols-[1.05fr_1fr] md:pb-20 md:pt-16">
            <div className="order-2 md:order-1">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Autoconhecimento com mais clareza.</p>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
                Entenda melhor seu jeito de <span className="text-primary">funcionar.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-7 text-muted-foreground">
                Uma avaliação online, acolhedora e estruturada para explorar características associadas ao espectro autista em adultos.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Cta />
                <span className="text-sm text-muted-foreground">Gratuita para começar · 48 afirmações</span>
              </div>
              <div className="mt-8 h-1 w-40 rounded-full bg-spectrum" />
            </div>
            <div className="order-1 flex justify-center md:order-2">
              <div className="relative w-full max-w-xs md:max-w-md">
                <div aria-hidden className="absolute inset-6 rounded-full bg-spectrum opacity-30 blur-3xl" />
                <MarkImage eager className="relative" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. IDENTIFICAÇÃO */}
        <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <div className="grid items-center gap-8 rounded-[2rem] border border-border bg-card p-6 shadow-soft md:gap-10 md:grid-cols-[1fr_1.4fr] md:p-12">
            <div className="mx-auto w-full max-w-[220px] md:max-w-[300px]">
              <div className="rounded-[2rem] bg-secondary/60 p-6">
                <MarkImage />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Isso parece com você?</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">Talvez algumas peças já façam sentido para você.</h2>
              <ul className="mt-6 space-y-3">
                {identification.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <h2 className="font-display text-3xl font-semibold text-ink">O que você vai explorar</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Uma visão organizada de diferentes aspectos que podem aparecer no seu cotidiano.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-4">
            {dims.map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-soft sm:p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary"><Icon className="h-5 w-5" /></div>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-ink">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. COMO FUNCIONA */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl font-semibold text-ink">Como funciona</h2>
          <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-3 md:gap-6">
            {steps.map(({ n, icon: Icon, t, d }) => (
              <div key={n} className="rounded-3xl bg-card p-6 shadow-soft sm:p-7">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"><Icon className="h-5 w-5" /></div>
                  <span className="font-display text-sm font-semibold text-primary">{n}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
                <div className="mt-6 h-1 w-16 rounded-full bg-spectrum" />
              </div>
            ))}
          </div>
        </section>

        {/* 4. O QUE VOCÊ RECEBE */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid items-center gap-8 md:gap-10 md:grid-cols-2">
            <div className="relative mx-auto w-full max-w-md">
              <div aria-hidden className="absolute -inset-4 rounded-[2.5rem] bg-spectrum opacity-20 blur-2xl" />
              <div className="relative rounded-[2rem] border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center justify-between border-b border-border pb-4">
                  <img src={wordmarkUrl} alt="" aria-hidden width={894} height={180} loading="lazy" className="h-6 w-auto" />
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary">Relatório completo</span>
                </div>
                <div className="grid grid-cols-[96px_1fr] items-center gap-5 pt-5">
                  <MarkImage />
                  <div className="space-y-2.5">
                    {[80, 62, 90, 54].map((w, i) => (
                      <div key={i} className="h-2 rounded-full bg-muted">
                        <div className="h-2 rounded-full bg-spectrum" style={{ width: `${w}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {dims.slice(0, 8).map(({ icon: Icon, label }) => (
                    <div key={label} className="flex h-10 items-center justify-center rounded-xl bg-secondary/70 text-primary" title={label}>
                      <Icon className="h-4 w-4" />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-center text-[11px] text-muted-foreground">Ilustração do formato do relatório</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">O que você recebe</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Um relatório feito para transformar respostas em clareza.</h2>
              <ul className="mt-6 space-y-3">
                {deliverables.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. PROVA SOCIAL */}
        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-6 text-center md:mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Experiências</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">O que essa jornada pode ajudar você a organizar</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Veja exemplos do tipo de descoberta e reflexão que o NeuroSpectro foi desenvolvido para apoiar.</p>
          </div>
          <TestimonialsCarousel />
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:py-10">
          <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-6 shadow-soft md:p-9">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Uma opção para continuar depois da avaliação</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">Você não precisa explorar tudo isso sozinho.</h2>
              <p className="mt-3 text-muted-foreground">
                Um espaço para continuar essa jornada com troca de experiências, conteúdos exclusivos e apoio sobre neurodiversidade.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-ink py-14 text-ink-foreground md:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] opacity-70">Referências científicas</p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl font-semibold">Construída sobre dimensões presentes em instrumentos reconhecidos de rastreio em adultos.</h2>
            <div className="mt-8 flex flex-wrap gap-3">
              {refs.map((r) => (
                <span key={r} className="rounded-full border border-ink-foreground/20 px-4 py-2 text-sm">{r}</span>
              ))}
            </div>
            <p className="mt-6 max-w-2xl text-sm opacity-70">
              A NeuroSpectro usa perguntas próprias, inspiradas nos construtos desses instrumentos. Não reproduz os questionários originais.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-4 md:grid-cols-3 md:gap-6">
            {[
              [ShieldCheck, "Privacidade em primeiro lugar", "Tratamos suas respostas como dados pessoais sensíveis e evitamos expor informações individuais em ferramentas de publicidade."],
              [Lock, "Acesso protegido", "Resultados completos devem ficar vinculados à sua conta e protegidos por controle de acesso no servidor."],
              [FileText, "Informação, não diagnóstico", "A NeuroSpectro organiza uma leitura de características. O resultado não substitui avaliação de um profissional qualificado."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <div key={t as string} className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-7">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary">
                    <I className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-ink">{t as string}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{d as string}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 7. CTA FINAL */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-spec-violet/25 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-5 pb-14 pt-8 text-center md:pb-20 md:pt-10">
            <div className="mx-auto w-40 md:w-52">
              <MarkImage />
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold text-ink md:text-4xl">Comece a entender seu perfil com mais clareza.</h2>
            <Cta className="mt-8" />
            <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-muted p-5 text-sm text-muted-foreground">
              <strong className="text-ink">Importante:</strong> a NeuroSpectro oferece um rastreio inicial e não realiza diagnóstico. Apenas profissionais de saúde qualificados podem avaliar e diagnosticar o espectro autista.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-5">
          <span>© {new Date().getFullYear()} NeuroSpectro · Rastreio, não diagnóstico.</span>
          <a
            href="https://www.instagram.com/neurospectro"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram da NeuroSpectro"
            title="Instagram da NeuroSpectro"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
