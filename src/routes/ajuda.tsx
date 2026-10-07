import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HelpCircle, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/ajuda")({
  head: () => ({
    meta: [
      { title: "Ajuda e dúvidas sobre neurodivergência — NeuroSpectro" },
      {
        name: "description",
        content:
          "Perguntas frequentes sobre a avaliação NeuroSpectro, neurodivergência, resultados, acesso e segurança.",
      },
    ],
  }),
  links: [{ rel: "canonical", href: "https://neurospectro.com.br/ajuda" }],
  component: Ajuda,
});

const faqs = [
  [
    "A avaliação é um diagnóstico?",
    "Não. A NeuroSpectro oferece uma experiência de autoconhecimento e reflexão. Uma avaliação online não substitui diagnóstico, avaliação clínica ou acompanhamento profissional.",
  ],
  [
    "Uma pontuação pode dizer se eu sou neurodivergente?",
    "Não por si só. Resultados podem indicar padrões para reflexão, mas não devem ser usados para confirmar ou excluir uma condição. Diagnóstico depende de história, contexto, critérios clínicos e avaliação individual.",
  ],
  [
    "Por que falar de neurodivergência sem romantizar?",
    "Porque inclusão precisa comportar as duas coisas: diferenças podem fazer parte da identidade e, ao mesmo tempo, algumas pessoas podem enfrentar sofrimento, deficiência, estigma ou necessidade de suporte.",
  ],
  [
    "TDAH pode aparecer de formas diferentes?",
    "Sim. A experiência varia entre pessoas e contextos. Pesquisas também descrevem desafios emocionais e de funções executivas em adultos com TDAH, além dos sintomas mais conhecidos de desatenção, hiperatividade e impulsividade.",
  ],
  [
    "Por que algumas pessoas só percebem esses padrões na vida adulta?",
    "A história individual importa. Algumas pessoas desenvolvem estratégias de compensação, recebem outras explicações para suas dificuldades ou encontram barreiras para acessar avaliação. A experiência de descobrir isso na vida adulta pode ser bastante complexa.",
  ],
  [
    "Como acesso minha conta depois da avaliação ou compra?",
    "Use o mesmo e-mail associado à sua jornada. O acesso utiliza um link seguro enviado por e-mail, sem necessidade de memorizar uma senha.",
  ],
];

function Ajuda() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 font-sans">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← NeuroSpectro
        </Link>

        <header className="mt-10">
          <HelpCircle className="h-8 w-8 text-primary" />
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Suporte e informação
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
            Perguntas que merecem respostas honestas
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            Informação pode acolher, mas também precisa respeitar limites. Aqui você encontra
            respostas sobre neurodivergência e sobre o que a NeuroSpectro pode — e não pode —
            concluir.
          </p>
        </header>

        <section className="mt-8 space-y-3">
          {faqs.map(([q, a]) => (
            <article key={q} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-display font-semibold text-ink">{q}</h2>
              <p className="mt-2 leading-6 text-muted-foreground">{a}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-primary/15 bg-primary/5 p-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="font-display text-lg font-semibold text-ink">Uma regra importante</h2>
          </div>
          <p className="mt-3 leading-7 text-muted-foreground">
            Se um resultado fizer você reconhecer uma parte da sua história, use isso como ponto
            de partida para perguntas — não como uma sentença sobre sua identidade ou saúde.
          </p>
          <Link
            to="/avaliacao"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
          >
            Explorar minha experiência
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </div>
    </main>
  );
}
