"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

export interface PanelNavItem {
  /** Ce qui suit l'adresse de l'établissement : « /menu », ou rien pour l'accueil. */
  path: string;
  label: string;
  icon: React.ReactNode;
}

/** Le menu du tableau de bord : une colonne sur ordinateur, une rangée qui défile sur téléphone. */
export function PanelNav({ base, items }: { base: string; items: PanelNavItem[] }) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Tableau de bord"
      className="flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none] lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
    >
      {items.map((item) => {
        const href = `${base}${item.path}`;
        const active = item.path === "" ? pathname === base : pathname.startsWith(href);
        return (
          <Link
            key={item.path}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex h-10 shrink-0 items-center gap-2.5 rounded-md px-3 text-sm font-semibold whitespace-nowrap transition-colors [&_svg]:size-[1.125rem]",
              active ? "bg-fg text-surface" : "text-fg-muted hover:bg-fg/7 hover:text-fg",
            )}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
