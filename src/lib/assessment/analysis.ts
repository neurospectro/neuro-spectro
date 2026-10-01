import type { Dimension, DimensionId, Question } from "@/lib/assessment/questions";

export type DimensionAnalysis = {
  id: DimensionId;
  label: string;
  percentage: number;
  level: "baixo" | "moderado" | "elevado";
  summary: string;
  signals: string[];
};

export type AssessmentAnalysis = {
  version: "1.0.0";
  generatedAt: string;
  disclaimer: string;
  overview: string;
  highlights: string[];
  dimensions: DimensionAnalysis[];
  explore: string[];
  professionalQuestions: string[];
};

function levelFor(percentage: number): DimensionAnalysis["level"] {
  if (percentage >= 67) return "elevado";
  if (percentage >= 34) return "moderado";
  return "baixo";
}

function dimensionSummary(d: Dimension, level: DimensionAnalysis["level"]) {
  const summaries: Record<DimensionAnalysis["level"], string> = {
    baixo: "As respostas indicam menor intensidade relativa de características observadas nesta dimensão dentro desta autoavaliação.",
    moderado: "As respostas indicam uma presença intermediária de características observadas nesta dimensão, com variação possível conforme o contexto.",
    elevado: "As respostas indicam maior intensidade relativa de características observadas nesta dimensão nesta autoavaliação.",
  };
  return summaries[level];
}

function buildSignals(
  dimension: Dimension,
  questions: Question[],
  answers: Record<string, number>,
): string[] {
  return questions
    .filter((q) => answers[q.question_id] !== undefined)
    .map((q) => {
      const value = q.reverse_scored ? 3 - answers[q.question_id] : answers[q.question_id];
      if (value >= 2) return q.construct;
      return null;
    })
    .filter((v): v is string => Boolean(v))
    .slice(0, 3);
}

export function generateAssessmentAnalysis(args: {
  answers: Record<string, number>;
  questions: Question[];
  scores: Array<{
    dimension: Dimension;
    raw: number;
    max: number;
    answered: number;
    total: number;
  }>;
}): AssessmentAnalysis {
  const dimensions = args.scores.map((score) => {
    const percentage = score.max ? Math.round((score.raw / score.max) * 100) : 0;
    const level = levelFor(percentage);
    const qs = args.questions.filter((q) => q.dimension === score.dimension.id);
    const signals = buildSignals(score.dimension, qs, args.answers);

    return {
      id: score.dimension.id,
      label: score.dimension.label,
      percentage,
      level,
      summary: dimensionSummary(score.dimension, level),
      signals,
    };
  });

  const ranked = dimensions.slice().sort((a, b) => b.percentage - a.percentage);
  const highlights = ranked
    .filter((d) => d.level === "elevado")
    .slice(0, 3)
    .map((d) =>
      d.signals.length
        ? `${d.label}: maior intensidade relativa, especialmente em ${d.signals.join(", ")}.`
        : `${d.label}: maior intensidade relativa nesta autoavaliação.`,
    );

  if (!highlights.length) {
    highlights.push(
      "Não houve uma concentração elevada em uma única dimensão. O perfil apresenta variação entre as áreas avaliadas.",
    );
  }

  const explore = ranked.slice(0, 4).map((d) =>
    d.signals.length
      ? `Observe, em diferentes contextos, como ${d.signals.join(", ")} aparecem no seu cotidiano e quanto esforço ou desconforto estão associados a essas experiências.`
      : `Observe como aspectos de ${d.label.toLowerCase()} aparecem no seu cotidiano e variam conforme o contexto.`,
  );

  return {
    version: "1.0.0",
    generatedAt: new Date().toISOString(),
    disclaimer:
      "Esta análise é informativa e foi gerada a partir das respostas desta autoavaliação. Ela não é diagnóstico, não possui ponto de corte clínico e não substitui avaliação profissional.",
    overview:
      "O perfil abaixo organiza a intensidade relativa das características observadas nas respostas. Uma dimensão elevada não significa, isoladamente, a presença de uma condição clínica; contexto, história de vida e outros fatores também importam.",
    highlights,
    dimensions,
    explore,
    professionalQuestions: [
      "Quais aspectos deste perfil correspondem à minha experiência em diferentes contextos?",
      "Desde quando essas características estão presentes e quanto impacto elas têm no meu cotidiano?",
      "Existem outros fatores, ambientais ou emocionais, que podem contribuir para essas experiências?",
      "Seria útil discutir este resultado com um profissional qualificado?",
    ],
  };
}
