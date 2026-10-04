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
    <main className="relative min-h-screen overflow-hidden bg-[#071525] font-sans text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-[#5aa9e6]/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 h-[30rem] w-[30rem] rounded-full bg-[#69d5c5]/15 blur-3xl" />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#7c6fe5]/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,.07),transparent_42%)]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
        <Link to="/" aria-label="Voltar para o início" className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>
        <Link to="/" aria-label="NeuroSpectro" className="inline-flex items-center">
          <img src="/neurospectro-logo.jpg" alt="NeuroSpectro" className="h-11 w-auto max-w-[210px] rounded-full object-contain bg-white/95 px-2 py-1" />
        </Link>
      </header>

      <div className="relative z-10 flex min-h-[calc(100vh-92px)] items-center justify-center px-4 pb-10 pt-2 sm:px-6">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.06] shadow-[0_30px_100px_rgba(0,0,0,.35)] backdrop-blur-xl lg:grid-cols-[1.05fr_.95fr]">
          <div className="hidden min-h-[650px] flex-col justify-between border-r border-white/10 p-10 lg:flex">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-white/80">
                <Sparkles className="h-3.5 w-3.5 text-[#8dd9c5]" /> Seu espaço pessoal
              </div>
              <h1 className="mt-8 max-w-md font-display text-5xl font-semibold leading-[1.05] tracking-tight">
                Entenda seu perfil.<br />
                <span className="bg-gradient-to-r from-[#8ecbff] via-[#91e2d0] to-[#b9a5ff] bg-clip-text text-transparent">Descubra novas perspectivas.</span>
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/65">
                Acesse seus resultados, avaliações e conteúdos da sua jornada NeuroSpectro em um só lugar.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-white/55">
              <ShieldCheck className="h-5 w-5 text-[#8dd9c5]" />
              <span>Ambiente protegido por conexão segura.</span>
            </div>
          </div>

          <section className="bg-white p-6 text-[#20243a] sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8 lg:hidden">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#64748b]">NeuroSpectro</p>
                <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Bem-vindo de volta</h1>
                <p className="mt-2 text-sm leading-6 text-[#64748b]">Entre para continuar sua jornada.</p>
              </div>
              <div className="hidden lg:block">
                <h2 className="font-display text-3xl font-semibold tracking-tight">Bem-vindo de volta</h2>
                <p className="mt-2 text-sm leading-6 text-[#64748b]">Entre para continuar sua jornada NeuroSpectro.</p>
              </div>

              {!isSupabaseConfigured ? (
                <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                  O serviço de acesso ainda não foi configurado neste ambiente.
                </div>
              ) : sent ? (
                <div className="mt-7 rounded-2xl border border-[#69cbb9]/30 bg-[#69cbb9]/10 p-5 text-sm leading-6 text-[#245e55]">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0" />
                    <div><strong>Link enviado.</strong><br />Verifique seu e-mail e toque no link para entrar automaticamente.</div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mt-7 grid grid-cols-2 rounded-xl bg-[#f1f5f9] p-1">
                    <button type="button" onClick={() => { setMode("password"); setMessage(""); }} className={mode === "password" ? "rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-[#20243a] shadow-sm" : "rounded-lg px-3 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#20243a]"}>Senha</button>
                    <button type="button" onClick={() => { setMode("magic"); setMessage(""); }} className={mode === "magic" ? "rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-[#20243a] shadow-sm" : "rounded-lg px-3 py-2.5 text-sm font-medium text-[#64748b] hover:text-[#20243a]"}>Link por e-mail</button>
                  </div>

                  {mode === "password" ? (
                    <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
                      <label className="block">
                        <span className="text-sm font-semibold">E-mail</span>
                        <div className="relative mt-2">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b93a7]" />
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="seu@email.com" className="h-13 w-full rounded-xl border border-[#d9dee8] bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-[#a2a9b8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#4f9ed8]/10" />
                        </div>
                      </label>
                      <label className="block">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold">Senha</span>
                          <button type="button" onClick={() => void handleReset()} disabled={loading || !email.trim()} className="text-xs font-semibold text-[#367fb5] hover:underline disabled:opacity-40">Esqueci minha senha</button>
                        </div>
                        <div className="relative mt-2">
                          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b93a7]" />
                          <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" placeholder="Digite sua senha" className="h-13 w-full rounded-xl border border-[#d9dee8] bg-white pl-12 pr-12 text-sm outline-none transition placeholder:text-[#a2a9b8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#4f9ed8]/10" />
                          <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#7b8498] hover:bg-[#f1f5f9] hover:text-[#20243a]">
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </label>
                      {message && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{message}</p>}
                      <button type="submit" disabled={loading || !email.trim() || !password} className="h-13 w-full rounded-xl bg-[#1669a8] px-6 font-semibold text-white shadow-[0_10px_24px_rgba(22,105,168,.22)] transition hover:bg-[#125d96] disabled:cursor-not-allowed disabled:opacity-50">
                        {loading ? "Entrando..." : "Entrar"}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleMagicSubmit} className="mt-6 space-y-5">
                      <label className="block">
                        <span className="text-sm font-semibold">E-mail</span>
                        <div className="relative mt-2">
                          <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8b93a7]" />
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" placeholder="seu@email.com" className="h-13 w-full rounded-xl border border-[#d9dee8] bg-white pl-12 pr-4 text-sm outline-none transition placeholder:text-[#a2a9b8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#4f9ed8]/10" />
                        </div>
                      </label>
                      {message && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm leading-5 text-red-700">{message}</p>}
                      <button type="submit" disabled={loading || !email.trim()} className="h-13 w-full rounded-xl bg-[#1669a8] px-6 font-semibold text-white shadow-[0_10px_24px_rgba(22,105,168,.22)] transition hover:bg-[#125d96] disabled:cursor-not-allowed disabled:opacity-50">
                        {loading ? "Enviando..." : "Receber link de acesso"}
                      </button>
                    </form>
                  )}

                  <div className="mt-7 flex items-center gap-3 rounded-xl bg-[#f7fafc] p-3.5 text-xs leading-5 text-[#667085]">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-[#45a993]" />
                    <span>Seus dados de acesso são tratados por uma conexão segura (HTTPS).</span>
                  </div>
                </>
              )}

              <div className="mt-7 border-t border-[#e7eaf0] pt-5 text-center">
                <Link to="/" className="text-sm font-medium text-[#667085] transition hover:text-[#1669a8]">Voltar para o início</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
