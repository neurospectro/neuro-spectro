import { createFileRoute, Link } from "@tanstack/react-router";
import { UserCircle, FileText, KeyRound, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/conta")({
  head: () => ({ meta: [{ title: "Minha conta — NeuroSpectro" }, { name: "robots", content: "noindex,nofollow,noarchive" }] }),
  component: Conta,
});

function Conta() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => { void (async () => { if (!supabase) return; const { data } = await supabase.auth.getUser(); setEmail(data.user?.email ?? null); })(); }, []);
  return <main className="min-h-screen bg-background px-5 py-12 font-sans"><div className="mx-auto max-w-xl">
    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← NeuroSpectro</Link>
    <section className="mt-10 rounded-[2rem] border border-border bg-card p-7 shadow-soft">
      <UserCircle className="h-8 w-8 text-primary" /><h1 className="mt-4 font-display text-3xl font-semibold text-ink">Minha conta</h1>
      <p className="mt-2 text-muted-foreground">{email ? `Conta conectada: ${email}` : "Acesse sua área para consultar seus resultados e produtos."}</p>
      <div className="mt-7 grid gap-3">
        <Link to="/dashboard" className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary/40"><FileText className="h-5 w-5 text-primary"/>Minha área e resultados</Link>
        <Link to="/avaliacao" className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary/40"><FileText className="h-5 w-5 text-primary"/>Minha avaliação</Link>\n        <Link to="/alterar-senha" className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary/40"><KeyRound className="h-5 w-5 text-primary"/>Alterar minha senha</Link>
        <Link to="/login" className="flex items-center gap-3 rounded-xl border border-border p-4 hover:border-primary/40"><LogOut className="h-5 w-5 text-primary"/>Entrar com meu e-mail</Link>
      </div>
    </section>
  </div></main>;
}
