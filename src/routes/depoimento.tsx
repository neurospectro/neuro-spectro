import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Clock3, MessageSquareQuote, ShieldCheck } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/depoimento")({
  component: TestimonialPage,
});

function TestimonialPage() {
  const [name, setName] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim() || testimonial.trim().length < 10 || !consent) return;

    // A gravação definitiva será feita pela camada autenticada do Supabase.
    // A migration já força status=PENDING e consentimento=true no banco.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-background px-5 py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-soft md:p-12">
          <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-5 font-display text-3xl font-semibold text-ink">Obrigado por compartilhar.</h1>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Seu depoimento será enviado para revisão. Ele só aparecerá publicamente se for aprovado pela equipe NeuroSpectro.
          </p>
          <Link to="/" className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 font-semibold text-primary-foreground">
            Voltar para a NeuroSpectro
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="text-sm font-medium text-primary">← NeuroSpectro</Link>

        <section className="mt-8 rounded-[2rem] border border-border bg-card p-7 shadow-soft md:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <MessageSquareQuote className="h-6 w-6" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Área do usuário</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Conte como foi sua experiência</h1>
          <p className="mt-3 text-muted-foreground">
            Seu relato pode ajudar outras pessoas a entenderem melhor a proposta da NeuroSpectro.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Nome para exibição</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                required
                className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="Como você gostaria de aparecer?"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-ink">Seu depoimento</span>
              <textarea
                value={testimonial}
                onChange={(event) => setTestimonial(event.target.value)}
                maxLength={1000}
                minLength={10}
                required
                rows={6}
                className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                placeholder="Conte brevemente como foi sua experiência..."
              />
              <span className="mt-2 block text-xs text-muted-foreground">{testimonial.length}/1000</span>
            </label>

            <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                required
                className="mt-1 h-4 w-4 accent-primary"
              />
              <span className="text-sm leading-6 text-muted-foreground">
                Autorizo a NeuroSpectro a publicar este depoimento com o nome informado acima. Entendo que o relato passará por aprovação e poderá ser recusado ou removido.
              </span>
            </label>

            <button
              type="submit"
              disabled={!name.trim() || testimonial.trim().length < 10 || !consent}
              className="w-full rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
            >
              Enviar depoimento
            </button>
          </form>
        </section>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Clock3 className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-semibold text-ink">Revisão antes da publicação</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Todo relato começa com status PENDING.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-semibold text-ink">Consentimento explícito</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">A publicação depende da autorização do usuário.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
