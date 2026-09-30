export const ADSENSE = {
  enabled: true,
  /**
   * Preenchido quando a conta AdSense e os blocos de anúncio estiverem aprovados.
   * Mantido fora do código até a configuração real para evitar anúncios acidentais.
   */
  clientId: import.meta.env["VITE_ADSENSE_CLIENT_ID"] ?? "",
  paidContentOnly: true,
} as const;

export function canRenderAds(hasPaidAccess: boolean) {
  return ADSENSE.enabled && ADSENSE.paidContentOnly && hasPaidAccess && Boolean(ADSENSE.clientId);
}
