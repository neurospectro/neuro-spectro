export type CommunityPlatform = "whatsapp" | "telegram";

export interface CommunityConfig {
  enabled: boolean;
  platform: CommunityPlatform;
  inviteUrl: string;
  title: string;
  description: string;
}

export const COMMUNITY: CommunityConfig = {
  enabled: true,
  platform: "whatsapp",
  // Configure the real invite link before launch. Never publish a private admin link.
  inviteUrl: "",
  title: "Comunidade NeuroSpectro",
  description:
    "Um espaço de troca de experiências, informação e apoio para continuar sua jornada de autoconhecimento.",
};

export function getCommunityCtaLabel() {
  return COMMUNITY.platform === "telegram"
    ? "Entrar na comunidade no Telegram"
    : "Entrar na comunidade no WhatsApp";
}
