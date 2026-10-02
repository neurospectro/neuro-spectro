import { supabase } from "@/lib/supabase";
import type { Dimension, Question } from "@/lib/assessment/questions";
import { generateAssessmentAnalysis } from "@/lib/assessment/analysis";

export async function persistCompletedAssessment(args: {
  session: { answers: Record<string, number>; startedAt: string; finishedAt?: string };
  assessmentId: string;
  assessmentVersion: string;
  questions: Question[];
  scores: Array<{ dimension: Dimension; raw: number; max: number; answered: number; total: number }>;
}) {
  if (!supabase || !args.session.finishedAt) return null;

  let { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    const anonymous = await supabase.auth.signInAnonymously();
    if (anonymous.error || !anonymous.data.user) {
      throw anonymous.error ?? new Error("Não foi possível iniciar sua sessão.");
    }
    auth = { user: anonymous.data.user };
  }

  const user = auth.user;

  const { data: testSession, error: sessionError } = await supabase
    .from("sessoes_teste")
    .insert({
      user_id: user.id,
      assessment_id: args.assessmentId,
      assessment_version: args.assessmentVersion,
      started_at: args.session.startedAt,
      finished_at: args.session.finishedAt,
      status: "completed",
    })
    .select("id")
    .single();

  if (sessionError || !testSession) {
    throw sessionError ?? new Error("Não foi possível salvar a sessão.");
  }

  const responseRows = args.questions
    .filter((q) => args.session.answers[q.question_id] !== undefined)
    .map((q) => ({
      sessao_id: testSession.id,
      question_id: q.question_id,
      value: args.session.answers[q.question_id],
    }));

  const { error: answersError } = await supabase.from("respostas").insert(responseRows);
  if (answersError) throw answersError;

  const totalRaw = args.scores.reduce((sum, item) => sum + item.raw, 0);
  const maxRaw = args.scores.reduce((sum, item) => sum + item.max, 0);

  const analysis = generateAssessmentAnalysis({
    answers: args.session.answers,
    questions: args.questions,
    scores: args.scores,
  });

  const { error: resultError } = await supabase.from("resultados").insert({
    sessao_id: testSession.id,
    user_id: user.id,
    total_raw: totalRaw,
    max_raw: maxRaw,
    analysis,
    scores: args.scores.map((item) => ({
      id: item.dimension.id,
      label: item.dimension.label,
      raw: item.raw,
      max: item.max,
      answered: item.answered,
      total: item.total,
    })),
  });

  if (resultError) throw resultError;
  return testSession.id as string;
}
