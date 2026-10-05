import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Target, MessageCircle, Heart, Infinity as InfinityIcon, Sun, User, Star, ShieldCheck, FileText, Lock, Instagram, Check, PenLine, LineChart, Sparkles } from "lucide-react";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";

const wordmarkUrl = "/neurospectro-wordmark-production.svg?v=3";
const markUrl = "/neurospectro-mark-production.svg?v=3";
const heroIllustrationUrl = "/illustrations/hero-neuro.svg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NeuroSpectro | Suspeita de autismo em adultos: entenda seu perfil" },
      { name: "description", content: "Se você suspeita de autismo, comece uma jornada acolhedora para entender melhor seu perfil e reconhecer padrões do seu jeito de pensar, sentir e perceber o mundo. Rastreio inicial, não diagnóstico." },
      { property: "og:title", content: "NeuroSpectro — Talvez você finalmente encontre palavras para o que sente" },
      { property: "og:url", content: "https://neurospectro.com.br/" },
      { property: "og:image", content: "https://neurospectro.com.br/neurospectro-logo.jpg" },
      { property: "og:image:alt", content: "NeuroSpectro — rastreio inicial e autoconhecimento" },
      { property: "og:description", content: "Uma experiência acolhedora para transformar percepções em clareza e ajudar você a organizar o que sente, pensa e vive." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
        { rel: "preload", as: "image", href: markUrl, type: "image/svg+xml" },
        { rel: "preload", as: "image", href: heroIllustrationUrl, type: "image/svg+xml" },
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
  { n: "01", icon: PenLine, t: "Conte como você se reconhece", d: "Responda 48 afirmações com calma, pensando em como você realmente costuma ser." },
  { n: "02", icon: LineChart, t: "Organizamos", d: "Suas respostas ganham contexto em 8 dimensões do seu funcionamento cotidiano." },
  { n: "03", icon: Sparkles, t: "Entenda", d: "Veja uma prévia das suas respostas e decida se quer aprofundar sua leitura." },
];

const identification = [
  "Você percebe detalhes, sons, ambientes ou estímulos que parecem passar despercebidos para outras pessoas.",
  "Você consegue interagir socialmente, mas muitas vezes sente que isso exige uma energia que ninguém percebe.",
  "Mudanças de rotina, imprevistos, sons, luzes ou outras sensações podem afetar você de uma forma difícil de explicar.",
  "Você começou a suspeitar de autismo e quer organizar o que sente antes de conversar com um profissional.",
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
      Quero começar a me entender
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
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Se você chegou até aqui por uma suspeita, você não está sozinho.</p>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
                Se você suspeita de autismo, talvez esteja procurando <span className="text-primary">um jeito de finalmente se entender melhor.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-7 text-muted-foreground">
                Uma jornada online, acolhedora e estruturada para olhar com mais calma para aquilo que você vive. Para quem passou anos ouvindo que era “só o seu jeito” e agora quer compreender melhor seus padrões, necessidades e experiências. Sem rótulos apressados e sem respostas certas ou erradas.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Cta />
                <span className="text-sm text-muted-foreground">Comece gratuitamente · 48 afirmações · no seu ritmo · sem diagnóstico</span>
              </div>
              <div className="mt-8 h-1 w-40 rounded-full bg-spectrum" />
            </div>
            <div className="order-1 flex justify-center md:order-2">
              <div className="relative w-full max-w-xs md:max-w-md">
                <div aria-hidden className="absolute inset-6 rounded-full bg-spectrum opacity-30 blur-3xl" />
                <img src={heroIllustrationUrl} alt="Ilustração abstrata sobre diferentes formas de perceber e processar o mundo" width="720" height="560" loading="eager" fetchPriority="high" className="relative h-auto w-full object-contain" />
              </div>
            </div>
          </div>
        </section>

        {/* 2. IDENTIFICAÇÃO */}
        <section className="mx-auto max-w-6xl px-5 py-12 md:py-16">
          <div className="grid items-center gap-8 rounded-[2rem] border border-border bg-card p-6 shadow-soft md:gap-10 md:grid-cols-[1fr_1.4fr] md:p-12">
            <div className="mx-auto w-full max-w-[220px] md:max-w-[300px]">
              <div className="rounded-[2rem] bg-secondary/60 p-4">
                <img src="/illustrations/identification.svg" alt="Ilustração de uma pessoa representando autopercepção e identificação" width="640" height="520" loading="lazy" className="h-auto w-full object-contain" />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Você se reconhece aqui?</p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">Talvez você tenha aprendido a se adaptar tanto que passou a duvidar do que sente. Olhar para esses padrões com acolhimento pode ser o começo de uma nova compreensão.</h2>
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
          <div className="mb-7 flex justify-center md:mb-9">
            <img src="/illustrations/dimensions.svg" alt="Ilustração das diferentes dimensões exploradas pela avaliação" width="720" height="420" loading="lazy" className="h-auto w-full max-w-2xl object-contain" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink">Talvez exista um nome para aquilo que você passou anos tentando explicar</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">Exploramos dimensões do cotidiano relacionadas à comunicação, sensibilidade, atenção, rotina e outras experiências que podem aparecer em adultos que investigam uma possível neurodivergência.</p>
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
          <h2 className="font-display text-3xl font-semibold text-ink">Um processo simples, no seu ritmo e sem julgamentos</h2>
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
                <img src="/illustrations/report.svg" alt="Ilustração de um relatório visual com indicadores de perfil" width="640" height="520" loading="lazy" className="mb-5 h-auto w-full object-contain" />
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
              <h2 className="mt-3 font-display text-3xl font-semibold text-ink">Mais do que respostas: um espelho organizado para ajudar você a olhar para a própria história.</h2>
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
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Talvez você não esteja exagerando. Talvez só tenha passado tempo demais tentando se adaptar.</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Quando uma experiência ganha contexto, ela pode deixar de parecer confusa. A jornada não entrega um rótulo: ela ajuda você a formular perguntas melhores e, se fizer sentido, buscar uma avaliação profissional.</p>
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
          <h2 id="faq-title" className="mt-3 font-display text-3xl font-semibold text-ink">Talvez você também esteja se perguntando</h2>
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
            <h2 className="mt-6 font-display text-3xl font-semibold text-ink md:text-4xl">Você passou tempo suficiente tentando descobrir sozinho. Agora pode ser um bom momento para olhar para sua história com mais gentileza, clareza e acolhimento.</h2>
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
