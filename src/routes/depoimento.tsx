import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Clock3, MessageSquareQuote, ShieldCheck, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type TestimonialRow = {
  id: string;
  name: string;
  text: string;
  status: "PENDING" | "APPROVED" | "HIDDEN";
  created_at: string;
};

export const Route = createFileRoute("/depoimento")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow,noarchive" }] }),
  component: TestimonialPage,
});

function TestimonialPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [rows, setRows] = useState<TestimonialRow[]>([]);
  const [name, setName] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function loadUser() {
    if (!supabase) {
      setLoading(false);
      setMessage("O Supabase ainda não foi configurado neste ambiente.");
      return;
    }

    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      await navigate({ to: "/login" });
      return;
    }

    setUserEmail(data.user.email ?? "");
    const { data: testimonials, error: testimonialsError } = await supabase
      .from("depoimentos")
      .select("id,name,text,status,created_at")
      .order("created_at", { ascending: false });

    if (testimonialsError) setMessage(testimonialsError.message);
    else setRows((testimonials ?? []) as TestimonialRow[]);
    setLoading(false);
  }

  useEffect(() => {
    void loadUser();
    if (!supabase) return;
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) void navigate({ to: "/login" });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !name.trim() || testimonial.trim().length < 10 || !consent) return;

    setSubmitting(true);
    setMessage("");

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setSubmitting(false);
      await navigate({ to: "/login" });
      return;
    }

    const { error } = await supabase.from("depoimentos").insert({
      user_id: userData.user.id,
      name: name.trim(),
      text: testimonial.trim(),
      consented_to_publish: true,
      status: "PENDING",
    });

    setSubmitting(false);
    if (error) {
      setMessage(error.message);
      return;
    }

    setSubmitted(true);
    setName("");
    setTestimonial("");
    setConsent(false);
    await loadUser();
  }

  async function signOut() {
    if (supabase) await supabase.auth.signOut();
    await navigate({ to: "/" });
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-muted-foreground">Carregando sua área...</main>;
  }

  return (
    <main className="min-h-screen bg-background px-5 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="text-sm font-medium text-primary">← NeuroSpectro</Link>
          <button onClick={signOut} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>

        <section className="mt-8 rounded-[2rem] border border-border bg-card p-7 shadow-soft md:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
            <MessageSquareQuote className="h-6 w-6" />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-primary">Área do usuário</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Conte como foi sua experiência</h1>
          <p className="mt-3 text-muted-foreground">Conectado como {userEmail || "usuário"}.</p>

          {submitted && (
            <div className="mt-6 flex gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-6">Recebemos seu depoimento. Ele ficará em <strong>PENDING</strong> até a revisão da equipe.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Nome para exibição</span>
              <input value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" placeholder="Como você gostaria de aparecer?" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Seu depoimento</span>
              <textarea value={testimonial} onChange={(event) => setTestimonial(event.target.value)} maxLength={1000} minLength={10} required rows={6} className="mt-2 w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" placeholder="Conte brevemente como foi sua experiência..." />
              <span className="mt-2 block text-xs text-muted-foreground">{testimonial.length}/1000</span>
            </label>
            <label className="flex items-start gap-3 rounded-2xl border border-border bg-muted/40 p-4">
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required className="mt-1 h-4 w-4 accent-primary" />
              <span className="text-sm leading-6 text-muted-foreground">Autorizo a NeuroSpectro a publicar este depoimento com o nome informado acima. Entendo que o relato passará por aprovação e poderá ser recusado ou removido.</span>
            </label>
            {message && <p className="text-sm text-destructive">{message}</p>}
            <button type="submit" disabled={submitting || !name.trim() || testimonial.trim().length < 10 || !consent} className="w-full rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground transition-opacity disabled:cursor-not-allowed disabled:opacity-50">
              {submitting ? "Enviando..." : "Enviar depoimento"}
            </button>
          </form>
        </section>

        {rows.length > 0 && (
          <section className="mt-6 rounded-[2rem] border border-border bg-card p-7 shadow-soft">
            <h2 className="font-display text-xl font-semibold text-ink">Meus depoimentos</h2>
            <div className="mt-5 space-y-3">
              {rows.map((row) => (
                <div key={row.id} className="rounded-2xl border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-ink">{row.name}</p>
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">{row.status}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{row.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <Clock3 className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-semibold text-ink">Revisão antes da publicação</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Todo relato começa com status PENDING.</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm font-semibold text-ink">Consentimento explícito</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">A publicação depende da autorização do usuário.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
