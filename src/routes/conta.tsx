import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, FileText, KeyRound, LogIn, ShieldCheck, UserCircle2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/conta")({
  head: () => ({ meta: [{ title: "Minha conta — NeuroSpectro" }, { name: "robots", content: "noindex,nofollow,noarchive" }] }),
  component: Conta,
});

function Conta() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      if (!supabase) return;
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? null);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f9fb] px-4 py-5 font-sans text-[#172033] sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-3xl">
        <header className="flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#526174] transition hover:text-[#006f9b]">
            <ArrowLeft className="h-4 w-4" /> NeuroSpectro
          </Link>
          <div className="hidden items-center gap-2 rounded-full border border-[#dce5eb] bg-white px-3 py-1.5 text-xs font-semibold text-[#526174] sm:flex">
            <ShieldCheck className="h-4 w-4 text-[#008b78]" /> Conexão segura
          </div>
        </header>

        <section className="mt-7 overflow-hidden rounded-[2rem] border border-[#dce5eb] bg-white shadow-[0_20px_70px_rgba(22,50,70,.08)]">
          <div className="bg-gradient-to-br from-[#003b5c] via-[#005c7d] to-[#008b78] px-6 py-8 text-white sm:px-10 sm:py-10">
            <div className="flex items-start justify-between gap-5">
              <div>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/12 ring-1 ring-white/20">
                  <UserCircle2 className="h-7 w-7" />
                </div>
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Minha conta</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-white/75">
                  Acesse sua jornada, avaliações e resultados NeuroSpectro em um só lugar.
                </p>
              </div>
              <img src="/neurospectro-temp.svg" alt="NeuroSpectro" className="hidden h-14 w-auto max-w-[190px] rounded-xl bg-white p-1 sm:block" />
            </div>
            {email && (
              <div className="mt-6 inline-flex max-w-full items-center rounded-full bg-white/10 px-4 py-2 text-sm text-white/85 ring-1 ring-white/15">
                <span className="truncate">{email}</span>
              </div>
            )}
          </div>

          <div className="p-5 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#68788a]">Acesso rápido</p>
            <div className="mt-4 divide-y divide-[#e7edf1] overflow-hidden rounded-2xl border border-[#dce5eb]">
              <AccountAction to="/dashboard" icon={<FileText />} title="Minha área e resultados" description="Consulte seus resultados, produtos e acessos." />
              <AccountAction to="/avaliacao" icon={<FileText />} title="Minha avaliação" description="Continue ou consulte sua avaliação." />
              <AccountAction to="/alterar-senha" icon={<KeyRound />} title="Alterar minha senha" description="Atualize sua senha de acesso com segurança." />
              <AccountAction to="/login" icon={<LogIn />} title="Entrar com outro e-mail" description="Acesse outra conta NeuroSpectro." />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#eef8f6] p-4 text-sm text-[#285e56]">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#008b78]" />
              <p className="leading-5"><strong>Ambiente protegido.</strong> Sua senha não é exibida nesta página e a autenticação é feita pelo serviço seguro de acesso.</p>
            </div>

            <button type="button" onClick={() => void navigate({ to: "/" })} className="mt-5 w-full rounded-xl border border-[#dce5eb] bg-white px-4 py-3 text-sm font-semibold text-[#526174] transition hover:border-[#8bcfc3] hover:bg-[#f5fbfa]">
              Voltar para o início
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function AccountAction({ to, icon, title, description }: { to: "/dashboard" | "/avaliacao" | "/alterar-senha" | "/login"; icon: ReactNode; title: string; description: string }) {
  return (
    <Link to={to} className="group flex items-center gap-4 bg-white px-4 py-4 transition hover:bg-[#f7fbfc] sm:px-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eef6fa] text-[#00769f] transition group-hover:bg-[#dff3f0] group-hover:text-[#008b78]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold text-[#172033]">{title}</span>
        <span className="mt-0.5 block text-xs leading-5 text-[#6b7a8b]">{description}</span>
      </span>
      <ChevronRight className="h-5 w-5 shrink-0 text-[#a3afbb] transition group-hover:translate-x-0.5 group-hover:text-[#008b78]" />
    </Link>
  );
}
