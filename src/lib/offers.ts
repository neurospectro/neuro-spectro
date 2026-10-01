export type OfferBilling = "one_time_installments" | "recurring";

export interface Offer {
  id: string;
  name: string;
  product: "report" | "pdf" | "community";
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
    description: "De R$ 69,90 por R$ 24,90 · pagamento único · acesso por tempo indeterminado.",
    referenceCents: 6990,
    promotionalWindowMinutes: 7,
  },
  "pdf-report-1490": {
    id: "pdf-report-1490",
    name: "Relatório PDF NeuroSpectro",
    product: "pdf",
    billing: "one_time_installments",
    totalCents: 1490,
    installmentCount: 1,
    installmentCents: 1490,
    accessDays: null,
    autoRenew: false,
    lifetimeAccess: true,
    description: "Relatório PDF profissional em papel timbrado · pagamento único · acesso por tempo indeterminado.",
  },
  "community-6x-1490": {
    id: "community-6x-1490",
    name: "Comunidade de Apoio - NeuroSpectro",
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
};

export const getOffer = (id: string) => OFFERS[id];

export const formatBRL = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
