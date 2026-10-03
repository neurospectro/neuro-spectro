import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  HelpCircle,
  Instagram,
  Menu,
  UserCircle,
  Users,
  X,
  BookOpen,
  Compass,
} from "lucide-react";

const groups = [
  {
    title: "NEUROSPECTRO",
    items: [
      { label: "Nosso propósito", to: "/proposito", icon: Compass },
      { label: "Conteúdos", to: "/conteudos", icon: BookOpen },
      { label: "Comunidade", to: "/comunidade", icon: Users },
      { label: "Ajuda", to: "/ajuda", icon: HelpCircle },
    ],
  },
  {
    title: "MINHA JORNADA",
    items: [
      { label: "Minha avaliação", to: "/avaliacao", icon: BookOpen },
      { label: "Minha conta", to: "/conta", icon: UserCircle },
    ],
  },
];

export function SideNavigation() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        title="Menu"
        className="fixed bottom-4 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-soft backdrop-blur transition hover:border-primary/40 hover:text-primary"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Fechar menu"
            className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu NeuroSpectro"
            className="absolute left-0 top-0 flex h-full w-[min(92vw,360px)] flex-col border-r border-border bg-card p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  NeuroSpectro
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Explore sua jornada</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Fechar menu"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <nav className="mt-8 space-y-6 overflow-y-auto" aria-label="Navegação secundária">
              {groups.map((group) => (
                <div key={group.title}>
                  <p className="mb-2 px-3 text-[10px] font-bold tracking-[0.2em] text-muted-foreground">
                    {group.title}
                  </p>
                  <div className="space-y-1">
                    {group.items.map(({ label, to, icon: Icon }) => (
                      <Link
                        key={to}
                        to={to}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground transition hover:bg-secondary hover:text-primary"
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <a
                href="https://www.instagram.com/neurospectro"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-foreground transition hover:bg-secondary hover:text-primary"
                aria-label="Instagram da NeuroSpectro"
              >
                <Instagram className="h-4 w-4 shrink-0" />
                Instagram
              </a>
            </nav>

            <div className="mt-auto rounded-2xl bg-muted p-4">
              <p className="text-xs font-semibold text-ink">Quer começar?</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                O menu fica discreto para manter a avaliação como foco principal.
              </p>
              <Link
                to="/avaliacao"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Iniciar avaliação
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
