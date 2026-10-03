import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Heart, MessageCircle, PlayCircle } from "lucide-react";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Vídeos sobre neurodivergência — NeuroSpectro" },
      {
        name: "description",
        content:
          "Vídeos e conteúdos curtos para entender neurodivergência, autoconhecimento e inclusão.",
      },
    ],
  }),
  component: Videos,
});

const videos = [
  {
    icon: Brain,
    title: "E se não fosse falta de esforço?",
    text: "Uma conversa sobre atenção, funções executivas e a diferença entre querer fazer algo e conseguir organizar o caminho até lá.",
  },
  {
    icon: Heart,
    title: "O alívio de finalmente encontrar uma explicação",
    text: "Descobrir novos padrões pode ajudar a reorganizar a própria história. Mas também pode trazer dúvidas, luto e muitas emoções. Não existe uma reação certa.",
  },
  {
    icon: MessageCircle,
    title: "Como apoiar sem infantilizar",
    text: "Inclusão não é falar pela pessoa. É perguntar o que ela precisa, respeitar sua autonomia e adaptar o ambiente quando uma barreira pode ser removida.",
  },
];

function Videos() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← NeuroSpectro
        </Link>

        <header className="mt-10">
          <PlayCircle className="h-8 w-8 text-primary" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            NeuroSpectro
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
            Vídeos para olhar para si com mais gentileza
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Conteúdo curto para provocar reflexão sem transformar diferenças humanas em rótulos
            fáceis. A ideia é abrir perguntas, não entregar respostas prontas sobre quem você é.
          </p>
        </header>

        <section className="mt-10 grid gap-4">
          {videos.map(({ icon: Icon, title, text }) => (
            <article key={title} className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <h2 className="mt-5 font-display text-xl font-semibold text-ink">{title}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Conteúdo em preparação
                <ArrowRight className="h-4 w-4" />
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-primary/15 bg-primary/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Nosso compromisso
          </p>
          <p className="mt-3 leading-7 text-muted-foreground">
            Neurodivergência não é uma tendência, um teste de personalidade ou uma identidade que
            outra pessoa pode atribuir a você. Nossos conteúdos devem informar, acolher e respeitar
            a complexidade de cada história.
          </p>
        </section>

        <div className="mt-8 rounded-[2rem] border border-border bg-card p-7">
          <h2 className="font-display text-xl font-semibold text-ink">
            Quer começar pelo seu próprio mapa?
          </h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            A avaliação da NeuroSpectro é uma experiência de autoconhecimento. Ela não fornece
            diagnóstico e não substitui avaliação profissional.
          </p>
          <Link
            to="/avaliacao"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Iniciar avaliação
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
