import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, MailCheck } from "lucide-react";

export const Route = createFileRoute("/pos-compra")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow,noarchive" }] }), component: PostPurchasePage });

function PostPurchasePage() {
  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-9">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Pagamento aprovado
          </p>

          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Seu acesso está sendo preparado.
          </h1>

          <p className="mt-4 leading-7 text-muted-foreground">
            O pagamento foi confirmado. Enviamos para o e-mail informado no checkout
            um link para confirmar seu acesso ao NeuroSpectro.
          </p>

          <div className="mt-7 rounded-3xl border border-primary/15 bg-primary/5 p-5">
            <div className="flex items-start gap-3">
              <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h2 className="font-semibold text-ink">Confira sua caixa de entrada</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Ao confirmar o e-mail, sua conta permanente mantém o mesmo acesso
                  e os dados da avaliação vinculados à compra.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-4 text-sm leading-6 text-muted-foreground">
            Se você ainda estiver neste dispositivo, também pode acessar sua área
            normalmente enquanto confirma o e-mail.
          </div>

          <Link
            to="/login"
            className="mt-6 flex w-full items-center justify-center rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-soft transition hover:opacity-90"
          >
            Entrar com meu e-mail
          </Link>

          <Link
            to="/"
            className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para a NeuroSpectro
          </Link>
        </section>
      </div>
    </main>
  );
}
