import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/conteudos")({
  head: () => ({ meta: [{ title: "Conteúdos — NeuroSpectro" }, { name: "description", content: "Conteúdos sobre neurodiversidade, autoconhecimento, atenção, sensibilidade e relações." }] }),
  component: Conteudos,
});

function Conteudos() {
  const topics = ["Neurodiversidade", "Autoconhecimento", "Relações e comunicação", "Atenção e concentração", "Sensibilidade", "Estratégias para o cotidiano"];
  return <main className="min-h-screen bg-background px-5 py-12 font-sans"><div className="mx-auto max-w-2xl">
    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← NeuroSpectro</Link>
    <header className="mt-10"><BookOpen className="h-8 w-8 text-primary"/><p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Explorar</p><h1 className="mt-2 font-display text-4xl font-semibold text-ink">Conteúdos</h1><p className="mt-4 leading-7 text-muted-foreground">Materiais para ampliar sua compreensão sobre diferentes formas de perceber, pensar e se relacionar com o mundo.</p></header>
    <div className="mt-8 grid gap-3">{topics.map(t => <article key={t} className="rounded-2xl border border-border bg-card p-5"><h2 className="font-display font-semibold text-ink">{t}</h2><p className="mt-1 text-sm text-muted-foreground">Em breve, novos conteúdos sobre este tema.</p></article>)}</div>
    <Link to="/avaliacao" className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Iniciar minha avaliação</Link>
  </div></main>;
}
