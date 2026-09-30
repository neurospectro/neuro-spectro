export type CommunityPlatform = "whatsapp" | "telegram";

export interface CommunityConfig {
  enabled: boolean;
  platform: CommunityPlatform;
  title: string;
  description: string;
  accessMode: "post_purchase";
}

export const COMMUNITY: CommunityConfig = {
  enabled: true,
  platform: "whatsapp",
  title: "Círculo NeuroSpectro",
  description:
    "Um espaço acolhedor de troca de experiências, informação e apoio para pessoas neurodivergentes, neurotípicas e pessoas interessadas em compreender melhor a neurodiversidade.",
  accessMode: "post_purchase",
};

export const COMMUNITY_CONTENT = [
  "Conteúdos exclusivos sobre neurodiversidade e autoconhecimento",
  "Conversas e trocas de experiências com respeito às diferentes perspectivas",
  "Materiais educativos em linguagem acessível",
  "Temas para ajudar a transformar descobertas em conversas mais conscientes",
];

export function getCommunityCtaLabel() {
  return "Adicionar à minha experiência";
}
