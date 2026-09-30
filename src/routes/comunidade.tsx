import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, HeartHandshake, LockKeyhole, Users } from "lucide-react";
import mark from "@/assets/mark.png.asset.json";
import { COMMUNITY, COMMUNITY_CONTENT } from "@/lib/community";

export const Route = createFileRoute("/comunidade")({
  head: () => ({
    meta: [
      { title: "Círculo NeuroSpectro — Comunidade" },
      {
        name: "description",
        content:
          "Conheça o Círculo NeuroSpectro, uma comunidade acolhedora sobre neurodiversidade, autoconhecimento e troca de experiências.",
      },
    ],
  }),
  component: Comunidade,
});

function Comunidade() {
  return (
    <main className="min-h-screen bg-background px-5 py-12 font-sans">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground">
          <img src={mark.url} alt="" className="h-8 w-8" />
          NeuroSpectro
        </Link>

        <section className="mt-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-8 w-8" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Upsell opcional
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
            Entre para o {COMMUNITY.title}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Um espaço para continuar a descoberta depois da sua avaliação, com conteúdo exclusivo e conversas sobre neurodiversidade, autoconhecimento e diferentes formas de perceber o mundo.
          </p>
        </section>

        <section className="mt-10 rounded-[2rem] border border-primary/20 bg-primary/5 p-7">
          <div className="flex items-start gap-4">
            <HeartHandshake className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="font-display text-xl font-semibold text-ink">Um espaço para diferentes perspectivas</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Usamos “neurodivergente” como termo amplo para pessoas cujo funcionamento neurológico se distancia do padrão considerado neurotípico. A comunidade também acolhe pessoas neurotípicas e familiares, parceiros e interessados no tema.
              </p>
            </div>
          </div>

          <div className="mt-7 space-y-4">
            {COMMUNITY_CONTENT.map((item) => (
              <div key={item} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm text-ink">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <LockKeyhole className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-ink">Acesso separado</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            A comunidade é uma oferta adicional ao acesso principal. Depois da compra, o sistema libera o convite individualmente. O link do grupo não fica exposto nesta página.
          </p>
        </section>

        <div className="mt-8 text-center">
          <Link
            to="/avaliacao"
            className="inline-flex rounded-full bg-primary px-8 py-4 font-semibold text-primary-foreground shadow-soft"
          >
            Conhecer a NeuroSpectro
          </Link>
          <p className="mt-4 text-xs text-muted-foreground">
            A comunidade não substitui acompanhamento médico ou psicológico.
          </p>
        </div>
      </div>
    </main>
  );
}
