export const MERCADOPAGO_PUBLIC_KEY = import.meta.env["VITE_MERCADOPAGO_PUBLIC_KEY"] ?? "";

export function isMercadoPagoConfigured() {
  return Boolean(MERCADOPAGO_PUBLIC_KEY);
}
