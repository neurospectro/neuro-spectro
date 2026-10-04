import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/alterar-senha")({
  head: () => ({ meta: [{ title: "Alterar senha — NeuroSpectro" }, { name: "robots", content: "noindex,nofollow,noarchive" }] }),
  component: AlterarSenha,
});

function AlterarSenha() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecovery(true);
    });

    void supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? "");
      setLoading(false);
      if (!data.user) setMessage("Entre na sua conta ou use o link de redefinição enviado por e-mail.");
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setMessage("");
    setSuccess(false);

    if (newPassword.length < 8) {
      setMessage("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmation) {
      setMessage("As senhas não coincidem.");
      return;
    }

    setSaving(true);

    if (!recovery && currentPassword) {
      const { error: reauthError } = await supabase.auth.signInWithPassword({ email, password: currentPassword });
      if (reauthError) {
        setSaving(false);
        setMessage("A senha atual está incorreta.");
        return;
      }
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmation("");
    setSuccess(true);
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-muted-foreground">Carregando...</main>;

  return (
    <main className="min-h-screen bg-background px-5 py-12">
      <div className="mx-auto max-w-md">
        <Link to="/conta" className="inline-flex items-center gap-2 text-sm font-medium text-primary"><ArrowLeft className="h-4 w-4" /> Minha conta</Link>
        <section className="mt-8 rounded-[2rem] border border-border bg-card p-8 shadow-soft">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary"><KeyRound className="h-6 w-6" /></div>
          <h1 className="mt-5 font-display text-3xl font-semibold text-ink">Alterar senha</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{email ? "Conta: " + email : "Use o link de recuperação enviado para seu e-mail."}</p>

          {success && <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground"><strong>Senha alterada.</strong> Sua nova senha já pode ser usada no acesso.</div>}

          {email && !recovery && (
            <label className="mt-6 block">
              <span className="text-sm font-semibold text-ink">Senha atual</span>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" placeholder="Sua senha atual" className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />
            </label>
          )}

          <form onSubmit={submit} className="mt-5 space-y-5">
            <label className="block"><span className="text-sm font-semibold text-ink">Nova senha</span><input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required autoComplete="new-password" placeholder="Mínimo de 8 caracteres" className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" /></label>
            <label className="block"><span className="text-sm font-semibold text-ink">Confirmar nova senha</span><input type="password" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} required autoComplete="new-password" placeholder="Digite novamente" className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" /></label>
            {message && <p className="text-sm text-destructive">{message}</p>}
            <button type="submit" disabled={saving || !email || !newPassword || !confirmation} className="w-full rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{saving ? "Salvando..." : "Salvar nova senha"}</button>
          </form>

          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-secondary/50 p-4 text-xs leading-5 text-muted-foreground"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> A senha é gerenciada pelo Supabase Auth e não é armazenada no código do site.</div>
        </section>
      </div>
    </main>
  );
}
