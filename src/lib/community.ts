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
  inviteUrl: "https://chat.whatsapp.com/HOQHLS3XgpbLaStkLlU1yC",
  title: "Comunidade NeuroSpectro",
  description:
    "Um espaço de troca de experiências, informação e apoio para continuar sua jornada de autoconhecimento.",
};

export function getCommunityCtaLabel() {
  return COMMUNITY.platform === "telegram"
    ? "Entrar na comunidade no Telegram"
    : "Entrar na comunidade no WhatsApp";
}
