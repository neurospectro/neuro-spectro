import { createFileRoute, Link } from "@tanstack/react-router";
import { Video } from "lucide-react";

export const Route = createFileRoute("/videos")({
  head: () => ({ meta: [{ title: "Vídeos — NeuroSpectro" }, { name: "description", content: "Vídeos da NeuroSpectro sobre autoconhecimento e neurodiversidade." }] }),
  component: Videos,
});

function Videos() {
  return <main className="min-h-screen bg-background px-5 py-12 font-sans"><div className="mx-auto max-w-2xl">
    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← NeuroSpectro</Link>
    <header className="mt-10"><Video className="h-8 w-8 text-primary"/><p className="mt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary">NeuroSpectro</p><h1 className="mt-2 font-display text-4xl font-semibold text-ink">Vídeos</h1><p className="mt-4 leading-7 text-muted-foreground">Conteúdo curto e direto para continuar sua jornada de autoconhecimento.</p></header>
    <section className="mt-8 rounded-[2rem] border border-border bg-card p-7 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary"><Video className="h-6 w-6"/></div><h2 className="mt-5 font-display text-xl font-semibold text-ink">Novos vídeos em breve</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Estamos preparando uma biblioteca de conteúdos para você explorar no seu ritmo.</p><Link to="/avaliacao" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground">Fazer minha avaliação</Link></section>
  </div></main>;
}
