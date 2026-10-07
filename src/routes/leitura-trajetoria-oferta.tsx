import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/leitura-trajetoria-oferta")({
  head: () => ({
    meta: [
      { title: "Leitura de Trajetória — NeuroSpectro" },
      { name: "description", content: "Conheça a Leitura de Trajetória da NeuroSpectro: uma experiência para organizar sua história e refletir sobre sua trajetória pessoal." },
    ],
    links: [{ rel: "canonical", href: "https://neurospectro.com.br/leitura-trajetoria-oferta" }],
  }),
  component: TrajectoryOffer,
});

function TrajectoryOffer() {
  return (
    <main className="min-h-screen bg-background px-5 py-8 font-sans sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Minha área</Link>

        <section className="mt-6 overflow-hidden rounded-[2rem] border border-primary/15 bg-card p-7 shadow-soft sm:p-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Oferta especial pós-relatório</span>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">Você já começou a se entender. Agora existe uma parte ainda mais pessoal: a história que trouxe você até aqui.</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">Algumas experiências nos acompanham por anos sem nunca encontrarmos as palavras certas para explicá-las. A Leitura de Trajetória abre um espaço para você contar o que viveu do seu jeito — e receber uma devolutiva individual de um especialista parceiro, com foco em autoconhecimento e preparação para uma futura conversa profissional.</p>

          <div className="mt-8 rounded-3xl border border-primary/15 bg-primary/5 p-6">
            <h2 className="font-display text-2xl font-semibold text-ink">Porque sua história não cabe em uma pontuação.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Uma pontuação pode mostrar um padrão. Ela não conta o que aconteceu antes dele. Aqui, o objetivo é organizar contexto, trajetória e experiências para que você consiga olhar para si com mais clareza e levar uma história mais organizada a uma eventual conversa profissional.</p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Feature title="Finalmente, um espaço para contar" text="Infância, escola, adolescência, relações, trabalho, rotina, sensibilidade, adaptações e aquilo que fez você começar esta busca. Sem precisar encontrar as palavras perfeitas." />
            <Feature title="Alguém lê além das respostas" text="Seu relato é encaminhado para uma leitura individual por um especialista parceiro, trazendo contexto para aquilo que uma resposta automática não consegue contar." />
            <Feature title="Chegue mais preparado para se explicar" text="A devolutiva pode ajudar a transformar lembranças, dificuldades e experiências difíceis de explicar em pontos mais claros para uma futura conversa com um profissional habilitado." />
            <Feature title="Receba sua devolutiva" text="O material ficará disponível na sua área. A comunicação por e-mail seguirá os dados da sua conta e a configuração operacional do serviço." />
          </div>

          <div className="mt-8 rounded-3xl border border-border bg-secondary/50 p-6">
            <h2 className="font-display text-xl font-semibold text-ink">O que você recebe</h2>
            <ul className="mt-4 space-y-3">
              {["Questionário guiado de trajetória", "Espaço para relato livre", "Leitura individual por especialista parceiro", "Devolutiva escrita personalizada", "Perguntas e pontos para levar a uma futura conversa profissional"].map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-ink"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8 rounded-3xl border border-border p-6">
            <div className="flex gap-3">
              <ShieldCheck className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h2 className="font-semibold text-ink">O que este produto não é</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Não é consulta, diagnóstico, laudo, avaliação psicológica, documento médico ou substituto de atendimento profissional. É uma devolutiva informativa de autoconhecimento baseada nas informações fornecidas por você.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">Leitura de Trajetória NeuroSpectro</p>
            <p className="mt-1 font-display text-4xl font-semibold text-ink">R$ 149,90</p>
            <p className="mt-2 text-xs text-muted-foreground">Pagamento único · acesso à área para envio e acompanhamento da devolutiva</p>
            <Link to="/checkout/$offerId" params={{ offerId: "trajectory-reading-14990" }} className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-soft">Quero dar voz à minha história <ArrowRight className="h-5 w-5" /></Link>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground"><Mail className="h-4 w-4" /> Devolutiva individual, não automatizada.</div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return <div className="rounded-2xl border border-border bg-card p-5"><h3 className="font-semibold text-ink">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>;
}
