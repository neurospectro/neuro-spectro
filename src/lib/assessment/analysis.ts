import type { Dimension, DimensionId, Question } from "@/lib/assessment/questions";

export type DimensionAnalysis = {
  id: DimensionId;
  label: string;
  percentage: number;
  level: "baixo" | "moderado" | "elevado";
  summary: string;
  signals: string[];
  interpretation: string;
  practicalSupports: string[];
};

export type AssessmentAnalysis = {
  version: "2.0.0";
  generatedAt: string;
  disclaimer: string;
  overview: string;
  clinicalContext: string;
  highlights: string[];
  dimensions: DimensionAnalysis[];
  patterns: string[];
  explore: string[];
  practicalSupports: string[];
  professionalQuestions: string[];
  limitations: string[];
};

function levelFor(percentage: number): DimensionAnalysis["level"] {
  if (percentage >= 67) return "elevado";
  if (percentage >= 34) return "moderado";
  return "baixo";
}

function dimensionSummary(dimension: Dimension, level: DimensionAnalysis["level"]) {
  const base: Record<DimensionAnalysis["level"], string> = {
    baixo: "Há menor intensidade relativa dos comportamentos e experiências investigados nesta dimensão dentro desta autoavaliação.",
    moderado: "Há intensidade intermediária dos comportamentos e experiências investigados nesta dimensão, que pode variar bastante conforme contexto, ambiente e demanda.",
    elevado: "Há maior intensidade relativa dos comportamentos e experiências investigados nesta dimensão. Isso indica um tema relevante para exploração, mas não estabelece uma condição clínica.",
  };
  return `${base[level]} A interpretação deve considerar frequência, esforço envolvido, sofrimento e impacto funcional, aspectos que este questionário não mede de forma clínica.`;
}

function interpretationFor(dimension: Dimension, level: DimensionAnalysis["level"]) {
  const map: Record<DimensionId, string> = {
    cognicao: "A literatura sobre autismo descreve diferenças individuais em atenção a detalhes, sistematização e processamento de padrões. Esses traços também podem ocorrer fora do autismo e, isoladamente, não têm valor diagnóstico.",
    atencao: "A atenção a detalhes e a dificuldade de alternar o foco podem aparecer em diferentes perfis neurocognitivos. Para uma interpretação clínica, é importante diferenciar preferência, habilidade e dificuldade funcional.",
    comunicacao: "Diferenças na comunicação social incluem aspectos da reciprocidade, linguagem pragmática, leitura de pistas sociais e interpretação literal. Uma avaliação clínica deve observar esses aspectos em contexto e ao longo do desenvolvimento.",
    sensibilidade: "Hiper ou hiporreatividade sensorial é relevante na caracterização contemporânea do autismo. A experiência sensorial também pode aparecer em ansiedade, enxaqueca, TDAH e outras condições, portanto o contexto é essencial.",
    rotina: "Necessidade de previsibilidade, dificuldade com mudanças e padrões repetitivos fazem parte do conjunto de características consideradas na avaliação do autismo. A intensidade e o impacto funcional são mais informativos que uma preferência isolada.",
    concentracao: "Interesses intensos, atenção sustentada e aprofundamento em temas específicos podem ser experiências positivas ou desgastantes. Interesses intensos não são exclusivos do autismo e devem ser interpretados junto a outros domínios.",
    personalidade: "Camuflagem social, compensação e ensaio de comportamentos são descritos em adultos autistas, mas também podem ocorrer por ansiedade social, experiências de rejeição ou outras razões. Este domínio deve ser tratado como pista contextual, não como marcador diagnóstico.",
    cotidiano: "Energia social, sobrecarga e esforço para tarefas podem revelar impacto funcional. Para uma avaliação clínica, é importante verificar em quais ambientes isso ocorre, desde quando e quanto interfere em trabalho, estudo, relações, autonomia e bem-estar.",
  };
  return `${map[dimension.id]} ${level === "elevado" ? "Como esta dimensão aparece com maior intensidade relativa, vale documentar exemplos concretos do cotidiano para levar à consulta." : ""}`.trim();
}

function supportsFor(id: DimensionId): string[] {
  const map: Record<DimensionId, string[]> = {
    cognicao: ["Transformar orientações vagas em instruções objetivas.", "Usar listas ou estruturas visuais quando isso facilitar a organização."],
    atencao: ["Reduzir distrações quando uma tarefa exigir precisão.", "Evitar alternância desnecessária entre tarefas de alta demanda."],
    comunicacao: ["Pedir comunicação direta quando houver ambiguidade.", "Combinar por escrito informações importantes após conversas complexas."],
    sensibilidade: ["Identificar estímulos que aumentam a sobrecarga e planejar pausas.", "Quando possível, ajustar luz, ruído, textura ou ambiente de acordo com suas necessidades."],
    rotina: ["Antecipar mudanças importantes sempre que possível.", "Criar planos alternativos simples para transições e imprevistos."],
    concentracao: ["Reservar blocos de tempo para tarefas que exigem imersão.", "Usar lembretes ou limites externos para tarefas que podem ser esquecidas durante períodos de foco intenso."],
    personalidade: ["Observar o custo energético de manter determinados comportamentos sociais.", "Experimentar formas de comunicação mais autênticas em ambientes seguros, sem exigir exposição desconfortável."],
    cotidiano: ["Planejar recuperação após períodos de alta demanda social ou sensorial.", "Dividir tarefas burocráticas ou complexas em etapas pequenas e previsíveis."],
  };
  return map[id];
}

function buildSignals(questions: Question[], answers: Record<string, number>): string[] {
  return questions
    .filter((q) => answers[q.question_id] !== undefined)
    .map((q) => {
      const raw = answers[q.question_id] ?? 0;
      const value = q.reverse_scored ? 3 - raw : raw;
      return value >= 2 ? q.construct : null;
    })
    .filter((value): value is string => Boolean(value))
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
    const signals = buildSignals(qs, args.answers);
    return {
      id: score.dimension.id,
      label: score.dimension.label,
      percentage,
      level,
      summary: dimensionSummary(score.dimension, level),
      signals,
      interpretation: interpretationFor(score.dimension, level),
      practicalSupports: supportsFor(score.dimension.id),
    };
  });

  const ranked = dimensions.slice().sort((a, b) => b.percentage - a.percentage);
  const highlights = ranked.slice(0, 3).map((d) =>
    d.signals.length
      ? `${d.label}: maior intensidade relativa, com destaque para ${d.signals.join(", ")}.`
      : `${d.label}: maior intensidade relativa entre as dimensões avaliadas.`,
  );

  const patterns = [
    "O resultado mostra um perfil de características relativas, não uma classificação de pessoa em um espectro.",
    "Características semelhantes podem surgir por razões diferentes. Contexto, desenvolvimento, saúde mental, ambiente e estratégias de adaptação precisam ser considerados.",
    ...(ranked.filter((d) => d.level === "elevado").length
      ? ["As dimensões com maior intensidade merecem ser exploradas com exemplos concretos: o que acontece, em qual contexto, com que frequência e com qual impacto."]
      : ["As respostas não formam uma concentração elevada em uma única dimensão; isso não exclui nem confirma qualquer condição e deve ser interpretado em conjunto com a história pessoal."]),
  ];

  const explore = ranked.slice(0, 4).map((d) =>
    d.signals.length
      ? `Explore ${d.label.toLowerCase()}: observe quando ${d.signals.join(", ")} aparecem, o esforço necessário para lidar com isso e o que ajuda ou piora.`
      : `Explore ${d.label.toLowerCase()}: registre situações em que essa dimensão muda de intensidade conforme o contexto.`,
  );

  const practicalSupports = Array.from(new Set(ranked.slice(0, 4).flatMap((d) => d.practicalSupports))).slice(0, 8);

  return {
    version: "2.0.0",
    generatedAt: new Date().toISOString(),
    disclaimer: "Esta análise é informativa e baseada nas respostas desta autoavaliação. Ela não é diagnóstico, não possui ponto de corte clínico e não substitui avaliação realizada por psicólogo, psiquiatra, neurologista ou outro profissional habilitado.",
    overview: "O relatório organiza padrões de resposta em dimensões relacionadas a comunicação social, processamento de informação, atenção, sensibilidade, previsibilidade, interesses, camuflagem e funcionamento cotidiano. A intensidade relativa serve para orientar reflexão e preparação para uma eventual avaliação profissional.",
    clinicalContext: "Na literatura clínica, a avaliação de autismo em adultos não se baseia em um único questionário. Ela integra história do desenvolvimento, características atuais em mais de um contexto, observação clínica, relatos de outras pessoas quando disponíveis, funcionamento e investigação de condições coexistentes ou alternativas. Instrumentos de rastreio ajudam a orientar a avaliação, mas não confirmam nem excluem diagnóstico isoladamente.",
    highlights,
    dimensions,
    patterns,
    explore,
    practicalSupports,
    professionalQuestions: [
      "Quais características do meu perfil aparecem desde a infância ou adolescência e continuam na vida adulta?",
      "Em quais contextos essas características geram esforço, sofrimento ou prejuízo funcional?",
      "Como diferenciar essas experiências de ansiedade, TDAH, TOC, depressão, estresse, trauma ou outras condições que podem produzir manifestações semelhantes?",
      "Há sinais de camuflagem ou compensação social? Qual é o custo energético dessas estratégias?",
      "Quais informações de familiares, parceiros, escola ou trabalho poderiam ajudar a reconstruir meu desenvolvimento?",
      "Seria indicada uma avaliação clínica especializada? Quais instrumentos ou etapas seriam apropriados para o meu caso?",
    ],
    limitations: [
      "O questionário NeuroSpectro é autoral e está em revisão; não possui validação psicométrica, normas populacionais ou ponto de corte clínico.",
      "As 48 perguntas não coletam de forma suficiente a história do desenvolvimento infantil, prejuízo funcional detalhado, informantes, comorbidades e diagnóstico diferencial.",
      "Por isso, o relatório não deve converter percentuais em probabilidade de autismo nem em diagnóstico.",
      "Os itens foram inspirados conceitualmente em literatura e instrumentos como AQ, AQ-10, RAADS-R, CAT-Q e AAA, mas o NeuroSpectro não é uma versão desses instrumentos nem deve ser interpretado com os pontos de corte deles.",
    ],
  };
}
