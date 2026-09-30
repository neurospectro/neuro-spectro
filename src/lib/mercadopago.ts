import { MercadoPagoConfig } from "@mercadopago/sdk-react";

export const MERCADOPAGO_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY ?? "";

export function isMercadoPagoConfigured() {
  return Boolean(MERCADOPAGO_PUBLIC_KEY);
}

export function initMercadoPago() {
  if (!MERCADOPAGO_PUBLIC_KEY) return false;
  MercadoPagoConfig({ publicKey: MERCADOPAGO_PUBLIC_KEY });
  return true;
}
