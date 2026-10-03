import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ExternalLink, Heart, Lightbulb, MessageCircle, PlayCircle, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/conteudos")({
  head: () => ({
    meta: [
      { title: "Conteúdos sobre neurodivergência — NeuroSpectro" },
      { name: "description", content: "Artigos, notícias, textos e vídeos selecionados sobre neurodivergência, autoconhecimento e inclusão." },
    ],
  }),
  component: Conteudos,
});

const articles = [
  { icon: Sparkles, title: "Neurodivergência não é um jeito errado de existir", text: "Neurodiversidade descreve a variação natural entre cérebros e formas de perceber o mundo. Isso não apaga dificuldades reais nem a necessidade de suporte.", tag: "Neurodiversidade" },
  { icon: Heart, title: "Quando você passou anos tentando parecer 'normal'", text: "Muitas pessoas desenvolvem estratégias para esconder dificuldades, compensar desafios ou se adaptar a expectativas sociais. Autoconhecimento não precisa virar uma nova cobrança.", tag: "Autoconhecimento" },
  { icon: Lightbulb, title: "Atenção não é sinônimo de força de vontade", text: "Dificuldades de atenção e funções executivas podem atravessar estudo, trabalho, rotina e relacionamentos. Estratégias, ambiente e suporte também importam.", tag: "TDAH" },
  { icon: MessageCircle, title: "Por que a linguagem importa?", text: "A forma como falamos sobre neurodivergência influencia como diferenças são percebidas. Informação inclusiva deve evitar reduzir pessoas a déficits ou estereótipos.", tag: "Inclusão" },
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
    category: "Ciência e educação",
    title: "TDAH: tudo o que você precisa saber",
    source: "Nunca vi 1 cientista",
    text: "Uma explicação baseada em referências científicas, incluindo os limites de conteúdos de redes sociais para autodiagnóstico.",
    href: "https://www.youtube.com/watch?v=6u74QhTyYos",
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
  {
    category: "Saúde e comportamento",
    title: "TDAH pode surgir na infância e não some na vida adulta",
    source: "Drauzio Varella",
    text: "Conteúdo introdutório sobre TDAH e a continuidade das dificuldades na vida adulta.",
    href: "https://drauziovarella.uol.com.br/videos/coluna/tdah-pode-surgir-na-infancia-e-nao-some-na-vida-adulta/",
  },
];

function Conteudos() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← NeuroSpectro</Link>

        <header className="mt-10">
          <BookOpen className="h-8 w-8 text-primary" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Explorar</p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">Conteúdo para continuar a sua descoberta</h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Um espaço para aprender, refletir e encontrar diferentes perspectivas sobre neurodivergência,
            inclusão e autoconhecimento — com curadoria e links para as fontes originais.
          </p>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-2">
          <article className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
            <BookOpen className="h-7 w-7 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink">Artigos, notícias e textos</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Leituras acessíveis, referências científicas, direitos e notícias para entender melhor neurodiversidade, TDAH, autismo e inclusão.</p>
          </article>
          <article className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
            <PlayCircle className="h-7 w-7 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink">Vídeos e redes sociais</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Vídeos e perfis selecionados para ampliar a conversa com diferentes vozes, sempre preservando o acesso ao conteúdo original.</p>
          </article>
        </section>

        <section className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Conteúdo selecionado</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Para começar</h2>
          <div className="mt-5 flex snap-x gap-4 overflow-x-auto pb-3">
            {curated.map((item) => (
              <a key={item.title} href={item.href} target="_blank" rel="noreferrer" className="min-w-[82%] snap-start rounded-[2rem] border border-border bg-card p-6 shadow-soft transition hover:border-primary/40 sm:min-w-[48%]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-primary">{item.category}</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm font-medium text-primary">{item.source}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">Abrir fonte <ArrowRight className="h-4 w-4" /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Leituras NeuroSpectro</p>
          <div className="mt-5 grid gap-4">
            {articles.map(({ icon: Icon, title, text, tag }) => (
              <article key={title} className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
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
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Curadoria social</p>
              <h2 className="font-display text-xl font-semibold text-ink">Perspectivas da comunidade</h2>
            </div>
          </div>
          <p className="mt-3 leading-7 text-muted-foreground">
            A NeuroSpectro pode ampliar este espaço com uma rolagem contínua de posts e vídeos selecionados.
            A proposta é dar visibilidade a fontes relevantes sem reproduzir seu conteúdo: cada card leva à publicação original.
          </p>
          <div className="mt-5 flex snap-x gap-3 overflow-x-auto pb-2">
            {[
              { label: "@autismoerealidade", text: "Materiais, direitos e informação sobre TEA.", href: "https://linktr.ee/autismoerealidade" },
              { label: "@carlosalmada", text: "Conteúdo educativo sobre TDAH adulto, autonomia e funcionamento executivo.", href: "https://www.tdahbrasil.com.br/sobre-nos/" },
              { label: "TDAH Descomplicado", text: "Conteúdo e vídeos sobre TDAH e neurodiversidade.", href: "https://www.youtube.com/tdahdescomplicado" },
              { label: "Nunca vi 1 cientista", text: "Divulgação científica com referências e cuidado contra autodiagnóstico.", href: "https://www.youtube.com/watch?v=6u74QhTyYos" },
            ].map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="min-w-[82%] snap-start rounded-2xl border border-border bg-background p-5 hover:border-primary/40 sm:min-w-[48%]">
                <p className="font-semibold text-ink">{item.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">Explorar <ExternalLink className="h-4 w-4" /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-primary/15 bg-primary/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Uma leitura importante</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">Diferença não significa ausência de desafios</h2>
          <p className="mt-3 leading-7 text-muted-foreground">Uma abordagem inclusiva não precisa romantizar a neurodivergência. Algumas pessoas enfrentam barreiras significativas, estigma e necessidade de apoio. O ponto é olhar para a pessoa inteira: dificuldades, recursos, contexto, preferências, história e formas próprias de viver.</p>
        </section>

        <section className="mt-8 rounded-[2rem] border border-border bg-card p-6">
          <h2 className="font-display text-lg font-semibold text-ink">Como fazemos a curadoria?</h2>
          <p className="mt-3 leading-7 text-muted-foreground">Priorizamos fontes públicas, científicas, profissionais e organizações com materiais educativos. Conteúdo externo é identificado como tal e deve ser lido no contexto original. A curadoria não significa endosso de todas as opiniões do autor.</p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
            <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11319857/" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary/40"><span>Revisão sistemática sobre linguagem neuroafirmativa no autismo</span><ArrowRight className="h-4 w-4 shrink-0 text-primary" /></a>
            <a href="https://pubmed.ncbi.nlm.nih.gov/42137527/" target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-border p-4 hover:border-primary/40"><span>Revisão sistemática sobre estigma em adultos com TDAH</span><ArrowRight className="h-4 w-4 shrink-0 text-primary" /></a>
          </div>
        </section>

        <div className="mt-8 rounded-[2rem] border border-border bg-card p-7">
          <p className="font-display text-xl font-semibold text-ink">Talvez a pergunta não seja “o que há de errado comigo?”</p>
          <p className="mt-3 leading-7 text-muted-foreground">Talvez seja: “o que eu ainda não entendi sobre a forma como eu funciono?”</p>
          <Link to="/avaliacao" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Começar minha jornada <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </div>
    </main>
  );
}
