import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const [message, setMessage] = useState("Confirmando seu acesso…");

  useEffect(() => {
    void (async () => {
      if (!supabase) {
        setMessage("O serviço de acesso não está disponível.");
        return;
      }

      const code = new URLSearchParams(window.location.search).get("code");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setMessage("Este link expirou ou já foi utilizado. Solicite um novo link de acesso.");
          return;
        }
      }

      const { data } = await supabase.auth.getSession();
      if (!data.session || data.session.user.is_anonymous) {
        setMessage("Não foi possível confirmar seu acesso. Solicite um novo link.");
        return;
      }

      const { data: access } = await supabase.rpc("has_paid_access");
      if (!access) {
        await supabase.auth.signOut();
        setMessage("Sua conta ainda não possui uma compra confirmada. O acesso é liberado após o pagamento.");
        return;
      }

      const admin = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.session.user.id)
        .maybeSingle();

      window.location.replace(admin.data ? "/admin" : "/dashboard");
    })();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f8fa] px-5">
      <div className="w-full max-w-md rounded-[1.75rem] border border-[#dce5eb] bg-white p-8 text-center shadow-[0_20px_60px_rgba(22,50,70,.08)]">
        <div className="mx-auto mb-5 h-3 w-3 animate-pulse rounded-full bg-[#008b78]" />
        <h1 className="font-display text-2xl font-semibold text-[#172033]">NeuroSpectro</h1>
        <p className="mt-3 text-sm leading-6 text-[#68788a]">{message}</p>
        <a href="/login" className="mt-6 inline-flex rounded-xl bg-[#00769f] px-5 py-3 text-sm font-semibold text-white">Voltar para o acesso</a>
      </div>
    </main>
  );
}
