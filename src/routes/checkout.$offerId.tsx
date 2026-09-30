import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getOffer, formatBRL } from "@/lib/offers";
import { supabase } from "@/lib/supabase";
import "@/styles/mercadopago.css";

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => {
      bricks: () => {
        create: (
          type: string,
          container: string,
          settings: Record<string, unknown>,
        ) => Promise<{ unmount: () => void }>;
      };
    };
  }
}

export const Route = createFileRoute("/checkout/$offerId")({
  component: Checkout,
});

const mpScriptId = "mercadopago-js-v2";

function loadMercadoPagoScript() {
  return new Promise<void>((resolve, reject) => {
    if (window.MercadoPago) {
      resolve();
      return;
    }

    const fail = () =>
      reject(
        new Error(
          "Não foi possível carregar o Checkout Transparente do Mercado Pago. Verifique a Public Key e o carregamento do SDK.",
        ),
      );

    const existing = document.getElementById(mpScriptId) as HTMLScriptElement | null;
    if (existing) {
      const timeout = window.setTimeout(fail, 12000);
      existing.addEventListener(
        "load",
        () => {
          window.clearTimeout(timeout);
          if (window.MercadoPago) resolve();
          else fail();
        },
        { once: true },
      );
      existing.addEventListener(
        "error",
        () => {
          window.clearTimeout(timeout);
          fail();
        },
        { once: true },
      );
      // If the script was already loaded before listeners were attached, don't
      // leave the checkout stuck on the loading state.
      window.setTimeout(() => {
        if (window.MercadoPago) {
          window.clearTimeout(timeout);
          resolve();
        }
      }, 0);
      return;
    }

    const script = document.createElement("script");
    script.id = mpScriptId;
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    const timeout = window.setTimeout(fail, 12000);
    script.onload = () => {
      window.clearTimeout(timeout);
      if (window.MercadoPago) resolve();
      else fail();
    };
    script.onerror = () => {
      window.clearTimeout(timeout);
      fail();
    };
    document.head.appendChild(script);
  });
}

function Checkout() {
  const { offerId } = Route.useParams();
  const navigate = useNavigate();
  const offer = getOffer(offerId);
  const brickRef = useRef<{ unmount: () => void } | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pix, setPix] = useState<{ qrCode: string | null; qrCodeBase64: string | null; ticketUrl: string | null } | null>(null);

  useEffect(() => {
    if (!offer || !supabase) return;

    let cancelled = false;

    const mountBrick = async () => {
      try {
        if (!supabase) return;
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData.session) {
          await navigate({ to: "/login" });
          return;
        }

        const publicKey = import.meta.env["VITE_MERCADOPAGO_PUBLIC_KEY"];
        if (!publicKey) throw new Error("O Mercado Pago ainda não está configurado no ambiente.");

        await loadMercadoPagoScript();
        if (cancelled || !window.MercadoPago) return;

        const mp = new window.MercadoPago(publicKey, { locale: "pt-BR" });
        const bricksBuilder = mp.bricks();

        const brick = await bricksBuilder.create("payment", "paymentBrick_container", {
          initialization: {
            amount: offer.totalCents / 100,
            payer: { email: sessionData.session.user.email ?? "" },
          },
          customization: {
            paymentMethods: {
              ticket: "all",
              bankTransfer: "all",
              creditCard: "all",
              prepaidCard: "all",
              debitCard: "all",
              // The wallet option requires a preferenceId. This is a
              // transparent checkout, so cards/Pix/boleto are rendered directly.
            },
          },
          callbacks: {
            onReady: () => {
              if (!cancelled) setLoading(false);
            },
            onSubmit: async ({ formData }: { selectedPaymentMethod: string; formData: Record<string, unknown> }) => {
              setError("");
              setSuccess("");
              setPix(null);
              setProcessing(true);

              try {
                if (!supabase) throw new Error("O serviço de autenticação não está configurado.");
                const { data: current } = await supabase.auth.getSession();
                const token = current.session?.access_token;
                if (!token) throw new Error("Sua sessão expirou. Entre novamente.");

                const response = await fetch(
                  `${import.meta.env["VITE_SUPABASE_URL"]}/functions/v1/process-payment`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ offerId: offer.id, formData }),
                  },
                );

                const result = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(result.error ?? "Não foi possível processar o pagamento.");

                if (result.pix) setPix(result.pix);

                if (result.paymentStatus === "processed" || result.paymentStatus === "approved") {
                  setSuccess("Pagamento aprovado. Seu acesso foi liberado e já pode aparecer no painel.");
                } else if (result.paymentStatus === "action_required" || result.paymentStatus === "pending") {
                  setSuccess("Pagamento criado. Aguarde a confirmação do Mercado Pago para liberar o acesso.");
                } else {
                  setSuccess("Pagamento enviado para processamento.");
                }
              } catch (submitError) {
                setError(submitError instanceof Error ? submitError.message : "Não foi possível processar o pagamento.");
                throw submitError;
              } finally {
                setProcessing(false);
              }
            },
            onError: (brickError: unknown) => {
              console.error("Mercado Pago Brick:", brickError);
              setError("O formulário de pagamento encontrou um problema. Confira os dados e tente novamente.");
              setProcessing(false);
            },
          },
        });

        if (cancelled) {
          brick.unmount();
          return;
        }

        brickRef.current = brick;
        setLoading(false);
      } catch (mountError) {
        if (!cancelled) {
          setLoading(false);
          setError(
            mountError instanceof Error
              ? mountError.message
              : "Não foi possível carregar o checkout.",
          );
        }
      }
    };

    void mountBrick();

    return () => {
      cancelled = true;
      brickRef.current?.unmount();
      brickRef.current = null;
    };
  }, [offer?.id, offer?.totalCents, navigate]);

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
      <div className="mx-auto max-w-2xl">
        <Link to="/avaliacao" className="text-sm text-muted-foreground hover:text-foreground">← Voltar</Link>

        <div className="mt-6 rounded-[2rem] border border-border bg-card p-5 shadow-soft sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Checkout NeuroSpectro</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{offer.name}</h1>
          <p className="mt-3 text-muted-foreground">{offer.description}</p>

          {offer.referenceCents && (
            <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Condição promocional</p>
              <div className="mt-2 flex items-end gap-3">
                <span className="text-lg text-muted-foreground line-through">{formatBRL(offer.referenceCents)}</span>
                <span className="text-3xl font-bold text-ink">{formatBRL(offer.totalCents)}</span>
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-primary/5 p-4">
            <CreditCard className="h-6 w-6 shrink-0 text-primary" />
            <div>
              <p className="font-semibold text-ink">
                {offer.installmentCount > 1 ? `${offer.installmentCount}x ${formatBRL(offer.installmentCents)}` : formatBRL(offer.totalCents)}
              </p>
              <p className="text-sm text-muted-foreground">
                Total {formatBRL(offer.totalCents)} · {offer.lifetimeAccess ? "acesso por tempo indeterminado" : `${offer.accessDays} dias de acesso`}
              </p>
            </div>
          </div>

          <div className="mt-7">
            {loading && !error && (
              <div className="flex min-h-32 items-center justify-center gap-3 text-sm text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                Carregando pagamento seguro...
              </div>
            )}
            <div id="paymentBrick_container" />
          </div>

          {processing && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processando pagamento...
            </div>
          )}

          {error && (
            <div className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span>{success}</span>
              </div>
            </div>
          )}

          {pix?.qrCodeBase64 && (
            <div className="mt-5 rounded-2xl border border-border bg-white p-5 text-center">
              <p className="font-semibold text-ink">Pix gerado</p>
              <img
                className="mx-auto mt-4 h-52 w-52"
                src={`data:image/png;base64,${pix.qrCodeBase64}`}
                alt="QR Code Pix"
              />
              {pix.qrCode && (
                <button
                  type="button"
                  className="mt-4 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
                  onClick={() => void navigator.clipboard.writeText(pix.qrCode!)}
                >
                  Copiar Pix Copia e Cola
                </button>
              )}
              {pix.ticketUrl && (
                <a
                  className="mt-3 block text-sm font-medium text-primary underline"
                  href={pix.ticketUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Abrir instruções do Pix
                </a>
              )}
            </div>
          )}

          <div className="mt-7 rounded-2xl border border-border bg-secondary/50 p-4 text-sm">
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-muted-foreground">
                Os dados sensíveis do cartão são tratados pelo Mercado Pago. A NeuroSpectro não armazena número de cartão, CVV ou validade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
