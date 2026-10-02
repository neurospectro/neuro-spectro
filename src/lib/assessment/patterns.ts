import type { DimensionAnalysis } from "@/lib/assessment/analysis";

export type AnalysisPattern = {
  id: string;
  title: string;
  description: string;
  dimensions: string[];
  evidence: string[];
  explorationQuestions: string[];
};

type Rule = {
  id: string;
  title: string;
  description: string;
  dimensions: [string, string];
  min: number;
  explorationQuestions: string[];
};

const RULES: Rule[] = [
  {
    id: "sensibilidade-previsibilidade",
    title: "Sensibilidade e previsibilidade",
    description: "Suas respostas mostram intensidade relativamente alta tanto em Sensibilidade quanto em Rotina. Pode ser útil observar como mudanças, estímulos e imprevistos se combinam no seu cotidiano.",
    dimensions: ["sensibilidade", "rotina"], min: 67,
    explorationQuestions: ["Quais mudanças de ambiente ou rotina aumentam sua sobrecarga?", "O que ajuda você a se preparar para mudanças ou estímulos intensos?"],
  },
  {
    id: "atencao-concentracao",
    title: "Atenção aos detalhes e concentração",
    description: "Atenção e Concentração aparecem com intensidade relativamente alta. Vale observar quando a capacidade de aprofundamento ajuda e quando torna mais difícil alternar tarefas ou distribuir a atenção.",
    dimensions: ["atencao", "concentracao"], min: 67,
    explorationQuestions: ["Em quais atividades você entra em períodos de foco prolongado?", "O que acontece quando precisa interromper uma tarefa envolvente?"],
  },
  {
    id: "comunicacao-personalidade",
    title: "Comunicação e adaptação social",
    description: "Comunicação e Personalidade aparecem com intensidade relativamente alta. Pode ser útil observar o esforço envolvido em interpretar situações sociais e adaptar conscientemente sua forma de agir.",
    dimensions: ["comunicacao", "personalidade"], min: 67,
    explorationQuestions: ["Você costuma ensaiar, observar ou copiar comportamentos sociais para se adaptar?", "Como se sente depois de períodos prolongados de interação social?"],
  },
  {
    id: "cotidiano-sensibilidade",
    title: "Sobrecarga e recuperação",
    description: "Sensibilidade e Funcionamento cotidiano aparecem com intensidade relativamente alta. Observe a relação entre estímulos, demanda diária, energia disponível e tempo necessário para recuperação.",
    dimensions: ["sensibilidade", "cotidiano"], min: 67,
    explorationQuestions: ["Quais ambientes costumam consumir mais energia?", "Quanto tempo você normalmente precisa para se recuperar de períodos de alta demanda?"],
  },
  {
    id: "rotina-cotidiano",
    title: "Previsibilidade e organização cotidiana",
    description: "Rotina e Funcionamento cotidiano aparecem com intensidade relativamente alta. Pode ser útil observar como planejamento, mudanças e tarefas do dia a dia afetam sua organização e energia.",
    dimensions: ["rotina", "cotidiano"], min: 67,
    explorationQuestions: ["Que tipos de imprevisto mais desorganizam seu dia?", "Quais estruturas externas tornam tarefas mais fáceis de iniciar ou concluir?"],
  },
  {
    id: "cognicao-atencao",
    title: "Padrões, detalhes e processamento",
    description: "Cognição e Atenção aparecem com intensidade relativamente alta. Suas respostas sugerem que padrões, detalhes e precisão merecem ser observados em diferentes contextos.",
    dimensions: ["cognicao", "atencao"], min: 67,
    explorationQuestions: ["Em quais situações sua atenção a detalhes é especialmente útil?", "Quando a busca por precisão começa a consumir tempo ou energia?"],
  },
];

export function identifyAnalysisPatterns(dimensions: DimensionAnalysis[]): AnalysisPattern[] {
  const byId = new Map(dimensions.map((dimension) => [dimension.id, dimension]));
  return RULES.flatMap((rule) => {
    const first = byId.get(rule.dimensions[0]);
    const second = byId.get(rule.dimensions[1]);
    if (!first || !second || first.percentage < rule.min || second.percentage < rule.min) return [];
    return [{
      id: rule.id,
      title: rule.title,
      description: rule.description,
      dimensions: rule.dimensions,
      evidence: [`${first.label}: ${first.percentage}%`, `${second.label}: ${second.percentage}%`],
      explorationQuestions: rule.explorationQuestions,
    }];
  });
}
