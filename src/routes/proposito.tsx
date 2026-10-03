import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HeartHandshake,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/proposito")({
  head: () => ({
    meta: [
      { title: "Nosso propósito — NeuroSpectro" },
      {
        name: "description",
        content:
          "Conheça o propósito, os princípios e os compromissos que orientam a NeuroSpectro: compreensão, autonomia, inclusão, acessibilidade e responsabilidade.",
      },
    ],
  }),
  component: Proposito,
});

const principles = [
  {
    title: "Dignidade",
    text: "Toda pessoa merece ser compreendida antes de ser julgada. Diferenças humanas não diminuem o valor de ninguém.",
    Icon: HeartHandshake,
  },
  {
    title: "Autonomia",
    text: "Conhecimento deve ampliar escolhas, não determinar quem você é. A experiência de cada pessoa continua sendo dela.",
    Icon: Sparkles,
  },
  {
    title: "Inclusão",
    text: "Pertencer não deveria exigir esconder características, necessidades ou formas diferentes de perceber o mundo.",
    Icon: Users,
  },
  {
    title: "Responsabilidade",
    text: "Acolhimento não substitui evidência, limites claros ou orientação profissional quando ela é necessária.",
    Icon: ShieldCheck,
  },
];

const commitments = [
  "Não transformar uma pontuação em uma sentença.",
  "Não reduzir uma pessoa a um diagnóstico ou a uma categoria.",
  "Não romantizar dificuldades nem tratar diferenças como defeitos a serem corrigidos.",
  "Não apresentar informação como certeza clínica quando ela não tiver essa natureza.",
  "Criar experiências que ajudem a formular perguntas melhores sobre si.",
  "Indicar caminhos de informação e apoio profissional quando isso fizer sentido.",
];

const references = [
  {
    label: "Ministério da Saúde",
    description: "Informações públicas sobre autismo, cuidado e inclusão.",
    href: "https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/a/autismo",
  },
  {
    label: "Constituição Federal",
    description: "Dignidade, igualdade e pluralismo como fundamentos da convivência democrática.",
    href: "https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm",
  },
  {
    label: "Convenção sobre os Direitos das Pessoas com Deficiência",
    description: "Autonomia, não discriminação, participação e acessibilidade.",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2009/decreto/d6949.htm",
  },
];

function Proposito() {
  return (
    <main className="min-h-screen bg-background px-5 py-10 font-sans md:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          ← NeuroSpectro
        </Link>

        <section className="mt-10 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            Nosso propósito
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-ink md:text-6xl">
            Você não precisa se encaixar para começar a se entender.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            A NeuroSpectro nasceu de uma pergunta simples: e se compreender melhor
            a própria experiência pudesse ser o começo de uma relação mais consciente
            consigo mesmo?
          </p>
        </section>

        <section className="mt-12 grid gap-5 md:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-[2rem] border border-border bg-card p-7 shadow-soft md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Por que existimos
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">
              Transformar curiosidade sobre si em compreensão.
            </h2>
            <div className="mt-5 space-y-4 leading-7 text-muted-foreground">
              <p>
                Informação sobre atenção, sensibilidade, comunicação, relações e
                formas de processar o mundo pode ajudar alguém a olhar para a própria
                história com mais contexto e menos julgamento.
              </p>
              <p>
                Nosso papel é criar experiências digitais acessíveis que organizem
                perguntas, informações e possibilidades de reflexão sem transformar
                uma experiência humana complexa em uma resposta pronta.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-primary/15 bg-primary/5 p-7 md:p-8">
            <Scale className="h-7 w-7 text-primary" />
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Uma escolha de princípio
            </p>
            <p className="mt-3 font-display text-xl font-semibold leading-8 text-ink">
              Compreender antes de rotular.
            </p>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Essa ideia orienta nossa linguagem, nossa curadoria e a forma como
              desenhamos cada etapa da experiência.
            </p>
          </div>
        </section>

        <section className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            O que nos orienta
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
            Princípios antes de produto.
          </h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            A NeuroSpectro não começa pela oferta. Começa pela responsabilidade sobre
            a forma como falamos de pessoas.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {principles.map(({ title, text, Icon }) => (
              <article
                key={title}
                className="rounded-[2rem] border border-border bg-card p-6 transition-shadow hover:shadow-soft"
              >
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{title}</h3>
                <p className="mt-3 leading-7 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[2rem] border border-border bg-card p-7 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            A pergunta que importa
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink md:text-3xl">
            Talvez não seja “o que há de errado comigo?”
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Talvez seja:{" "}
            <span className="font-medium text-ink">
              “o que eu ainda não entendi sobre a forma como eu funciono?”
            </span>
          </p>
          <p className="mt-5 leading-7 text-muted-foreground">
            Para algumas pessoas, essa mudança de perspectiva pode abrir espaço para
            reconhecer padrões, necessidades, limites e formas de buscar apoio. Isso
            não significa romantizar dificuldades, nem presumir que toda diferença
            tenha a mesma origem ou o mesmo impacto.
          </p>
        </section>

        <section className="mt-14">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-primary/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Nosso compromisso
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
                Informação com inclusão e responsabilidade.
              </h2>
            </div>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {commitments.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 rounded-[2rem] border border-border bg-muted/40 p-7 md:p-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            Transparência
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
            O que somos — e o que não somos.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-card p-6">
              <h3 className="font-semibold text-ink">Somos</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Uma plataforma digital de autoconhecimento e informação, criada para
                facilitar reflexão, descoberta e acesso a conteúdos responsáveis.
              </p>
            </div>
            <div className="rounded-2xl bg-card p-6">
              <h3 className="font-semibold text-ink">Não somos</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Um serviço de diagnóstico ou substituto de avaliação, tratamento ou
                acompanhamento realizado por profissionais habilitados.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="flex items-start gap-4">
            <BookOpen className="mt-1 h-6 w-6 text-primary" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Em que nos apoiamos
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
                Responsabilidade também é mostrar nossas referências.
              </h2>
              <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                Nossa abordagem busca dialogar com princípios de dignidade, igualdade,
                autonomia, inclusão e acessibilidade presentes em referências públicas
                brasileiras e internacionais. A curadoria de fontes não significa
                endosso irrestrito de todo conteúdo produzido por terceiros.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {references.map((reference) => (
              <a
                key={reference.label}
                href={reference.href}
                target="_blank"
                rel="noreferrer"
                className="block rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
              >
                <p className="font-semibold text-ink">{reference.label}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {reference.description}
                </p>
              </a>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-border pt-10">
          <p className="max-w-2xl font-display text-2xl font-semibold leading-9 text-ink md:text-3xl">
            Se você chegou até aqui porque quer se compreender melhor, sua jornada pode começar agora.
          </p>
          <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
            Sem precisar assumir uma resposta antes de fazer as perguntas.
          </p>
          <Link
            to="/avaliacao"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Começar minha jornada
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
