import { createFileRoute, Link } from "@tanstack/react-router";
import { Info } from "lucide-react";

export const Route = createFileRoute("/sobre")({
  head: () => ({ meta: [{ title: "Sobre a NeuroSpectro" }, { name: "description", content: "Conheça a proposta da NeuroSpectro." }] }),
  component: Sobre,
});

function Sobre() {
  return <main className="min-h-screen bg-background px-5 py-12 font-sans"><div className="mx-auto max-w-2xl">
    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← NeuroSpectro</Link>
    <section className="mt-10 rounded-[2rem] border border-border bg-card p-7 shadow-soft"><Info className="h-8 w-8 text-primary"/><p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">NeuroSpectro</p><h1 className="mt-2 font-display text-4xl font-semibold text-ink">Sobre</h1>
      <p className="mt-5 leading-7 text-muted-foreground">A NeuroSpectro cria experiências digitais de autoconhecimento para ajudar você a observar padrões, refletir sobre sua experiência e organizar novas perguntas sobre si.</p>
      <p className="mt-4 leading-7 text-muted-foreground">A avaliação é uma ferramenta de reflexão e não substitui diagnóstico, avaliação clínica ou acompanhamento profissional.</p>
      <Link to="/avaliacao" className="mt-7 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Conhecer a avaliação</Link>
    </section>
  </div></main>;
}
