import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, MailCheck, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SecurityCaptcha, isTurnstileConfigured } from "@/components/security-captcha";

export const Route = createFileRoute("/pos-compra")({
  component: PostPurchasePage,
});

function PostPurchasePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      const currentEmail = data.session?.user.email ?? "";
      if (currentEmail) setEmail(currentEmail);
    });
  }, []);

  async function createAccess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !email.trim()) return;
    if (!isTurnstileConfigured()) {
      setMessage("A verificação de segurança ainda não está disponível.");
      return;
    }
    if (!captchaToken) {
      setMessage("Marque a verificação de segurança para continuar.");
      return;
    }

    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        captchaToken,
      },
    });

    setLoading(false);

    if (error) {
      setMessage("Não foi possível enviar o acesso agora. Tente novamente.");
      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-xl items-center justify-center">
        <section className="w-full rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-9">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Compra confirmada
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Você está a um passo de descobrir seu perfil.
          </h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            Seu pagamento foi recebido. Agora crie seu acesso para consultar seu Relatório Completo e acompanhar tudo pelo seu dashboard.
          </p>

          <div className="mt-7 rounded-3xl border border-primary/15 bg-primary/5 p-5">
            <div className="flex items-center gap-3">
              <MailCheck className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-ink">Crie seu acesso</h2>
            </div>

            {sent ? (
              <div className="mt-4 text-sm leading-6 text-foreground">
                <strong>Link enviado.</strong> Verifique seu e-mail e toque no link para entrar na sua conta e acessar seu dashboard.
              </div>
            ) : (
              <form onSubmit={createAccess} className="mt-4 space-y-4">
                <label className="block">
                  <span className="text-sm font-semibold text-ink">E-mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    placeholder="voce@email.com"
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                {message && <p className="text-sm text-destructive">{message}</p>}

                <SecurityCaptcha onToken={setCaptchaToken} />

                <button
                  type="submit"
                  disabled={loading || !email.trim() || !captchaToken}
                  className="w-full rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "CRIAR MEU ACESSO"}
                </button>
              </form>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void navigate({ to: "/login" })}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-5 py-3 font-semibold text-ink hover:bg-secondary"
            >
              <MailCheck className="h-4 w-4" />
              JÁ TENHO UMA CONTA · ENTRAR
            </button>

          </div>

          <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">
            O acesso é vinculado ao e-mail informado na compra. Você não precisa criar uma senha.
          </p>

          <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Voltar para a NeuroSpectro
          </Link>
        </section>
      </div>
    </main>
  );
}
