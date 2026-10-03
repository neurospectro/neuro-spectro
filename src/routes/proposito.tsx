import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, ShieldCheck, Sparkles, Users } from "lucide-react";

export const Route = createFileRoute("/proposito")({
  head: () => ({
    meta: [
      { title: "Nosso propósito — NeuroSpectro" },
      {
        name: "description",
        content:
          "Missão, princípios e compromissos da NeuroSpectro com autoconhecimento, inclusão, autonomia, acessibilidade e respeito à diversidade humana.",
      },
    ],
  }),
  component: Proposito,
});

const principles = [
  ["Dignidade", "Toda pessoa merece ser compreendida antes de ser julgada.", HeartHandshake],
  ["Autonomia", "Conhecimento deve ampliar escolhas, não determinar quem você é.", Sparkles],
  ["Inclusão", "Diferenças não precisam ser apagadas para que pessoas possam pertencer.", Users],
  ["Responsabilidade", "Acolhimento não substitui evidência, limites claros e orientação profissional.", ShieldCheck],
];

function Proposito() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← NeuroSpectro</Link>

        <section className="mt-10 rounded-[2rem] border border-border bg-card p-7 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">NeuroSpectro</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
            Você não precisa se encaixar para começar a se entender.
          </h1>
          <p className="mt-5 leading-7 text-muted-foreground">
            A NeuroSpectro existe para ampliar o acesso ao autoconhecimento e à informação sobre
            neurodiversidade, criando experiências digitais que ajudem pessoas a compreender seus
            padrões, reconhecer suas necessidades e construir uma relação mais consciente consigo mesmas e com o mundo.
          </p>
        </section>

        <section className="mt-5 rounded-[2rem] border border-border bg-card p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Nossa missão</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            Transformar curiosidade sobre si em compreensão.
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Fazemos isso por meio de informação acessível, experiências digitais e uma abordagem
            que respeita a singularidade de cada história. Não queremos encaixar pessoas em
            categorias; queremos oferecer melhores perguntas para que elas possam se compreender.
          </p>
        </section>

        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Como fazemos</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">Nossos princípios</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {principles.map(([title, text, Icon]) => (
              <article key={title} className="rounded-[2rem] border border-border bg-card p-6">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-[2rem] border border-primary/15 bg-primary/5 p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">O que acreditamos</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            Talvez a pergunta não seja “o que há de errado comigo?”
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Talvez seja: “o que eu ainda não entendi sobre a forma como eu funciono?”
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            Entender atenção, sensibilidade, comunicação, relações e formas de processar o mundo
            pode mudar a maneira como alguém interpreta a própria história. Isso não significa
            romantizar dificuldades: pessoas diferentes podem precisar de diferentes formas de suporte.
          </p>
        </section>

        <section className="mt-5 rounded-[2rem] border border-border bg-card p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Nosso compromisso</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink">
            Informação com inclusão e responsabilidade.
          </h2>
          <div className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
            <p>Não queremos transformar uma pontuação em uma sentença.</p>
            <p>Não queremos reduzir pessoas a diagnósticos.</p>
            <p>Não queremos romantizar dificuldades nem tratar diferenças humanas como defeitos a serem corrigidos.</p>
            <p>Queremos criar espaço para compreender, respeitar e buscar apoio quando necessário.</p>
          </div>
        </section>

        <section className="mt-5 rounded-[2rem] border border-border bg-card p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Transparência</p>
          <h2 className="mt-2 font-display text-xl font-semibold text-ink">O que somos — e o que não somos</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-muted p-5">
              <h3 className="font-semibold text-ink">Somos</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Uma plataforma digital de autoconhecimento e informação.
              </p>
            </div>
            <div className="rounded-2xl bg-muted p-5">
              <h3 className="font-semibold text-ink">Não somos</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Um serviço de diagnóstico ou substituto de avaliação e acompanhamento profissional.
              </p>
            </div>
          </div>
        </section>

        <Link
          to="/avaliacao"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
        >
          Começar minha jornada
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
