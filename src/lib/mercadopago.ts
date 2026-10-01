// Public Key do Mercado Pago.
// A Public Key é uma credencial pública e pode ser usada no frontend.
export const MERCADOPAGO_PUBLIC_KEY =
  import.meta.env["VITE_MERCADOPAGO_PUBLIC_KEY"] ??
  "APP_USR-11567a8e-e597-484e-8d90-e996ca8be1cb";

export function isMercadoPagoConfigured() {
  return Boolean(MERCADOPAGO_PUBLIC_KEY);
}
