import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { MailCheck, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/depoimento" });
    });
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !email.trim()) return;

    setLoading(true);
    setMessage("");

    const redirectTo = `${window.location.origin}/depoimento`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12">
      <div className="mx-auto max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          <ArrowLeft className="h-4 w-4" /> NeuroSpectro
        </Link>

        <section className="mt-8 rounded-[2rem] border border-border bg-card p-8 shadow-soft">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <MailCheck className="h-6 w-6" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Acesso do usuário</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Entre sem senha.</h1>
          <p className="mt-3 text-muted-foreground">
            Enviaremos um link seguro para seu e-mail. Você poderá acessar sua área e enviar seu depoimento para revisão.
          </p>

          {!isSupabaseConfigured ? (
            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              O Supabase ainda não foi configurado neste ambiente. Adicione VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY para ativar o login.
            </div>
          ) : sent ? (
            <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-6 text-foreground">
              <strong>Link enviado.</strong> Verifique seu e-mail e toque no link para voltar automaticamente à NeuroSpectro.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Seu e-mail</span>
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

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Enviando..." : "Receber link de acesso"}
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}
