import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";

export const Route = createFileRoute("/ajuda")({
  head: () => ({ meta: [{ title: "Ajuda — NeuroSpectro" }, { name: "description", content: "Perguntas frequentes e orientações da NeuroSpectro." }] }),
  component: Ajuda,
});

function Ajuda() {
  const faqs = [
    ["A avaliação é um diagnóstico?", "Não. Ela é uma ferramenta de autoconhecimento e reflexão e não substitui avaliação clínica."],
    ["Preciso criar uma conta para começar?", "Você pode iniciar pela avaliação. Depois, o acesso à sua área utiliza seu e-mail e um link seguro."],
    ["Como acesso uma compra?", "Use o mesmo e-mail utilizado na compra para entrar na sua área."],
  ];
  return <main className="min-h-screen bg-background px-5 py-12 font-sans"><div className="mx-auto max-w-2xl">
    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← NeuroSpectro</Link>
    <header className="mt-10"><HelpCircle className="h-8 w-8 text-primary"/><p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Suporte</p><h1 className="mt-2 font-display text-4xl font-semibold text-ink">Ajuda</h1><p className="mt-4 leading-7 text-muted-foreground">Respostas rápidas para as dúvidas mais comuns.</p></header>
    <div className="mt-8 space-y-3">{faqs.map(([q,a]) => <article key={q} className="rounded-2xl border border-border bg-card p-5"><h2 className="font-display font-semibold text-ink">{q}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{a}</p></article>)}</div>
    <Link to="/avaliacao" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Iniciar avaliação</Link>
  </div></main>;
}
