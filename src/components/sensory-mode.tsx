import { Moon, Sparkles, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "neurospectro-sensory-comfort";

export function SensoryMode() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) === "true";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(saved);
    document.documentElement.classList.toggle("sensory-comfort", saved);
    document.documentElement.classList.toggle("reduce-motion", saved || reducedMotion);
  }, []);

  const toggle = () => {
    const next = !enabled;
    setEnabled(next);
    window.localStorage.setItem(STORAGE_KEY, String(next));
    document.documentElement.classList.toggle("sensory-comfort", next);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.documentElement.classList.toggle("reduce-motion", next || reducedMotion);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={enabled ? "Desativar acessibilidade sensorial" : "Ativar acessibilidade sensorial"}
      title={enabled ? "Desativar acessibilidade sensorial" : "Ativar acessibilidade sensorial"}
      className="fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-card-foreground shadow-lg transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {enabled ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
      <span className="hidden sm:inline">Acessibilidade sensorial</span>
      <Sparkles className="size-3.5 opacity-60" aria-hidden="true" />
    </button>
  );
}
