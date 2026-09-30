import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Target, MessageCircle, Heart, Infinity as InfinityIcon, Sun, User, Star, ShieldCheck, FileText, Lock, Users } from "lucide-react";
import { TestimonialsCarousel } from "@/components/testimonials-carousel";
import logo from "@/assets/logo.png.asset.json";
import mark from "@/assets/mark.png.asset.json";

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

function Index() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={mark.url} alt="" className="h-9 w-9" />
          <span className="font-display text-lg font-semibold text-ink">
            Neuro<span className="text-primary">Spectro</span>
          </span>
        </Link>
        <Link to="/avaliacao" className="rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
          Começar
        </Link>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-spec-violet/30 blur-3xl" />
          <div aria-hidden className="pointer-events-none absolute -left-24 top-40 h-80 w-80 rounded-full bg-spec-mint/50 blur-3xl" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-10 md:grid-cols-2 md:pt-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">Diferentes formas de pensar. Um só universo.</p>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
                Existe mais sobre você <span className="text-primary">para descobrir.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg text-muted-foreground">
                Um rastreio inicial, acolhedor e com base em referências científicas, para adultos que querem entender melhor características associadas ao espectro autista.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Cta />
              </div>
              <div className="mt-8 h-1 w-40 rounded-full bg-spectrum" />
            </div>
            <div className="flex justify-center">
              <img src={logo.url} alt="Logo NeuroSpectro" className="w-full max-w-md rounded-[2rem] shadow-soft" />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-10">
          <div className="rounded-[2rem] border border-primary/20 bg-primary/5 p-7 shadow-soft md:p-9">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Uma opção para continuar depois da avaliação</p>
                <h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">Você não precisa explorar tudo isso sozinho.</h2>
                <p className="mt-3 text-muted-foreground">
                  Depois de concluir seu acesso principal, você poderá adicionar o Comunidade de Apoio - NeuroSpectro: um espaço de troca de experiências, conteúdo exclusivo e apoio sobre neurodiversidade.
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-card px-5 py-4">
                <Users className="h-6 w-6 text-primary" />
                <div><span className="text-sm font-semibold text-ink">Comunidade de Apoio - NeuroSpectro</span><p className="mt-1 text-xs font-normal text-muted-foreground">Troca de experiências, conteúdos exclusivos e apoio sobre neurodiversidade.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Experiências</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">O que essa jornada pode ajudar você a organizar</h2>
            <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">Veja exemplos do tipo de descoberta e reflexão que o NeuroSpectro foi desenvolvido para apoiar.</p>
          </div>
          <TestimonialsCarousel />
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl font-semibold text-ink">O que você vai explorar</h2>
          <p className="mt-2 text-muted-foreground">Dimensões do seu funcionamento, observadas com cuidado.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            {dims.map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-primary"><Icon className="h-5 w-5" /></div>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-ink">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="font-display text-3xl font-semibold text-ink">Como funciona</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["01", "Responda com calma", "Uma pergunta por tela. Salve e retome quando quiser."],
              ["02", "Veja sua prévia", "Receba uma primeira leitura do seu perfil ao final."],
              ["03", "Aprofunde", "Libere o relatório completo e, se quiser, adicione a comunidade como uma experiência complementar."],
            ].map(([n, t, d]) => (
              <div key={n} className="rounded-3xl bg-card p-7 shadow-soft">
                <span className="font-display text-sm font-semibold text-primary">{n}</span>
                <h3 className="mt-3 font-display text-xl font-semibold text-ink">{t}</h3>
                <p className="mt-2 text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-ink py-20 text-ink-foreground">
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

        <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-3">
          {[
            [ShieldCheck, "Privacidade (LGPD)", "Suas respostas são protegidas e você controla seus dados."],
            [Lock, "Resultado protegido", "Só você acessa seu relatório."],
            [FileText, "Relatório em PDF", "Leve o resultado para conversar com um profissional."],
          ].map(([Icon, t, d]) => {
            const I = Icon as typeof ShieldCheck;
            return (
              <div key={t as string} className="flex gap-4">
                <I className="h-6 w-6 shrink-0 text-primary" />
                <div>
                  <h3 className="font-display font-semibold text-ink">{t as string}</h3>
                  <p className="text-sm text-muted-foreground">{d as string}</p>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mx-auto max-w-6xl px-5 py-16">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              [ShieldCheck, "Privacidade em primeiro lugar", "Tratamos suas respostas como dados pessoais sensíveis e evitamos expor informações individuais em ferramentas de publicidade."],
              [Lock, "Acesso protegido", "Resultados completos devem ficar vinculados à sua conta e protegidos por controle de acesso no servidor."],
              [FileText, "Informação, não diagnóstico", "A NeuroSpectro organiza uma leitura de características. O resultado não substitui avaliação de um profissional qualificado."],
            ].map(([Icon, t, d]) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <div key={t as string} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
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

        <section className="mx-auto max-w-4xl px-5 pb-20 text-center">
          <h2 className="font-display text-3xl font-semibold text-ink md:text-4xl">Entenda seu perfil. Descubra novas perspectivas.</h2>
          <Cta className="mt-8" />
          <p className="mx-auto mt-8 max-w-2xl rounded-2xl bg-muted p-5 text-sm text-muted-foreground">
            <strong className="text-ink">Importante:</strong> a NeuroSpectro oferece um rastreio inicial e não realiza diagnóstico. Apenas profissionais de saúde qualificados podem avaliar e diagnosticar o espectro autista.
          </p>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} NeuroSpectro · Rastreio, não diagnóstico.
      </footer>
    </div>
  );
}
