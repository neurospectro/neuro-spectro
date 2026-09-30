// NeuroSpectro — questionário principal (v1.0.0).
// Perguntas ORIGINAIS, escritas para este produto, inspiradas nos construtos
// explorados por instrumentos de referência (AQ-50, AQ-10, RAADS-R, CAT-Q, AAA).
// Nenhum item foi copiado ou traduzido desses instrumentos.
// Nenhum dado de validação psicométrica existe ainda para este questionário.

export type ReviewStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "ARCHIVED";

export type DimensionId =
  | "cognicao" | "atencao" | "comunicacao" | "sensibilidade"
  | "rotina" | "concentracao" | "personalidade" | "cotidiano";

export interface Dimension { id: DimensionId; label: string; description: string }

export interface Question {
  question_id: string;
  assessment_id: string;
  assessment_version: string;
  construct: string;
  dimension: DimensionId;
  text: string;
  source_reference: string;
  source_instrument: string[];
  scientific_rationale: string;
  scoring_rule: string;
  reverse_scored: boolean;
  reading_level: string;
  age_target: string;
  order_index: number;
  copyright_status: string;
  review_status: ReviewStatus;
}

export interface Assessment {
  assessment_id: string;
  slug: string;
  name: string;
  description: string;
  target_population: string;
  purpose: string;
  version: string;
  status: ReviewStatus;
  scientific_references: string[];
  methodological_notes: string;
  copyright_notes: string;
  review_date: string | null;
}

export const SCALE = [
  { value: 0, label: "Nunca" },
  { value: 1, label: "Às vezes" },
  { value: 2, label: "Com frequência" },
  { value: 3, label: "Quase sempre" },
] as const;

export const ASSESSMENT: Assessment = {
  assessment_id: "ns-adult-traits",
  slug: "rastreio-adulto",
  name: "Rastreio inicial de características associadas ao espectro autista em adultos",
  description: "Autoavaliação informativa com 48 afirmações distribuídas em 8 dimensões.",
  target_population: "Adultos (18+)",
  purpose: "Autoconhecimento e ponto de partida para conversa com profissional qualificado. Não é diagnóstico.",
  version: "1.0.0",
  status: "IN_REVIEW",
  scientific_references: [
    "Baron-Cohen et al. (2001) — Autism-Spectrum Quotient (AQ-50)",
    "Allison, Auyeung & Baron-Cohen (2012) — AQ-10",
    "Ritvo et al. (2011) — RAADS-R",
    "Hull et al. (2019) — CAT-Q",
    "Adult Asperger Assessment (AAA) — Baron-Cohen et al. (2005)",
  ],
  methodological_notes:
    "Itens originais. Pontuação 0–3 por item; itens invertidos pontuam 3–0. Ainda não há estudo de validação, pontos de corte ou normas para este questionário.",
  copyright_notes: "Texto dos itens de autoria própria. Instrumentos de referência citados apenas como base conceitual.",
  review_date: null,
};

export const DIMENSIONS: Dimension[] = [
  { id: "cognicao", label: "Cognição", description: "Estilo de pensamento, padrões e detalhes." },
  { id: "atencao", label: "Atenção", description: "Foco em detalhes e percepção de mudanças." },
  { id: "comunicacao", label: "Comunicação", description: "Conversa, linguagem literal e sinais sociais." },
  { id: "sensibilidade", label: "Sensibilidade", description: "Respostas a sons, luzes, texturas e cheiros." },
  { id: "rotina", label: "Rotina", description: "Previsibilidade, planejamento e mudanças." },
  { id: "concentracao", label: "Concentração", description: "Interesses intensos e hiperfoco." },
  { id: "personalidade", label: "Personalidade", description: "Camuflagem social e autopercepção." },
  { id: "cotidiano", label: "Funcionamento cotidiano", description: "Energia social, tarefas e recuperação." },
];

type Seed = { d: DimensionId; c: string; t: string; src: string[]; r?: boolean };

// 6 itens por dimensão = 48 itens.
const SEEDS: Seed[] = [
  // Cognição
  { d: "cognicao", c: "Sistematização", t: "Gosto de entender como as coisas funcionam por dentro, peça por peça.", src: ["AQ-50"] },
  { d: "cognicao", c: "Pensamento em padrões", t: "Percebo padrões em números, datas ou sequências que outras pessoas não notam.", src: ["AQ-50"] },
  { d: "cognicao", c: "Pensamento literal", t: "Prefiro instruções exatas a orientações vagas ou implícitas.", src: ["RAADS-R"] },
  { d: "cognicao", c: "Imaginação social", t: "Tenho facilidade em imaginar o que personagens de uma história estão sentindo.", src: ["AQ-50"], r: true },
  { d: "cognicao", c: "Categorização", t: "Sinto vontade de organizar informações em listas, tabelas ou categorias.", src: ["AQ-50"] },
  { d: "cognicao", c: "Processamento lógico", t: "Tomo decisões com base em lógica, mesmo quando outras pessoas esperam uma resposta emocional.", src: ["AAA"] },
  // Atenção
  { d: "atencao", c: "Atenção a detalhes", t: "Noto pequenos detalhes em ambientes ou objetos que passam despercebidos por outros.", src: ["AQ-50", "AQ-10"] },
  { d: "atencao", c: "Percepção de mudanças", t: "Percebo rapidamente quando algo foi mudado de lugar.", src: ["AQ-50"] },
  { d: "atencao", c: "Visão do todo", t: "Consigo ver o quadro geral de uma situação com facilidade.", src: ["AQ-50", "AQ-10"], r: true },
  { d: "atencao", c: "Detalhe sonoro", t: "Presto atenção em sons de fundo que outras pessoas parecem ignorar.", src: ["AQ-50"] },
  { d: "atencao", c: "Precisão", t: "Pequenos erros, como um erro de digitação, chamam minha atenção imediatamente.", src: ["AQ-50"] },
  { d: "atencao", c: "Atenção dividida", t: "Acho difícil acompanhar várias conversas ao mesmo tempo em um grupo.", src: ["AQ-50"] },
  // Comunicação
  { d: "comunicacao", c: "Leitura de intenções", t: "Tenho dificuldade em perceber quando alguém está sendo irônico.", src: ["RAADS-R", "AQ-50"] },
  { d: "comunicacao", c: "Conversa casual", t: "Conversas informais, sem um assunto definido, me parecem cansativas.", src: ["AQ-50", "RAADS-R"] },
  { d: "comunicacao", c: "Reciprocidade", t: "Percebo com facilidade quando a pessoa com quem falo está entediada.", src: ["AQ-50", "AQ-10"], r: true },
  { d: "comunicacao", c: "Linguagem não verbal", t: "Fico em dúvida sobre quanto tempo devo manter contato visual.", src: ["RAADS-R"] },
  { d: "comunicacao", c: "Turnos de fala", t: "Tenho dificuldade em saber quando é a minha vez de falar.", src: ["AQ-50", "RAADS-R"] },
  { d: "comunicacao", c: "Linguagem literal", t: "Levo expressões e frases feitas ao pé da letra antes de entender o sentido.", src: ["RAADS-R"] },
  // Sensibilidade
  { d: "sensibilidade", c: "Sensibilidade auditiva", t: "Sons altos ou repentinos me incomodam mais do que parecem incomodar outras pessoas.", src: ["RAADS-R"] },
  { d: "sensibilidade", c: "Sensibilidade tátil", t: "Certas texturas de roupa ou etiquetas me incomodam a ponto de eu evitá-las.", src: ["RAADS-R"] },
  { d: "sensibilidade", c: "Sensibilidade visual", t: "Luzes fortes ou piscando me deixam desconfortável.", src: ["RAADS-R"] },
  { d: "sensibilidade", c: "Sensibilidade olfativa", t: "Percebo cheiros com mais intensidade do que as pessoas ao meu redor.", src: ["RAADS-R"] },
  { d: "sensibilidade", c: "Sobrecarga sensorial", t: "Em lugares cheios e barulhentos, sinto necessidade de sair para me recompor.", src: ["RAADS-R"] },
  { d: "sensibilidade", c: "Tolerância sensorial", t: "Consigo me concentrar normalmente em ambientes com muito estímulo.", src: ["RAADS-R"], r: true },
  // Rotina
  { d: "rotina", c: "Previsibilidade", t: "Prefiro fazer as coisas sempre da mesma maneira.", src: ["AQ-50", "RAADS-R"] },
  { d: "rotina", c: "Resistência a mudanças", t: "Mudanças de planos de última hora me deixam desconfortável.", src: ["AQ-50", "RAADS-R"] },
  { d: "rotina", c: "Planejamento", t: "Gosto de saber com antecedência o que vai acontecer no meu dia.", src: ["AAA"] },
  { d: "rotina", c: "Flexibilidade", t: "Me adapto com facilidade quando minha rotina é interrompida.", src: ["AQ-50"], r: true },
  { d: "rotina", c: "Rituais", t: "Tenho sequências fixas para tarefas do dia a dia e me incomodo se forem quebradas.", src: ["RAADS-R"] },
  { d: "rotina", c: "Transições", t: "Trocar de uma atividade para outra exige um esforço extra de mim.", src: ["AQ-50"] },
  // Concentração
  { d: "concentracao", c: "Interesses intensos", t: "Tenho interesses sobre os quais quero aprender tudo o que for possível.", src: ["AQ-50", "RAADS-R"] },
  { d: "concentracao", c: "Hiperfoco", t: "Quando estou envolvido(a) em algo, perco a noção do tempo.", src: ["AQ-50"] },
  { d: "concentracao", c: "Retorno ao foco", t: "Depois de ser interrompido(a), volto ao que estava fazendo com facilidade.", src: ["AQ-50"], r: true },
  { d: "concentracao", c: "Colecionismo de informação", t: "Guardo informações detalhadas sobre temas específicos, como datas, nomes ou dados técnicos.", src: ["AQ-50"] },
  { d: "concentracao", c: "Tema recorrente", t: "Costumo levar as conversas para os assuntos que mais me interessam.", src: ["RAADS-R"] },
  { d: "concentracao", c: "Imersão", t: "Prefiro me aprofundar em um único assunto a conhecer um pouco de muitos.", src: ["AQ-50"] },
  // Personalidade (camuflagem/autopercepção)
  { d: "personalidade", c: "Camuflagem — compensação", t: "Observo como outras pessoas agem para saber como devo me comportar.", src: ["CAT-Q"] },
  { d: "personalidade", c: "Camuflagem — mascaramento", t: "Sinto que preciso atuar um papel para ser aceito(a) socialmente.", src: ["CAT-Q"] },
  { d: "personalidade", c: "Camuflagem — ensaio", t: "Ensaio mentalmente o que vou dizer antes de uma conversa.", src: ["CAT-Q"] },
  { d: "personalidade", c: "Autenticidade social", t: "Consigo ser eu mesmo(a) na maioria das situações sociais.", src: ["CAT-Q"], r: true },
  { d: "personalidade", c: "Sensação de diferença", t: "Sinto que funciono de um jeito diferente da maioria das pessoas.", src: ["RAADS-R", "AAA"] },
  { d: "personalidade", c: "Camuflagem — assimilação", t: "Uso frases ou gestos que aprendi com outras pessoas para parecer mais natural.", src: ["CAT-Q"] },
  // Funcionamento cotidiano
  { d: "cotidiano", c: "Energia social", t: "Depois de encontros sociais, preciso de tempo sozinho(a) para recuperar a energia.", src: ["CAT-Q", "RAADS-R"] },
  { d: "cotidiano", c: "Amizades", t: "Fazer e manter amizades exige de mim um esforço consciente.", src: ["RAADS-R", "AAA"] },
  { d: "cotidiano", c: "Situações novas", t: "Situações sociais novas me deixam mais ansioso(a) do que o esperado.", src: ["AQ-50"] },
  { d: "cotidiano", c: "Organização de tarefas", t: "Ligações telefônicas ou tarefas burocráticas simples me parecem desgastantes.", src: ["AAA"] },
  { d: "cotidiano", c: "Adaptação social", t: "Me sinto à vontade em festas e eventos com muitas pessoas.", src: ["AQ-50"], r: true },
  { d: "cotidiano", c: "Esgotamento", t: "Sinto um cansaço intenso depois de dias com muita interação ou estímulo.", src: ["CAT-Q"] },
];

export const QUESTIONS: Question[] = SEEDS.map((s, i) => ({
  question_id: `ns-q${String(i + 1).padStart(2, "0")}`,
  assessment_id: ASSESSMENT.assessment_id,
  assessment_version: ASSESSMENT.version,
  construct: s.c,
  dimension: s.d,
  text: s.t,
  source_reference: `Construto "${s.c}" explorado em ${s.src.join(", ")}`,
  source_instrument: s.src,
  scientific_rationale: `Item original que observa ${s.c.toLowerCase()} como aspecto da dimensão ${DIMENSIONS.find((d) => d.id === s.d)!.label}.`,
  scoring_rule: s.r ? "Invertido: Nunca=3, Às vezes=2, Com frequência=1, Quase sempre=0" : "Direto: Nunca=0, Às vezes=1, Com frequência=2, Quase sempre=3",
  reverse_scored: !!s.r,
  reading_level: "Linguagem simples, adulto",
  age_target: "18+",
  order_index: i + 1,
  copyright_status: "ORIGINAL",
  review_status: "IN_REVIEW",
}));

// Pré-lançamento: itens IN_REVIEW são exibidos. Antes de publicar, deixar apenas "APPROVED".
export const VISIBLE_STATUSES: ReviewStatus[] = ["APPROVED", "IN_REVIEW"];

/** Ordem de exibição: intercalada entre dimensões, para não agrupar temas. */
export function getVisibleQuestions(): Question[] {
  const visible = QUESTIONS.filter((q) => VISIBLE_STATUSES.includes(q.review_status));
  const byDim = DIMENSIONS.map((d) => visible.filter((q) => q.dimension === d.id));
  const out: Question[] = [];
  const max = Math.max(...byDim.map((l) => l.length));
  for (let r = 0; r < max; r++) for (const l of byDim) if (l[r]) out.push(l[r]);
  return out;
}

export function scoreItem(q: Question, value: number) {
  return q.reverse_scored ? 3 - value : value;
}

/** Pontuação bruta por dimensão (0–18). Sem pontos de corte: não há validação. */
export function scoreByDimension(answers: Record<string, number>) {
  return DIMENSIONS.map((d) => {
    const qs = QUESTIONS.filter((q) => q.dimension === d.id);
    const answered = qs.filter((q) => answers[q.question_id] !== undefined);
    const raw = answered.reduce((s, q) => s + scoreItem(q, answers[q.question_id]), 0);
    return { dimension: d, raw, max: qs.length * 3, answered: answered.length, total: qs.length };
  });
}
