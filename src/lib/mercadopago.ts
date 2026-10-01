// Public Key do Mercado Pago (pública por natureza; o Access Token fica somente no backend).
const PRODUCTION_PUBLIC_KEY = "APP_USR-11567a8e-e597-484e-8d90-e996ca8be1cb";
export const MERCADOPAGO_PUBLIC_KEY = import.meta.env["VITE_MERCADOPAGO_PUBLIC_KEY"] || PRODUCTION_PUBLIC_KEY;

export function isMercadoPagoConfigured() {
  return Boolean(MERCADOPAGO_PUBLIC_KEY);
}
