import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Heart, Lightbulb, MessageCircle, PlayCircle, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/conteudos")({
  head: () => ({
    meta: [
      { title: "Conteúdos sobre neurodivergência — NeuroSpectro" },
      {
        name: "description",
        content:
          "Artigos, notícias, textos e vídeos sobre neurodivergência, autoconhecimento e inclusão.",
      },
    ],
  }),
  component: Conteudos,
});

const articles = [
  {
    icon: Sparkles,
    title: "Neurodivergência não é um jeito errado de existir",
    text: "Neurodiversidade descreve a variação natural entre cérebros e formas de perceber o mundo. Isso não apaga dificuldades reais nem a necessidade de suporte.",
    tag: "Neurodiversidade",
  },
  {
    icon: Heart,
    title: "Quando você passou anos tentando parecer 'normal'",
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

const socialTopics = [
  { title: "Vídeos", text: "Reflexões curtas, explicações e conversas para assistir no seu ritmo.", icon: PlayCircle },
  { title: "Redes sociais", text: "Conteúdos selecionados de perfis e projetos que ajudam a ampliar a conversa sobre neurodivergência.", icon: Users },
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
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Explorar</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
            Conteúdo para continuar a sua descoberta
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Um espaço para aprender, refletir e encontrar diferentes perspectivas sobre
            neurodivergência, inclusão e autoconhecimento.
          </p>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
            <BookOpen className="h-7 w-7 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
              Artigos, notícias e textos
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Leituras acessíveis, referências científicas e notícias para entender melhor
              neurodiversidade, TDAH, autismo, inclusão, relações, atenção e sensibilidade.
            </p>
            <p className="mt-4 text-sm font-semibold text-primary">Leia, reflita e compartilhe.</p>
          </article>

          <article className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
            <PlayCircle className="h-7 w-7 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink">
              Vídeos e redes sociais
            </h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Uma seleção visual de vídeos e conteúdos de redes sociais relacionados ao tema,
              com espaço para diferentes vozes e experiências.
            </p>
            <p className="mt-4 text-sm font-semibold text-primary">Assista, descubra e explore.</p>
          </article>
        </section>

        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Leituras</p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Para começar</h2>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {articles.map(({ icon: Icon, title, text, tag }) => (
              <article key={title} className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{tag}</span>
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Em breve</p>
              <h2 className="font-display text-xl font-semibold text-ink">Perspectivas das redes</h2>
            </div>
          </div>
          <p className="mt-3 leading-7 text-muted-foreground">
            Podemos transformar esta área em uma rolagem horizontal de posts selecionados,
            vídeos e perfis relevantes. Para manter a qualidade, cada conteúdo pode receber
            uma pequena descrição e link para a publicação original.
          </p>
          <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2">
            {socialTopics.map(({ title, text, icon: Icon }) => (
              <div key={title} className="min-w-[82%] snap-start rounded-2xl border border-border bg-background p-5 sm:min-w-[48%]">
                <Icon className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-primary/15 bg-primary/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Uma leitura importante</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">
            Diferença não significa ausência de desafios
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Uma abordagem inclusiva não precisa romantizar a neurodivergência. Algumas pessoas
            enfrentam barreiras significativas, estigma e necessidade de apoio. O ponto é olhar
            para a pessoa inteira: dificuldades, recursos, contexto, preferências, história e formas próprias de viver.
          </p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">De onde vêm essas ideias?</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11319857/" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary/40">
              <span>Revisão sistemática sobre linguagem neuroafirmativa no autismo</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
            </a>
            <a href="https://pubmed.ncbi.nlm.nih.gov/42137527/" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary/40">
              <span>Revisão sistemática sobre estigma em adultos com TDAH</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" />
            </a>
            <a href="https://pubmed.ncbi.nlm.nih.gov/42216788/" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary/40">
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
          <Link to="/avaliacao" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">
            Começar minha jornada
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
