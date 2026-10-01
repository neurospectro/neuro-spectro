// Public Key de TESTE do Mercado Pago (pública por natureza; o Access Token fica só no backend).
const TEST_PUBLIC_KEY = "APP_USR-9475958e-da67-4a96-bb00-5dcb91a6900d";
export const MERCADOPAGO_PUBLIC_KEY = import.meta.env["VITE_MERCADOPAGO_PUBLIC_KEY"] || TEST_PUBLIC_KEY;

export function isMercadoPagoConfigured() {
  return Boolean(MERCADOPAGO_PUBLIC_KEY);
}
