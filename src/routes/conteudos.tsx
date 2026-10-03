import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Heart, Lightbulb, MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/conteudos")({
  head: () => ({
    meta: [
      { title: "Conteúdos sobre neurodivergência — NeuroSpectro" },
      {
        name: "description",
        content:
          "Conteúdos acessíveis sobre neurodivergência, autoconhecimento, inclusão, atenção, sensibilidade e relações.",
      },
    ],
  }),
  component: Conteudos,
});

const articles = [
  {
    icon: Sparkles,
    title: "Neurodivergência não é um jeito errado de existir",
    text: "Neurodiversidade descreve a variação natural entre cérebros e formas de perceber o mundo. Isso não apaga dificuldades reais nem a necessidade de suporte: inclusão começa quando diferença e necessidade de apoio podem existir ao mesmo tempo.",
    tag: "Neurodiversidade",
  },
  {
    icon: Heart,
    title: "Quando você passou anos tentando parecer 'normal'",
    text: "Muitas pessoas chegam à vida adulta depois de aprender a esconder dificuldades, copiar comportamentos sociais ou compensar desafios de atenção e organização. Entender esses padrões pode trazer alívio, mas também pode despertar sentimentos complexos. Autoconhecimento não precisa virar uma nova cobrança.",
    tag: "Autoconhecimento",
  },
  {
    icon: Lightbulb,
    title: "Atenção não é sinônimo de força de vontade",
    text: "Em condições como o TDAH, dificuldades de atenção e funções executivas podem atravessar estudo, trabalho, rotina e relacionamentos. Estratégias, ambiente e suporte importam. O objetivo não é culpar a pessoa, mas descobrir o que facilita seu funcionamento.",
    tag: "Atenção e TDAH",
  },
  {
    icon: MessageCircle,
    title: "Por que a linguagem importa?",
    text: "A forma como falamos sobre neurodivergência influencia a maneira como diferenças são percebidas. Pesquisas recentes apontam uma mudança gradual em direção a uma linguagem mais afirmativa e menos centrada exclusivamente em déficits, especialmente quando pessoas neurodivergentes participam da produção do conhecimento.",
    tag: "Inclusão",
  },
];

function Conteudos() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← NeuroSpectro
        </Link>

        <header className="mt-10">
          <BookOpen className="h-8 w-8 text-primary" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Explorar
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
            Entender também é uma forma de acolher
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Conteúdos para quem está tentando se compreender, para quem quer entender alguém
            que ama e para quem acredita que inclusão começa quando deixamos de exigir que todo
            mundo funcione da mesma maneira.
          </p>
        </header>

        <section className="mt-10 grid gap-4">
          {articles.map(({ icon: Icon, title, text, tag }) => (
            <article key={title} className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                  {tag}
                </span>
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-primary/15 bg-primary/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Uma leitura importante
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">
            Diferença não significa ausência de desafios
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Uma abordagem inclusiva não precisa romantizar a neurodivergência. Algumas pessoas
            enfrentam barreiras significativas, estigma e necessidade de apoio. O ponto é olhar
            para a pessoa inteira: dificuldades, recursos, contexto, preferências, história e
            formas próprias de viver.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">De onde vêm essas ideias?</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <a
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11319857/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary/40"
            >
              <span>Revisão sistemática sobre linguagem neuroafirmativa no autismo</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
            </a>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/42137527/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary/40"
            >
              <span>Revisão sistemática sobre estigma em adultos com TDAH</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
            </a>
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/42216788/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary/40"
            >
              <span>Revisão sobre experiências de diagnóstico de TDAH na vida adulta</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
            </a>
          </div>
        </section>

        <div className="mt-8 rounded-[2rem] border border-border bg-card p-7">
          <p className="font-display text-xl font-semibold text-ink">
            Talvez a pergunta não seja “o que há de errado comigo?”
          </p>
          <p className="mt-3 leading-7 text-muted-foreground">
            Talvez seja: “o que eu ainda não entendi sobre a forma como eu funciono?”
          </p>
          <Link
            to="/avaliacao"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Começar minha jornada
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
