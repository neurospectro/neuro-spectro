import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Target, MessageCircle, Heart, Infinity as InfinityIcon, Sun, User, Star, ShieldCheck, FileText, Lock, Instagram, Check, PenLine, LineChart, Sparkles } from "lucide-react";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroSpectro — Um universo. Muitas formas de ver o mundo." },
      { name: "description", content: "Uma jornada acolhedora para adultos que querem compreender melhor seu jeito de perceber, sentir e viver. Rastreio inicial relacionado ao autismo, não diagnóstico." },
      { property: "og:title", content: "NeuroSpectro — Um universo. Muitas formas de ver o mundo." },
      { property: "og:url", content: "https://neurospectro.com.br/" },
      { property: "og:image:alt", content: "NeuroSpectro — rastreio inicial e autoconhecimento" },
      { property: "og:description", content: "Uma experiência acolhedora para transformar percepções em clareza e ajudar você a organizar o que sente, pensa e vive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      ],
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
  { n: "01", icon: PenLine, t: "Responda", d: "48 afirmações, no seu ritmo." },
  { n: "02", icon: LineChart, t: "Organizamos", d: "Suas respostas em 8 dimensões." },
  { n: "03", icon: Sparkles, t: "Compreenda", d: "Veja seus padrões com mais clareza." },
];

const identification = [
  "Você percebe coisas que outras pessoas parecem não notar.",
  "Algumas situações sociais consomem mais energia do que deixam transparecer.",
  "Sons, luzes ou mudanças podem afetar você de forma intensa.",
  "Você quer entender esses padrões e encontrar respostas para perguntas que carrega há algum tempo.",
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
      Fazer avaliação
    </Link>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:py-5">
        <Link to="/" className="flex items-center" aria-label="NeuroSpectro — início">
          <span className="font-display text-lg font-semibold text-ink md:text-xl">NeuroSpectro</span>
        </Link>
        <Link
          to="/avaliacao"
          className="inline-flex items-center justify-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/10"
        >
          Fazer avaliação
        </Link>
      </header>

      <main>
        {/* 1. HERO */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-spec-violet/30 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-spec-mint/50 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-4 md:grid-cols-[1.05fr_1fr] md:pb-20 md:pt-16">
            <div className="order-2 md:order-1">
              <p className="text-sm font-medium text-primary">Um universo. Muitas formas de ver o mundo.</p>
              <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-[1.08] text-ink md:text-6xl">
                Você pode <span className="text-primary">perceber o mundo de um jeito diferente.</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                Aquilo que você sempre chamou de “seu jeito” merece ser compreendido com mais atenção.
              </p>
              <div className="mt-7 flex flex-col items-start gap-3">
                <Cta className="min-h-14 px-9 text-base shadow-lg ring-4 ring-primary/10 hover:scale-[1.02]" />
                <span className="text-xs text-muted-foreground">48 afirmações · no seu ritmo · sem julgamento</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. IDENTIFICAÇÃO */}
        <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <div className="grid items-center gap-8 rounded-[2rem] border border-border bg-card p-6 shadow-soft md:gap-10 md:grid-cols-[1fr_1.4fr] md:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Você se reconhece aqui?</p>
              <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-ink md:text-3xl">Você aprendeu a se adaptar. E, com o tempo, pode ter começado a duvidar do que sente.</h2>
              <p className="mt-3 text-muted-foreground">Reconhecer esses padrões pode ser o começo de uma nova compreensão.</p>
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
          <h2 className="font-display text-3xl font-semibold leading-tight text-ink">Existe mais para compreender.</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Explore diferentes dimensões de como você percebe, sente e vive o cotidiano.</p>
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
          <h2 className="font-display text-3xl font-semibold text-ink">Simples para começar. Profundo para compreender.</h2>
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
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">O que você recebe</p>
              <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink">Uma forma mais clara de olhar para você.</h2>
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
            <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-ink">Você não está exagerando.</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Você pode ter passado tempo demais tentando se adaptar.</p>
          </div>
          <TestimonialsCarousel />
        </section>

        <section className="mx-auto max-w-6xl px-5 py-8 md:py-10">
          <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-6 shadow-soft md:p-9">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Uma opção para continuar depois da avaliação</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">Você não precisa entender tudo sozinho.</h2>
              <p className="mt-3 text-muted-foreground">
                Depois de começar, você pode continuar sua jornada com conteúdos, experiências e uma comunidade voltada à neurodiversidade.
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

        <section className="mx-auto max-w-4xl px-5 py-16" aria-labelledby="faq-title">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Antes de começar</p>
          <h2 id="faq-title" className="mt-3 font-display text-3xl font-semibold text-ink">Antes de começar, algumas respostas</h2>
          <div className="mt-8 space-y-4">
            {[
              ["O NeuroSpectro diagnostica autismo?", "Não. O NeuroSpectro oferece um rastreio inicial e uma leitura organizada de características relacionadas ao espectro autista em adultos. O resultado não é diagnóstico e não substitui uma avaliação feita por profissional qualificado."],
              ["Para quem é a avaliação?", "Para adultos que percebem padrões em comunicação, sensibilidade, atenção, rotina ou interação social e querem compreender melhor essas experiências, inclusive pessoas que começaram a suspeitar de autismo mais tarde na vida."],
              ["Preciso já saber se sou autista para começar?", "Não. Você pode começar justamente porque ainda está tentando entender o que acontece. A proposta é oferecer um ponto de partida organizado, acolhedor e sem julgamento."],
              ["Como funciona?", "Você responde 48 afirmações no seu ritmo. As respostas são organizadas em 8 dimensões e você pode visualizar uma prévia antes de decidir se deseja aprofundar a leitura no relatório completo."],
              ["O resultado substitui uma consulta?", "Não. Ele pode ajudar você a organizar percepções e perguntas para uma conversa com um profissional, mas somente uma avaliação clínica adequada pode diagnosticar o transtorno do espectro autista."]
            ].map(([q,a]) => (
              <details key={q} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <summary className="cursor-pointer font-display font-semibold text-ink">{q}</summary>
                <p className="mt-3 leading-7 text-muted-foreground">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 7. CTA FINAL */}
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-spec-violet/25 blur-3xl" />
          <div className="relative mx-auto max-w-4xl px-5 pb-14 pt-8 text-center md:pb-20 md:pt-10">
            <div className="mx-auto w-40 md:w-52">
              <MarkImage />
            </div>
            <h2 className="mt-6 font-display text-3xl font-semibold leading-tight text-ink md:text-4xl">É hora de olhar para você com mais gentileza.</h2>
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
