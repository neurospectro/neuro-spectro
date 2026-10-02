import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Clock3, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Reading = {
  id: string;
  status: string;
  story: string | null;
  development_notes: string | null;
  current_context: string | null;
  specialist_response: string | null;
  submitted_at: string | null;
  response_sent_at: string | null;
};

export const Route = createFileRoute("/leitura-trajetoria")({ component: TrajectoryReading });

function TrajectoryReading() {
  const [reading, setReading] = useState<Reading | null>(null);
  const [email, setEmail] = useState("");
  const [story, setStory] = useState("");
  const [developmentNotes, setDevelopmentNotes] = useState("");
  const [currentContext, setCurrentContext] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [locked, setLocked] = useState(false);

  useEffect(() => { void load(); }, []);

  async function load() {
    if (!supabase) { setLoading(false); return; }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) { setLoading(false); return; }
    setEmail(auth.user.email ?? "");

    const { data: access } = await supabase
      .from("acessos")
      .select("status,expires_at,produtos(slug)")
      .eq("status", "active")
      .eq("produtos.slug", "leitura-trajetoria")
      .limit(1)
      .maybeSingle();

    const accessRow = access as { status: string; expires_at: string | null; produtos?: { slug: string } | null } | null;
    const valid = Boolean(accessRow?.status === "active" && accessRow?.produtos?.slug === "leitura-trajetoria" && (!accessRow.expires_at || new Date(accessRow.expires_at).getTime() > Date.now()));
    if (!valid) { setLocked(true); setLoading(false); return; }

    const { data } = await supabase
      .from("leituras_trajetoria")
      .select("id,status,story,development_notes,current_context,specialist_response,submitted_at,response_sent_at,notification_sent_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      const row = data as Reading;
      setReading(row);
      setStory(row.story ?? "");
      setDevelopmentNotes(row.development_notes ?? "");
      setCurrentContext(row.current_context ?? "");
    }
    setLoading(false);
  }

  async function saveDraft() {
    if (!supabase) return;
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    setSaving(true);
    setMessage("");
    const payload = {
      user_id: auth.user.id,
      email: auth.user.email ?? email,
      story: story.trim() || null,
      development_notes: developmentNotes.trim() || null,
      current_context: currentContext.trim() || null,
      status: "draft",
      updated_at: new Date().toISOString(),
    };

    const result = reading
      ? await supabase.from("leituras_trajetoria").update(payload).eq("id", reading.id).select("id,status,story,development_notes,current_context,specialist_response,submitted_at,response_sent_at,notification_sent_at").single()
      : await supabase.from("leituras_trajetoria").insert(payload).select("id,status,story,development_notes,current_context,specialist_response,submitted_at,response_sent_at,notification_sent_at").single();

    if (result.error) setMessage(result.error.message);
    else {
      setReading(result.data as Reading);
      setMessage("Rascunho salvo.");
    }
    setSaving(false);
  }

  async function submit() {
    if (!supabase) return;
    if (story.trim().length < 100) {
      setMessage("Conte um pouco mais da sua história. O relato precisa ter pelo menos 100 caracteres para que o especialista tenha contexto suficiente.");
      return;
    }
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;
    setSaving(true);
    setMessage("");

    const payload = {
      user_id: auth.user.id,
      email: auth.user.email ?? email,
      story: story.trim(),
      development_notes: developmentNotes.trim() || null,
      current_context: currentContext.trim() || null,
      status: "submitted",
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = reading
      ? await supabase.from("leituras_trajetoria").update(payload).eq("id", reading.id).eq("status", "draft").select("id,status,story,development_notes,current_context,specialist_response,submitted_at,response_sent_at,notification_sent_at").single()
      : await supabase.from("leituras_trajetoria").insert(payload).select("id,status,story,development_notes,current_context,specialist_response,submitted_at,response_sent_at,notification_sent_at").single();

    if (result.error) setMessage(result.error.message);
    else {
      const submittedReading = result.data as Reading;
      setReading(submittedReading);
      setMessage("Sua história foi enviada. Você receberá uma confirmação por e-mail e a devolutiva será disponibilizada em até 3 dias.");

      const { error: notificationError } = await supabase.functions.invoke("notify-trajectory-submission", {
        body: { readingId: submittedReading.id },
      });
      if (notificationError) {
        console.error("TRAJECTORY_NOTIFICATION_ERROR", notificationError);
        setMessage("Sua história foi recebida e já está na fila. A confirmação por e-mail será processada em seguida.");
      } else {
        setReading({ ...submittedReading, notification_sent_at: new Date().toISOString() });
      }
    }
    setSaving(false);
  }

  if (loading) return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-muted-foreground">Preparando sua Leitura de Trajetória...</main>;

  if (locked) {
    return (
      <main className="min-h-screen bg-background px-5 py-12">
        <div className="mx-auto max-w-xl rounded-[2rem] border border-border bg-card p-8 text-center shadow-soft">
          <Sparkles className="mx-auto h-8 w-8 text-primary" />
          <h1 className="mt-5 font-display text-3xl font-semibold text-ink">Leitura de Trajetória</h1>
          <p className="mt-3 leading-6 text-muted-foreground">Conte sua história e receba uma devolutiva individual de um especialista parceiro. Esta oferta é complementar ao Relatório Completo.</p>
          <Link to="/checkout/$offerId" params={{ offerId: "trajectory-reading-14990" }} className="mt-6 inline-flex rounded-full bg-primary px-7 py-3.5 font-semibold text-primary-foreground">Conhecer · R$ 149,90</Link>
          <div className="mt-4"><Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Voltar para minha área</Link></div>
        </div>
      </main>
    );
  }

  if (reading?.status === "completed" && reading.specialist_response) {
    return (
      <main className="min-h-screen bg-secondary/40 px-4 py-8 font-sans sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Minha área</Link>
          <section className="mt-6 rounded-[2rem] border border-border bg-card p-7 shadow-soft sm:p-9">
            <div className="flex items-center gap-3 text-primary"><CheckCircle2 className="h-6 w-6" /><span className="text-sm font-semibold">Devolutiva disponível</span></div>
            <h1 className="mt-4 font-display text-3xl font-semibold text-ink">Sua Leitura de Trajetória</h1>
            <div className="mt-7 whitespace-pre-wrap text-sm leading-7 text-ink">{reading.specialist_response}</div>
            <div className="mt-8 rounded-2xl border border-border bg-secondary/50 p-5 text-xs leading-5 text-muted-foreground">
              Esta devolutiva é informativa e não constitui diagnóstico, laudo, avaliação psicológica ou documento médico.
            </div>
          </section>
        </div>
      </main>
    );
  }

  const submitted = reading?.status === "submitted" || reading?.status === "in_review";

  return (
    <main className="min-h-screen bg-secondary/40 px-4 py-8 font-sans sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Minha área</Link>

        <section className="mt-6 rounded-[2rem] border border-primary/15 bg-card p-7 shadow-soft sm:p-9">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">NeuroSpectro · R$ 149,90</p>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">Leitura de Trajetória</h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">Um espaço para contar sua história com suas próprias palavras. Um especialista parceiro receberá seu relato e produzirá uma devolutiva individual, com foco em autoconhecimento e preparação para uma conversa profissional.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Info icon={<Sparkles className="h-5 w-5" />} title="Sua história" text="Você não precisa encontrar as palavras certas. Conte do seu jeito." />
            <Info icon={<Clock3 className="h-5 w-5" />} title="Leitura humana" text="Seu relato entra em uma fila para análise individual." />
            <Info icon={<Mail className="h-5 w-5" />} title="Prazo" text="A devolutiva será disponibilizada em até 3 dias após o envio." />
          </div>
        </section>

        {submitted ? (
          <section className="mt-6 rounded-[2rem] border border-primary/15 bg-card p-7 shadow-soft">
            <div className="flex gap-3">
              <Clock3 className="h-6 w-6 shrink-0 text-primary" />
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink">História enviada</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Seu relato está na fila para leitura. A devolutiva será disponibilizada em até 3 dias após o envio.</p>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-6 rounded-[2rem] border border-border bg-card p-7 shadow-soft sm:p-9">
            <div className="flex gap-3 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm leading-6 text-muted-foreground">
              <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
              <p><strong className="text-ink">Importante:</strong> este serviço não é consulta, diagnóstico ou laudo. Ele organiza e contextualiza sua narrativa para apoiar autoconhecimento e preparação para uma futura conversa com profissional habilitado.</p>
            </div>

            <label className="mt-7 block text-sm font-semibold text-ink">E-mail para a devolutiva</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 outline-none focus:border-primary" />

            <label className="mt-6 block text-sm font-semibold text-ink">Conte sua história *</label>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Você pode escrever sobre infância, escola, adolescência, relacionamentos, trabalho, comunicação, rotina, sensibilidade, adaptações e o que motivou sua busca. Não precisa seguir uma ordem.</p>
            <textarea value={story} onChange={(e) => setStory(e.target.value)} rows={12} className="mt-2 w-full resize-y rounded-2xl border border-border bg-background p-4 text-sm leading-6 outline-none focus:border-primary" placeholder="Escreva livremente..." />

            <label className="mt-6 block text-sm font-semibold text-ink">O que você lembra dos primeiros anos? <span className="font-normal text-muted-foreground">(opcional)</span></label>
            <textarea value={developmentNotes} onChange={(e) => setDevelopmentNotes(e.target.value)} rows={6} className="mt-2 w-full resize-y rounded-2xl border border-border bg-background p-4 text-sm leading-6 outline-none focus:border-primary" placeholder="Brincadeiras, comunicação, sensibilidade, mudanças, escola, interesses, relações..." />

            <label className="mt-6 block text-sm font-semibold text-ink">Como isso aparece hoje? <span className="font-normal text-muted-foreground">(opcional)</span></label>
            <textarea value={currentContext} onChange={(e) => setCurrentContext(e.target.value)} rows={6} className="mt-2 w-full resize-y rounded-2xl border border-border bg-background p-4 text-sm leading-6 outline-none focus:border-primary" placeholder="Trabalho, estudos, relações, rotina, energia social, sobrecarga, estratégias..." />

            {message && <div className="mt-5 rounded-2xl border border-border bg-secondary/50 p-4 text-sm text-ink">{message}</div>}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" disabled={saving} onClick={() => void saveDraft()} className="rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-ink disabled:opacity-50">Salvar rascunho</button>
              <button type="button" disabled={saving} onClick={() => void submit()} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-50">{saving ? "Enviando..." : "Enviar minha história"} <CheckCircle2 className="h-4 w-4" /></button>
            </div>

            <p className="mt-5 text-xs leading-5 text-muted-foreground">Ao enviar, você autoriza o tratamento e o compartilhamento das informações necessárias com o especialista parceiro responsável pela devolutiva, conforme a Política de Privacidade do NeuroSpectro.</p>
          </section>
        )}
      </div>
    </main>
  );
}

function Info({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border border-border bg-background p-4"><span className="text-primary">{icon}</span><h3 className="mt-3 text-sm font-semibold text-ink">{title}</h3><p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p></div>;
}
