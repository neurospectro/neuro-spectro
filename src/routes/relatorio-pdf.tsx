import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Download, FileText, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/relatorio-pdf")({
  head: () => ({ meta: [{ name: "robots", content: "noindex,nofollow,noarchive" }] }), component: RelatorioPdf });

function RelatorioPdf() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [signedUrl, setSignedUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    void loadExisting();
  }, []);

  async function loadExisting() {
    if (!supabase) {
      setError("O serviço não está configurado.");
      setLoading(false);
      return;
    }
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        setError("Entre na sua conta para acessar o relatório.");
        return;
      }
      const { data: job } = await supabase
        .from("pdf_report_jobs")
        .select("status,storage_path")
        .eq("user_id", session.session.user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (job?.storage_path) {
        const { data } = await supabase.storage.from("private-reports").createSignedUrl(job.storage_path, 3600);
        if (data?.signedUrl) setSignedUrl(data.signedUrl);
      }
    } catch (e) {
      console.error("PDF_LOAD_ERROR", e);
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    if (!supabase) return;
    setGenerating(true);
    setError("");
    try {
      const { data, error: invokeError } = await supabase.functions.invoke("generate-pdf-report", {
        body: {},
      });
      if (invokeError) throw invokeError;
      if (!data?.signedUrl) throw new Error(data?.error ?? "Não foi possível gerar o PDF.");
      setSignedUrl(data.signedUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível gerar o PDF agora.");
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return <main className="flex min-h-screen items-center justify-center bg-background p-6 text-muted-foreground">Verificando seu acesso...</main>;
  }

  return (
    <main className="min-h-screen bg-secondary/40 px-4 py-8 font-sans sm:py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Minha área
        </Link>

        <section className="mt-6 rounded-[2rem] border border-border bg-card p-6 shadow-soft sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.22em] text-primary">Relatório PDF individual</p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Seu relatório aprofundado, sob demanda</h1>
          <p className="mt-4 leading-7 text-muted-foreground">
            O conteúdo é personalizado a partir do seu resultado e revisado pelas regras editoriais do NeuroSpectro. A geração acontece no servidor e o arquivo fica protegido em armazenamento privado.
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-6 text-muted-foreground">
                Este material é informativo e foi elaborado a partir das respostas fornecidas na avaliação NeuroSpectro. Não constitui diagnóstico, laudo, consulta ou avaliação psicológica e não substitui uma avaliação realizada por profissional habilitado.
              </p>
            </div>
          </div>

          {error && <p className="mt-5 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">{error}</p>}

          {signedUrl ? (
            <div className="mt-7">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <CheckCircle2 className="h-5 w-5" /> PDF pronto
              </div>
              <a
                href={signedUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft"
              >
                <Download className="h-4 w-4" /> Abrir / baixar PDF
              </a>
              <button type="button" onClick={() => void generate()} disabled={generating} className="ml-3 text-sm text-muted-foreground underline">
                Gerar novamente
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => void generate()}
              disabled={generating}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft disabled:opacity-60"
            >
              {generating ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando seu PDF...</> : <><FileText className="h-4 w-4" /> Gerar meu PDF</>}
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
