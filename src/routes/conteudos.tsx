import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ExternalLink,
  Heart,
  Lightbulb,
  MessageCircle,
  Puzzle,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/conteudos")({
  head: () => ({
    meta: [
      { title: "Conteúdos sobre autismo e neurodivergência | NeuroSpectro" },
      {
        name: "description",
        content:
          "Conteúdos educativos sobre autismo em adultos, neurodivergência, TDAH, sensibilidade sensorial, camuflagem e autoconhecimento.",
      },
      {
        property: "og:title",
        content: "Conteúdos sobre autismo e neurodivergência | NeuroSpectro",
      },
      {
        property: "og:description",
        content:
          "Informação acolhedora e baseada em referências para compreender autismo, neurodivergência, TDAH e diferentes formas de perceber o mundo.",
      },
      {
        property: "og:url",
        content: "https://neurospectro.com.br/conteudos",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Conteúdos sobre autismo e neurodivergência | NeuroSpectro",
      },
      {
        name: "twitter:description",
        content:
          "Conteúdos educativos sobre autismo em adultos, neurodivergência, TDAH, sensibilidade sensorial, camuflagem e autoconhecimento.",
      },
    ],
  }),
  links: [{ rel: "canonical", href: "https://neurospectro.com.br/conteudos" }],
  component: Conteudos,
});

const topics = [
  {
    icon: Brain,
    title: "Autismo em adultos",
    text: "Informações sobre características do espectro, experiências na vida adulta, autoconhecimento e busca por avaliação profissional.",
  },
  {
    icon: Search,
    title: "Sinais de autismo em adultos",
    text: "Entenda características que podem aparecer na comunicação, interação social, interesses, rotina e processamento sensorial.",
  },
  {
    icon: Users,
    title: "Autismo em mulheres",
    text: "Explore temas como camuflagem social, adaptação, identificação tardia e diferenças na forma como características podem ser percebidas.",
  },
  {
    icon: Sparkles,
    title: "Neurodivergência",
    text: "Conheça o conceito de neurodiversidade e diferentes formas de compreender variações neurológicas sem reduzir a pessoa ao diagnóstico.",
  },
  {
    icon: Heart,
    title: "Sensibilidade sensorial",
    text: "Conteúdos sobre hipersensibilidade, hipossensibilidade e como estímulos do ambiente podem influenciar experiências cotidianas.",
  },
  {
    icon: MessageCircle,
    title: "Camuflagem e masking",
    text: "Reflexões sobre estratégias usadas para se adaptar socialmente, seus contextos e o impacto que podem ter no bem-estar.",
  },
  {
    icon: Puzzle,
    title: "Autismo e TDAH",
    text: "Informações para compreender diferenças, sobreposições e por que uma experiência individual não deve ser reduzida a um único rótulo.",
  },
  {
    icon: Lightbulb,
    title: "Rastreio e diagnóstico",
    text: "Entenda a diferença entre rastreio, investigação clínica e diagnóstico, e saiba quando pode ser importante procurar um profissional.",
  },
];

const articles = [
  {
    icon: Sparkles,
    title: "Neurodivergência não é um jeito errado de existir",
    text: "Neurodiversidade descreve a variação natural entre cérebros e formas de perceber o mundo. Isso não apaga dificuldades reais nem a necessidade de suporte.",
    tag: "Neurodiversidade",
  },
  {
    icon: Heart,
    title: "Quando você passou anos tentando parecer “normal”",
    text: "Muitas pessoas desenvolvem estratégias para esconder dificuldades, compensar desafios ou se adaptar a expectativas sociais. Autoconhecimento não precisa virar uma nova cobrança.",
    tag: "Autoconhecimento",
  },
  {
    icon: Lightbulb,
    title: "Atenção não é sinônimo de força de vontade",
    text: "Dificuldades de atenção e funções executivas podem atravessar estudo, trabalho, rotina e relacionamentos. Estratégias, ambiente e suporte também importam.",
    tag: "TDAH",
  },
  {
    icon: MessageCircle,
    title: "Por que a linguagem importa?",
    text: "A forma como falamos sobre neurodivergência influencia como diferenças são percebidas. Informação inclusiva deve evitar reduzir pessoas a déficits ou estereótipos.",
    tag: "Inclusão",
  },
];

const curated = [
  {
    category: "Saúde pública",
    title: "Autismo: cuidado, apoio e inclusão ao longo da vida",
    source: "Ministério da Saúde",
    text: "Informações oficiais sobre TEA, sinais, rede de cuidado, apoio às famílias e inclusão.",
    href: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/autismo",
  },
  {
    category: "Direitos e cidadania",
    title: "Rede de cuidados centrada na pessoa",
    source: "Ministério da Saúde",
    text: "Como o SUS articula saúde, autonomia, qualidade de vida, inclusão e participação social.",
    href: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/autismo/redes-de-atuacao",
  },
  {
    category: "TDAH adulto",
    title: "TDAH na vida adulta e funcionamento executivo",
    source: "TDAH Brasil",
    text: "Conteúdos educativos voltados a adultos, autonomia, funcionalidade e qualidade de vida.",
    href: "https://www.tdahbrasil.com.br/sobre-nos/",
  },
  {
    category: "Autismo e família",
    title: "Autismo e Realidade",
    source: "@autismoerealidade",
    text: "Cartilhas, direitos, perguntas frequentes e materiais educativos sobre TEA.",
    href: "https://linktr.ee/autismoerealidade",
  },
];

function Conteudos() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← NeuroSpectro
        </Link>

        <header className="mt-10">
          <BookOpen className="h-8 w-8 text-primary" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Explorar
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
            Conteúdos sobre autismo, neurodivergência e autoconhecimento
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Um espaço para aprender, refletir e encontrar diferentes
            perspectivas sobre autismo em adultos, neurodivergência, TDAH,
            sensibilidade sensorial, inclusão e autoconhecimento. Nosso
            conteúdo é educativo e não substitui avaliação ou diagnóstico
            profissional.
          </p>
        </header>

        <section className="mt-10" aria-labelledby="temas-principais">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Explore por tema
          </p>
          <h2
            id="temas-principais"
            className="mt-2 font-display text-2xl font-semibold text-ink"
          >
            Encontre um ponto de partida
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Reunimos temas que fazem parte das dúvidas e experiências de muitas
            pessoas que buscam compreender melhor a própria trajetória.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {topics.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-[2rem] border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="leituras-neurospectro">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Leituras NeuroSpectro
          </p>
          <h2
            id="leituras-neurospectro"
            className="mt-2 font-display text-2xl font-semibold text-ink"
          >
            Reflexões para continuar a descoberta
          </h2>
          <div className="mt-5 grid gap-4">
            {articles.map(({ icon: Icon, title, text, tag }) => (
              <article
                key={title}
                className="rounded-[2rem] border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {tag}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">
                  {title}
                </h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10" aria-labelledby="fontes-selecionadas">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Fontes e referências
          </p>
          <h2
            id="fontes-selecionadas"
            className="mt-2 font-display text-2xl font-semibold text-ink"
          >
            Para aprofundar
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Priorizamos fontes públicas, científicas, profissionais e
            organizações com materiais educativos. As referências externas
            levam ao conteúdo original.
          </p>

          <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-3">
            {curated.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="min-w-[82%] snap-start rounded-[2rem] border border-border bg-card p-6 shadow-soft transition hover:border-primary/40 sm:min-w-[48%]"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
                    {item.category}
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-primary">
                  {item.source}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {item.text}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Abrir fonte <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-primary/15 bg-primary/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Rastreio, avaliação e diagnóstico
          </p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">
            O que um rastreio pode — e não pode — dizer?
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Instrumentos de rastreio podem ajudar a identificar características
            que merecem investigação, mas não estabelecem diagnóstico por si
            mesmos. Uma avaliação diagnóstica deve considerar história de vida,
            funcionamento atual, contexto e critérios clínicos, com profissional
            habilitado.
          </p>
          <Link
            to="/avaliacao"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Conhecer o rastreio NeuroSpectro
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        <section className="mt-8" aria-labelledby="perguntas-frequentes">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Perguntas frequentes
          </p>
          <h2
            id="perguntas-frequentes"
            className="mt-2 font-display text-2xl font-semibold text-ink"
          >
            Dúvidas comuns sobre neurodivergência
          </h2>
          <div className="mt-5 space-y-3">
            <details className="rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-semibold text-ink">
                Como saber se posso estar no espectro autista?
              </summary>
              <p className="mt-3 leading-7 text-muted-foreground">
                Algumas características podem indicar que vale a pena buscar
                mais informação, mas nenhuma característica isolada confirma
                autismo. O ideal é considerar a história da pessoa e, quando
                necessário, procurar avaliação profissional.
              </p>
            </details>
            <details className="rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-semibold text-ink">
                Adultos podem descobrir o autismo mais tarde?
              </summary>
              <p className="mt-3 leading-7 text-muted-foreground">
                Sim. Algumas pessoas chegam à investigação na vida adulta,
                inclusive após anos desenvolvendo estratégias de adaptação.
                Uma investigação adequada considera a trajetória desde a
                infância e o funcionamento ao longo da vida.
              </p>
            </details>
            <details className="rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-semibold text-ink">
                Rastreio de autismo é o mesmo que diagnóstico?
              </summary>
              <p className="mt-3 leading-7 text-muted-foreground">
                Não. Rastreio é uma etapa inicial de orientação e não substitui
                avaliação diagnóstica realizada por profissional habilitado.
              </p>
            </details>
            <details className="rounded-2xl border border-border bg-card p-5">
              <summary className="cursor-pointer font-semibold text-ink">
                Sensibilidade sensorial pode estar relacionada à neurodivergência?
              </summary>
              <p className="mt-3 leading-7 text-muted-foreground">
                Diferenças no processamento sensorial podem aparecer em pessoas
                neurodivergentes, mas também podem ter outras explicações. O
                contexto individual é importante para compreender a experiência.
              </p>
            </details>
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">
            Como fazemos a curadoria?
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Priorizamos fontes públicas, científicas, profissionais e
            organizações com materiais educativos. Cada referência externa é
            identificada e leva ao conteúdo original. A curadoria não significa
            endosso de todas as opiniões do autor.
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <a
              href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11319857/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary/40"
            >
              <span>
                Revisão sistemática sobre linguagem neuroafirmativa no autismo
              </span>
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
          </div>
        </section>

        <div className="mt-8 rounded-[2rem] border border-border bg-card p-7">
          <p className="font-display text-xl font-semibold text-ink">
            Talvez a pergunta não seja “o que há de errado comigo?”
          </p>
          <p className="mt-3 leading-7 text-muted-foreground">
            Talvez seja: “o que eu ainda não entendi sobre a forma como eu
            funciono?”
          </p>
          <Link
            to="/avaliacao"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Começar minha jornada <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
