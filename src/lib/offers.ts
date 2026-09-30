export type OfferBilling = "one_time_installments" | "recurring";

export interface Offer {
  id: string;
  name: string;
  product: "report" | "community";
  billing: OfferBilling;
  totalCents: number;
  installmentCount: number;
  installmentCents: number;
  accessDays: number | null;
  autoRenew: boolean;
  lifetimeAccess?: boolean;
  description: string;
  referenceCents?: number;
  promotionalWindowMinutes?: number;
}

export const OFFERS: Record<string, Offer> = {
  "report-full-2490": {
    id: "report-full-2490",
    name: "Relatório Completo NeuroSpectro",
    product: "report",
    billing: "one_time_installments",
    totalCents: 2490,
    installmentCount: 1,
    installmentCents: 2490,
    accessDays: null,
    autoRenew: false,
    lifetimeAccess: true,
    description: "De R$ 69,90 por R$ 24,90 · pagamento único · acesso ao relatório completo.",
    referenceCents: 6990,
    promotionalWindowMinutes: 15,
  },
  "community-12m-6x": {
    id: "community-12m-6x",
    name: "Comunidade de Apoio - NeuroSpectro · acesso por tempo indeterminado",
    product: "community",
    billing: "one_time_installments",
    totalCents: 8940,
    installmentCount: 6,
    installmentCents: 1490,
    accessDays: null,
    autoRenew: false,
    lifetimeAccess: true,
    description: "6x de R$ 14,90 · total de R$ 89,40 · acesso por tempo indeterminado, sem renovação automática.",
  },
  "community-monthly": {
    id: "community-monthly",
    name: "Comunidade de Apoio - NeuroSpectro · mensal",
    product: "community",
    billing: "recurring",
    totalCents: 1490,
    installmentCount: 1,
    installmentCents: 1490,
    accessDays: 30,
    autoRenew: true,
    description: "Acesso mensal com renovação automática.",
  },
};

export const getOffer = (id: string) => OFFERS[id];

export const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
