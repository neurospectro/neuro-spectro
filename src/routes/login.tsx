import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, MailCheck } from "lucide-react";
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
      setMessage("E-mail ou senha inválidos. Se for seu primeiro acesso, use o link mágico ou redefina sua senha.");
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
    <main className="min-h-screen bg-background px-5 py-12">
      <div className="mx-auto max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-primary"><ArrowLeft className="h-4 w-4" /> NeuroSpectro</Link>
        <section className="mt-8 rounded-[2rem] border border-border bg-card p-8 shadow-soft">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            {mode === "password" ? <KeyRound className="h-6 w-6" /> : <MailCheck className="h-6 w-6" />}
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Acesso seguro</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Minha área</h1>
          <p className="mt-3 text-muted-foreground">Entre com sua senha ou receba um link seguro no e-mail. O mesmo acesso identifica automaticamente contas administrativas.</p>

          {!isSupabaseConfigured ? (
            <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">O Supabase ainda não foi configurado neste ambiente.</div>
          ) : sent ? (
            <div className="mt-7 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-6 text-foreground"><strong>Link enviado.</strong> Verifique seu e-mail e toque no link para voltar automaticamente à NeuroSpectro.</div>
          ) : (
            <>
              <div className="mt-7 grid grid-cols-2 rounded-full bg-secondary p-1 text-sm font-semibold">
                <button type="button" onClick={() => { setMode("password"); setMessage(""); }} className={mode === "password" ? "rounded-full bg-card px-4 py-2 text-ink shadow-sm" : "rounded-full px-4 py-2 text-muted-foreground"}>Senha</button>
                <button type="button" onClick={() => { setMode("magic"); setMessage(""); }} className={mode === "magic" ? "rounded-full bg-card px-4 py-2 text-ink shadow-sm" : "rounded-full px-4 py-2 text-muted-foreground"}>Link mágico</button>
              </div>

              {mode === "password" ? (
                <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
                  <label className="block"><span className="text-sm font-semibold text-ink">E-mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="voce@email.com" className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" /></label>
                  <label className="block"><span className="text-sm font-semibold text-ink">Senha</span><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="Sua senha" className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" /></label>
                  {message && <p className="text-sm text-destructive">{message}</p>}
                  <button type="submit" disabled={loading || !email.trim() || !password} className="w-full rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Entrando..." : "Entrar"}</button>
                  <button type="button" onClick={() => void handleReset()} disabled={loading || !email.trim()} className="w-full text-sm font-medium text-primary hover:underline disabled:opacity-50">Esqueci minha senha</button>
                </form>
              ) : (
                <form onSubmit={handleMagicSubmit} className="mt-6 space-y-5">
                  <label className="block"><span className="text-sm font-semibold text-ink">Seu e-mail</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="voce@email.com" className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" /></label>
                  {message && <p className="text-sm text-destructive">{message}</p>}
                  <button type="submit" disabled={loading || !email.trim()} className="w-full rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Enviando..." : "Receber link de acesso"}</button>
                </form>
              )}
            </>
          )}

          <div className="mt-6 text-center"><Link to="/alterar-senha" className="text-sm font-medium text-muted-foreground hover:text-primary">Já estou logado e quero alterar minha senha</Link></div>
        </section>
      </div>
    </main>
  );
}
