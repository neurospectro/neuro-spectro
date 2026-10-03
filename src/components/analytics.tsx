import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const PIXEL_ID = import.meta.env["VITE_META_PIXEL_ID"]?.trim();
const GA_ID = import.meta.env["VITE_GA_MEASUREMENT_ID"]?.trim();

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    _fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadMetaPixel() {
  if (!PIXEL_ID || window.fbq) return;

  const fbq = (...args: unknown[]) => {
    if (!window.dataLayer) window.dataLayer = [];
    window.dataLayer.push(["fbq", ...args]);
  };

  window.fbq = fbq;
  window._fbq = fbq;
  fbq("init", PIXEL_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.dataset.neuroSpectro = "meta-pixel";
  document.head.appendChild(script);
}

function loadGoogleAnalytics() {
  if (!GA_ID || window.gtag) return;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = (...args: unknown[]) => {
    window.dataLayer!.push(args);
  };

  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
  script.dataset.neuroSpectro = "ga4";
  document.head.appendChild(script);
}

export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  if (window.fbq && PIXEL_ID) {
    window.fbq("trackCustom", name, params);
  }

  if (window.gtag && GA_ID) {
    window.gtag("event", name, params);
  }
}

export function trackPurchase(value: number, currency = "BRL") {
  if (window.fbq && PIXEL_ID) {
    window.fbq("track", "Purchase", { value, currency });
  }

  if (window.gtag && GA_ID) {
    window.gtag("event", "purchase", { value, currency });
  }
}

export function Analytics() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    loadMetaPixel();
    loadGoogleAnalytics();
  }, []);

  useEffect(() => {
    if (!PIXEL_ID && !GA_ID) return;

    if (window.fbq && PIXEL_ID) {
      window.fbq("track", "PageView");
    }

    if (window.gtag && GA_ID) {
      window.gtag("event", "page_view", { page_path: pathname });
    }
  }, [pathname]);

  return null;
}
