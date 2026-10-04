import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, LogOut, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
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

  async function logout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    await navigate({ to: "/login", replace: true });
  }

  return (
    <main className="min-h-screen bg-[#f7f9fb] px-4 py-6 font-sans text-[#172033] sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-lg">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#526174] hover:text-[#00769f]">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Link>

        <section className="mt-5 overflow-hidden rounded-3xl border border-[#dce5eb] bg-white shadow-[0_16px_50px_rgba(22,50,70,.07)]">
          <div className="bg-gradient-to-br from-[#003b5c] to-[#008b78] px-6 py-7 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
                <UserCircle2 className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold">Minha conta</h1>
                {email && <p className="mt-1 truncate text-sm text-white/75">{email}</p>}
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <Link
              to="/dashboard"
              className="flex items-center justify-between rounded-2xl bg-[#f3f8fa] px-4 py-4 font-semibold text-[#172033] hover:bg-[#eaf5f7]"
            >
              <span>Minha área e resultados</span>
              <span className="text-xl text-[#00769f]">›</span>
            </Link>

            <Link
              to="/alterar-senha"
              className="mt-3 flex items-center gap-3 rounded-2xl border border-[#dce5eb] px-4 py-4 text-sm font-semibold text-[#526174] hover:border-[#9bcfc5] hover:text-[#00769f]"
            >
              <KeyRound className="h-4 w-4" />
              Alterar senha
            </Link>

            <button
              type="button"
              onClick={() => void logout()}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#fef5f5] px-4 py-3 text-sm font-semibold text-[#a44b4b] hover:bg-[#fdeaea]"
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </button>

            <Link to="/" className="mt-4 block text-center text-sm text-[#68788a] hover:text-[#00769f]">
              Voltar ao início
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
