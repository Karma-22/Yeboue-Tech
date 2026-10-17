"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ThemeToggleProps {
  toDark: string;
  toLight: string;
  className?: string;
}

/** Clé sous laquelle le navigateur retient le choix. Lue aussi par le script du layout racine. */
export const THEME_STORAGE_KEY = "theme";

/**
 * Bascule entre le mode clair et le mode sombre, et retient le choix. L'icône
 * et le libellé suivent le thème par le CSS : le serveur n'a pas à le connaître.
 */
export function ThemeToggle({ toDark, toLight, className }: ThemeToggleProps) {
  const toggle = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme === "dark";
    if (dark) delete root.dataset.theme;
    else root.dataset.theme = "dark";
    try {
      localStorage.setItem(THEME_STORAGE_KEY, dark ? "light" : "dark");
    } catch {
      // Stockage indisponible (navigation privée) : le choix vaut pour cette page seulement.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full text-fg-muted transition-colors hover:bg-fg/7 hover:text-fg",
        className,
      )}
    >
      <Moon aria-hidden="true" className="size-5 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-5 dark:block" />
      <span className="sr-only dark:hidden">{toDark}</span>
      <span className="sr-only hidden dark:inline">{toLight}</span>
    </button>
  );
}
