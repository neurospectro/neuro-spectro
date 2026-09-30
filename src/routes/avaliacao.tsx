import { createFileRoute, Link } from "@tanstack/react-router";
import mark from "@/assets/mark.png.asset.json";

export const Route = createFileRoute("/avaliacao")({
  head: () => ({
    meta: [
      { title: "Avaliação — NeuroSpectro" },
      { name: "description", content: "Comece sua autoavaliação NeuroSpectro: uma pergunta por tela, com progresso salvo." },
      { property: "og:title", content: "Avaliação — NeuroSpectro" },
      { property: "og:description", content: "Comece sua autoavaliação NeuroSpectro." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Avaliacao,
});

function Avaliacao() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center font-sans">
      <img src={mark.url} alt="" className="h-20 w-20" />
      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">O questionário está chegando</h1>
      <p className="mt-3 max-w-md text-muted-foreground">Estamos preparando as perguntas. Em breve você poderá começar por aqui.</p>
      <div className="mt-6 h-1 w-32 rounded-full bg-spectrum" />
      <Link to="/" className="mt-8 rounded-full border border-border px-6 py-3 text-sm font-medium hover:bg-secondary">Voltar ao início</Link>
    </div>
  );
}
