import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, LockKeyhole, ShieldCheck, ArrowLeft, Sparkles } from "lucide-react";
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
    <main className="min-h-screen bg-[#f5f8fa] font-sans text-[#172033]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <section className="relative hidden overflow-hidden bg-[#003b5c] px-10 py-10 text-white lg:flex lg:w-[46%] lg:flex-col lg:justify-between xl:px-14">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#008b78]/25 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#4bb8d8]/20 blur-3xl" />
          <div className="relative">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-white/75 hover:text-white">
              <ArrowLeft className="h-4 w-4" /> Voltar ao início
            </Link>
            <img src="/neurospectro-temp.svg" alt="NeuroSpectro" className="mt-14 h-16 w-auto max-w-[280px] rounded-xl bg-white p-1" />
            <div className="mt-16 max-w-lg">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8dd9c5]">Sua jornada começa aqui</p>
              <h1 className="mt-4 font-display text-5xl font-semibold leading-[1.06] tracking-tight xl:text-6xl">
                Entenda seu perfil.<br />
                <span className="text-[#8dd9c5]">Descubra novas perspectivas.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/70">
                Acesse seus resultados, avaliações e conteúdos da sua jornada NeuroSpectro.
              </p>
            </div>
          </div>
          <div className="relative flex items-center gap-3 text-sm text-white/65">
            <ShieldCheck className="h-5 w-5 text-[#8dd9c5]" />
            <span>Conexão segura e autenticação protegida.</span>
          </div>
        </section>

        <section className="flex w-full items-center justify-center px-5 py-8 sm:px-8 lg:w-[54%] lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#526174]">
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Link>
              <img src="/neurospectro-temp.svg" alt="NeuroSpectro" className="mt-7 h-14 w-auto max-w-[230px] rounded-xl bg-white p-1 shadow-sm" />
            </div>

            <div className="rounded-[1.75rem] border border-[#dce5eb] bg-white p-6 shadow-[0_20px_60px_rgba(22,50,70,.08)] sm:p-9">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#008b78]">Área do cliente</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-[#172033]">Bem-vindo de volta</h2>
                <p className="mt-2 text-sm leading-6 text-[#68788a]">Entre para continuar sua jornada NeuroSpectro.</p>
              </div>

              {!isSupabaseConfigured ? (
                <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  O serviço de acesso ainda não foi configurado neste ambiente.
                </div>
              ) : sent ? (
                <div className="mt-7 rounded-2xl border border-[#9bd9cf] bg-[#eef8f6] p-5 text-sm leading-6 text-[#285e56]">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#008b78]" />
                    <div><strong>Link enviado.</strong><br />Verifique seu e-mail e toque no link para entrar automaticamente.</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-7 grid grid-cols-2 rounded-xl bg-[#edf3f6] p-1">
                    <button type="button" onClick={() => { setMode("password"); setMessage(""); }} className={mode === "password" ? "rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-[#172033] shadow-sm" : "rounded-lg px-3 py-2.5 text-sm font-medium text-[#68788a] hover:text-[#172033]"}>Senha</button>
                    <button type="button" onClick={() => { setMode("magic"); setMessage(""); }} className={mode === "magic" ? "rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-[#172033] shadow-sm" : "rounded-lg px-3 py-2.5 text-sm font-medium text-[#68788a] hover:text-[#172033]"}>Link por e-mail</button>
                  </div>

                  {mode === "password" ? (
                    <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
                      <label className="block">
                        <span className="text-sm font-semibold text-[#263447]">E-mail</span>
                        <div className="relative mt-2">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8795a5]" />
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="seu@email.com" className="h-13 w-full rounded-xl border border-[#d4e0e6] bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-[#9aa7b4] focus:border-[#008b78] focus:ring-4 focus:ring-[#008b78]/10" />
                        </div>
                      </label>
                      <label className="block">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#263447]">Senha</span>
                          <button type="button" onClick={() => void handleReset()} disabled={loading || !email.trim()} className="text-xs font-semibold text-[#00769f] hover:underline disabled:opacity-40">Esqueci minha senha</button>
                        </div>
                        <div className="relative mt-2">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8795a5]" />
                          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="Digite sua senha" className="h-13 w-full rounded-xl border border-[#d4e0e6] bg-white pl-12 pr-12 text-sm outline-none transition placeholder:text-[#9aa7b4] focus:border-[#008b78] focus:ring-4 focus:ring-[#008b78]/10" />
                          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#7d8b9a] hover:bg-[#edf3f6] hover:text-[#172033]">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </label>
                      {message && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{message}</p>}
                      <button type="submit" disabled={loading || !email.trim() || !password} className="h-13 w-full rounded-xl bg-[#00769f] px-6 font-semibold text-white shadow-[0_10px_24px_rgba(0,118,159,.2)] transition hover:bg-[#006786] disabled:cursor-not-allowed disabled:opacity-50">
                        {loading ? "Entrando..." : "Entrar"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleMagicSubmit} className="mt-6 space-y-5">
                      <label className="block">
                        <span className="text-sm font-semibold text-[#263447]">E-mail</span>
                        <div className="relative mt-2">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8795a5]" />
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="seu@email.com" className="h-13 w-full rounded-xl border border-[#d4e0e6] bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-[#9aa7b4] focus:border-[#008b78] focus:ring-4 focus:ring-[#008b78]/10" />
                        </div>
                      </label>
                      {message && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{message}</p>}
                      <button type="submit" disabled={loading || !email.trim()} className="h-13 w-full rounded-xl bg-[#00769f] px-6 font-semibold text-white shadow-[0_10px_24px_rgba(0,118,159,.2)] transition hover:bg-[#006786] disabled:cursor-not-allowed disabled:opacity-50">
                        {loading ? "Enviando..." : "Receber link de acesso"}
                      </button>
                    </form>
                  )}

                  <div className="mt-6 flex items-start gap-3 rounded-xl bg-[#f3f8f7] p-3.5 text-xs leading-5 text-[#607080]">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#008b78]" />
                    <span>Seus dados são transmitidos por HTTPS e sua senha não é exibida nem armazenada nesta página.</span>
                  </div>
                </>
              )}

              <div className="mt-7 border-t border-[#e7edf1] pt-5 text-center">
                <Link to="/" className="text-sm font-medium text-[#68788a] transition hover:text-[#00769f]">Voltar para o início</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
