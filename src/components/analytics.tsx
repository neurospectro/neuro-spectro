import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

const META_PIXEL_ID = import.meta.env["VITE_META_PIXEL_ID"]?.trim();
const GA_ID = import.meta.env["VITE_GA_MEASUREMENT_ID"]?.trim() || "G-7NXK1MCX2D";
const TIKTOK_PIXEL_ID = import.meta.env["VITE_TIKTOK_PIXEL_ID"]?.trim();

declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: Window["fbq"];
    TiktokAnalyticsObject?: string;
    ttq?: any;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function loadMetaPixel() {
  if (!META_PIXEL_ID || window.fbq) return;

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  }) as Window["fbq"];

  fbq!.queue = [];
  fbq!.loaded = true;
  fbq!.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;

  fbq!("init", META_PIXEL_ID);
  fbq!("track", "PageView");

  const script = document.createElement("script");
  script.async = true;
  script.src = "https://connect.facebook.net/en_US/fbevents.js";
  script.dataset["neuroSpectro"] = "meta-pixel";
  document.head.appendChild(script);
}

function loadTikTokPixel() {
  if (!TIKTOK_PIXEL_ID || window.ttq) return;

  window.TiktokAnalyticsObject = "ttq";
  const ttq = (window.ttq = window.ttq ?? []);
  const methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie"];

  ttq.methods = methods;
  ttq.setAndDefer = (target: any, name: string) => {
    target[name] = (...args: unknown[]) => {
      target.push([name, ...args]);
    };
  };

  methods.forEach((name) => ttq.setAndDefer?.(ttq, name));
  ttq.instance = (id: string) => {
    const instance = ttq._i?.[id] ?? [];
    ttq._i = ttq._i ?? {};
    ttq._i[id] = instance;
    methods.forEach((name) => ttq.setAndDefer?.(instance, name));
    return instance;
  };
  ttq.load = (id: string, options?: unknown) => {
    const src = "https://analytics.tiktok.com/i18n/pixel/events.js";
    ttq._i = ttq._i ?? {};
    ttq._i[id] = [];
    (ttq._i[id] as any)._u = src;
    ttq._t = ttq._t ?? {};
    ttq._t[id] = +new Date();
    ttq._o = ttq._o ?? {};
    ttq._o[id] = options ?? {};

    const script = document.createElement("script");
    script.async = true;
    script.src = src + "?sdkid=" + encodeURIComponent(id) + "&lib=ttq";
    script.dataset["neuroSpectro"] = "tiktok-pixel";
    const firstScript = document.getElementsByTagName("script")[0];
    firstScript?.parentNode?.insertBefore(script, firstScript);
  };

  ttq.load(TIKTOK_PIXEL_ID);
  ttq.page();
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
  script.dataset["neuroSpectro"] = "ga4";
  document.head.appendChild(script);
}

export function trackEvent(name: string, params: Record<string, string | number | boolean | undefined> = {}) {
  if (window.fbq && META_PIXEL_ID) window.fbq("trackCustom", name, params);
  if (window.ttq?.track && TIKTOK_PIXEL_ID) window.ttq.track(name, params);
  if (window.gtag && GA_ID) window.gtag("event", name, params);
}

export function trackPurchase(value: number, currency = "BRL") {
  const params = { value, currency };
  if (window.fbq && META_PIXEL_ID) window.fbq("track", "Purchase", params);
  if (window.ttq?.track && TIKTOK_PIXEL_ID) window.ttq.track("CompletePayment", params);
  if (window.gtag && GA_ID) window.gtag("event", "purchase", params);
}

export function Analytics() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    loadMetaPixel();
    loadTikTokPixel();
    loadGoogleAnalytics();
  }, []);

  useEffect(() => {
    if (window.fbq && META_PIXEL_ID) window.fbq("track", "PageView");
    if (window.ttq?.page && TIKTOK_PIXEL_ID) window.ttq.page();
    if (window.gtag && GA_ID) window.gtag("event", "page_view", { page_path: pathname });
  }, [pathname]);

  return null;
}
