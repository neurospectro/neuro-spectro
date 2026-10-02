import { useEffect, useRef, useState } from "react";

type TurnstileWidget = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: "light" | "dark" | "auto";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      action?: string;
      appearance?: "always" | "execute" | "interaction-only";
    },
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileWidget;
  }
}

const SITE_KEY = import.meta.env["VITE_TURNSTILE_SITE_KEY"] ?? "0x4AAAAAAFLca1wvjy36oj_0";
const SCRIPT_ID = "cloudflare-turnstile-script";

export function isTurnstileConfigured() {
  return Boolean(SITE_KEY);
}

export function SecurityCaptcha({
  onToken,
  resetKey = 0,
  action = "payment",
}: {
  onToken: (token: string) => void;
  resetKey?: number;
  action?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return;

    let cancelled = false;

    const mount = () => {
      if (cancelled || !containerRef.current || !window.turnstile || widgetIdRef.current) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY,
        theme: "auto",
        action,
        appearance: "always",
        callback: onToken,
        "expired-callback": () => onToken(""),
        "error-callback": () => onToken(""),
      });
      setReady(true);
    };

    if (window.turnstile) {
      mount();
      return () => {
        cancelled = true;
      };
    }

    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const handleLoad = () => {
      if (!cancelled) {
        setReady(true);
        mount();
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.addEventListener("load", handleLoad);
      document.head.appendChild(script);
    } else {
      script.addEventListener("load", handleLoad);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener("load", handleLoad);
    };
  }, [action, onToken]);

  useEffect(() => {
    if (!SITE_KEY || !widgetIdRef.current || !window.turnstile || resetKey === 0) return;
    window.turnstile.reset(widgetIdRef.current);
    onToken("");
  }, [resetKey, onToken]);

  if (!SITE_KEY) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
        A verificação de segurança ainda não foi configurada.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <div ref={containerRef} className="min-h-[65px]" />
      {!ready && (
        <p className="mt-1 text-xs text-muted-foreground">Carregando verificação de segurança...</p>
      )}
      <p className="mt-1 text-[11px] text-muted-foreground">
        Proteção contra acessos automatizados.
      </p>
    </div>
  );
}
