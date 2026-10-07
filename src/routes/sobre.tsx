import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HeartHandshake, Info, Sparkles } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a NeuroSpectro" },
      {
        name: "description",
        content:
          "Conheça a proposta da NeuroSpectro: autoconhecimento, informação e uma abordagem mais inclusiva sobre diferenças neurocognitivas.",
      },
    ],
  }),
  links: [{ rel: "canonical", href: "https://neurospectro.com.br/sobre" }],
  component: Sobre,
});

function Sobre() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← NeuroSpectro
        </Link>

        <section className="mt-10 rounded-[2rem] border border-border bg-card p-7 shadow-soft">
          <Info className="h-8 w-8 text-primary" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            NeuroSpectro
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
            Você não precisa se encaixar para começar a se entender
          </h1>
          <p className="mt-5 leading-7 text-muted-foreground">
            A NeuroSpectro nasceu para transformar autoconhecimento em uma experiência mais
            acessível, humana e curiosa. Em vez de começar pela pergunta “qual é o meu rótulo?”,
            começamos por outra: “quais padrões fazem parte da minha experiência?”
          </p>
        </section>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <section className="rounded-[2rem] border border-border bg-card p-6">
            <Sparkles className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">Diferenças existem</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Pessoas podem perceber, processar, se comunicar, prestar atenção e responder aos
              estímulos de maneiras diferentes. A diversidade neurológica faz parte da diversidade
              humana.
            </p>
          </section>

          <section className="rounded-[2rem] border border-border bg-card p-6">
            <HeartHandshake className="h-6 w-6 text-primary" />
            <h2 className="mt-4 font-display text-xl font-semibold text-ink">Barreiras também existem</h2>
            <p className="mt-3 leading-7 text-muted-foreground">
              Uma visão inclusiva não significa ignorar sofrimento ou necessidades de suporte.
              Estigma, ambientes inadequados e falta de acessibilidade podem transformar uma
              diferença em uma barreira ainda maior.
            </p>
          </section>
        </div>

        <section className="mt-5 rounded-[2rem] border border-border bg-card p-7">
          <h2 className="font-display text-2xl font-semibold text-ink">
            A pessoa vem antes do rótulo
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Autismo, TDAH e outras condições do neurodesenvolvimento têm características e
            necessidades diferentes. Também existe uma enorme diversidade dentro de cada grupo.
            Por isso, a NeuroSpectro evita transformar uma pontuação em uma definição sobre quem
            você é.
          </p>
          <p className="mt-4 leading-7 text-muted-foreground">
            Nossa proposta é oferecer linguagem para reflexão, não certezas clínicas. Se algo
            despertar preocupação ou sofrimento, conversar com um profissional qualificado pode
            ajudar a compreender sua situação individual.
          </p>
        </section>

        <section className="mt-5 rounded-[2rem] border border-primary/15 bg-primary/5 p-7">
          <p className="font-display text-xl font-semibold text-ink">
            Inclusão começa quando a diferença deixa de ser motivo de vergonha.
          </p>
          <p className="mt-3 leading-7 text-muted-foreground">
            E continua quando pessoas são ouvidas, respeitadas e têm acesso aos apoios de que
            precisam.
          </p>
          <Link
            to="/avaliacao"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Conhecer a avaliação
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
