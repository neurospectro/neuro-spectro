import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { getOffer, formatBRL } from "@/lib/offers";

export const Route = createFileRoute("/checkout/$offerId")({
  component: Checkout,
});

function Checkout() {
  const { offerId } = Route.useParams();
  const offer = getOffer(offerId);

  if (!offer) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-5">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-ink">Oferta não encontrada</h1>
          <Link to="/avaliacao" className="mt-5 inline-block text-primary">Voltar para a avaliação</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 font-sans">
      <div className="mx-auto max-w-lg">
        <Link to="/avaliacao" className="text-sm text-muted-foreground hover:text-foreground">← Voltar</Link>
        <div className="mt-6 rounded-[2rem] border border-border bg-card p-7 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Oferta NeuroSpectro</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{offer.name}</h1>
          <p className="mt-3 text-muted-foreground">{offer.description}</p>

          {offer.referenceCents && (
            <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Condição promocional</p>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-lg text-muted-foreground line-through">{formatBRL(offer.referenceCents)}</span>
                <span className="text-3xl font-bold text-ink">{formatBRL(offer.totalCents)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Condição reservada para esta sessão de avaliação.</p>
            </div>
          )}

          <div className="mt-7 rounded-2xl bg-primary/5 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Forma de pagamento</p>
                <p className="mt-1 text-2xl font-bold text-ink">
                  {offer.installmentCount > 1
                    ? `${offer.installmentCount}x ${formatBRL(offer.installmentCents)}`
                    : formatBRL(offer.installmentCents)}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Total: {formatBRL(offer.totalCents)} · acesso: {offer.lifetimeAccess ? "por tempo indeterminado" : `${offer.accessDays} dias`}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            {[
              "Acesso liberado após confirmação do pagamento",
              offer.lifetimeAccess ? "Acesso por tempo indeterminado após confirmação do pagamento" : `${offer.accessDays} dias de acesso, controlados por data de expiração no servidor`,
              offer.autoRenew ? "Renovação automática configurada" : "Sem renovação automática nesta oferta",
            ].map((item) => (
              <div key={item} className="flex gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-2xl border border-border bg-secondary/50 p-4 text-sm">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-muted-foreground">
                O checkout real será conectado ao provedor de pagamentos no backend. Nenhum dado de cartão deve ser armazenado pela NeuroSpectro.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled
            className="mt-7 w-full rounded-full bg-primary px-6 py-4 font-semibold text-primary-foreground opacity-50"
          >
            Conectar pagamento
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Esta etapa depende das credenciais do provedor e do webhook de confirmação.
          </p>
        </div>
      </div>
    </main>
  );
}
