"use client";

import { usePathname } from "next/navigation";
import { localeOfPath, switchLocalePath } from "@/i18n/config";
import { cn } from "@/lib/utils/cn";

interface LocaleSwitchProps {
  /** Le nom de l'autre langue, écrit dans cette langue : « English », « Français ». */
  label: string;
  className?: string;
}

/** Lien vers la même page dans l'autre langue. */
export function LocaleSwitch({ label, className }: LocaleSwitchProps) {
  const pathname = usePathname();
  const target = localeOfPath(pathname) === "fr" ? "en" : "fr";

  return (
    <a
      href={switchLocalePath(pathname, target)}
      hrefLang={target}
      lang={target}
      className={cn("rounded-sm font-semibold transition-colors hover:text-fg", className)}
    >
      {label}
    </a>
  );
}
