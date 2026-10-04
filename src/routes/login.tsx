import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow,noarchive" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!supabase) return;
    void (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session || data.session.user.is_anonymous) return;
      const admin = await supabase.from("admin_users").select("user_id").eq("user_id", data.session.user.id).maybeSingle();
      await navigate({ to: admin.data ? "/admin" : "/dashboard", replace: true });
    })();
  }, [navigate]);

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !email.trim() || !password) return;
    setLoading(true);
    setMessage("");
    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setLoading(false);
      setMessage("E-mail ou senha inválidos. Tente novamente ou redefina sua senha.");
      return;
    }
    const admin = await supabase.from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
    setLoading(false);
    await navigate({ to: admin.data ? "/admin" : "/dashboard", replace: true });
  }

  async function handleMagicSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !email.trim()) return;
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.origin + "/dashboard" },
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setSent(true);
  }

  async function handleReset() {
    if (!supabase || !email.trim()) {
      setMessage("Digite seu e-mail para receber o link de redefinição.");
      return;
    }
    setLoading(true);
    setMessage("");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: window.location.origin + "/alterar-senha",
    });
    setLoading(false);
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Se existir uma conta para este e-mail, enviaremos um link para redefinir a senha.");
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[440px] flex-col justify-center">
        <div className="mb-8 text-center">
          <Link to="/" aria-label="Ir para a página inicial" className="inline-flex items-center justify-center">
            <img src="/neurospectro-logo.jpg" alt="NeuroSpectro" className="h-auto w-[190px] rounded-full object-contain" />
          </Link>
        </div>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Entrar</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Acesse sua conta NeuroSpectro para continuar sua jornada.
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              O serviço de acesso ainda não foi configurado neste ambiente.
            </div>
          ) : sent ? (
            <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-5 text-sm leading-6 text-foreground">
              <strong>Link enviado.</strong> Verifique seu e-mail e toque no link para entrar automaticamente na NeuroSpectro.
            </div>
          ) : (
            <>
              <div className="mt-6 grid grid-cols-2 rounded-lg border border-border bg-muted/60 p-1 text-sm font-medium">
                <button type="button" onClick={() => { setMode("password"); setMessage(""); }} className={mode === "password" ? "rounded-md bg-card px-3 py-2 text-ink shadow-sm" : "rounded-md px-3 py-2 text-muted-foreground hover:text-foreground"}>
                  Senha
                </button>
                <button type="button" onClick={() => { setMode("magic"); setMessage(""); }} className={mode === "magic" ? "rounded-md bg-card px-3 py-2 text-ink shadow-sm" : "rounded-md px-3 py-2 text-muted-foreground hover:text-foreground"}>
                  Link por e-mail
                </button>
              </div>

              {mode === "password" ? (
                <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-ink">E-mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </label>

                  <label className="block">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">Senha</span>
                      <button type="button" onClick={() => void handleReset()} disabled={loading || !email.trim()} className="text-xs font-medium text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50">
                        Esqueci minha senha
                      </button>
                    </div>
                    <div className="relative mt-2">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        placeholder="Digite sua senha"
                        className="h-12 w-full rounded-lg border border-border bg-background px-4 pr-12 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                      />
                      <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground">
                        {showPassword ? "Ocultar" : "Mostrar"}
                      </button>
                    </div>
                  </label>

                  {message && <p role="alert" className="text-sm leading-5 text-destructive">{message}</p>}

                  <button type="submit" disabled={loading || !email.trim() || !password} className="h-12 w-full rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50">
                    {loading ? "Entrando..." : "Entrar"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleMagicSubmit} className="mt-6 space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium text-ink">E-mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      placeholder="seu@email.com"
                      className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                    />
                  </label>
                  {message && <p role="alert" className="text-sm leading-5 text-destructive">{message}</p>}
                  <button type="submit" disabled={loading || !email.trim()} className="h-12 w-full rounded-lg bg-primary px-6 font-semibold text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50">
                    {loading ? "Enviando..." : "Receber link de acesso"}
                  </button>
                </form>
              )}
            </>
          )}

          <div className="mt-6 border-t border-border pt-5 text-center">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-primary">Voltar para o início</Link>
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-muted-foreground">Acesso protegido e destinado aos usuários da NeuroSpectro.</p>
      </div>
    </main>
  );
}
