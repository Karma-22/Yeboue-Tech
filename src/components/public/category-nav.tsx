"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface CategoryNavProps {
  /** `id` est l'identifiant de la section dans la page. */
  categories: { id: string; name: string }[];
  /** La rangée qui défile. */
  className?: string;
  /** Chaque lien. */
  linkClassName?: string;
  /** Ajouté au lien de la catégorie affichée à l'écran. */
  activeClassName?: string;
  /** Ajouté aux autres liens. */
  idleClassName?: string;
  /** Hauteur de ce qui reste collé en haut de l'écran, en pixels. */
  offset?: number;
}

/**
 * La rangée des catégories, commune aux modèles : elle suit la lecture (la
 * catégorie à l'écran est mise en avant) et se recentre toute seule. Chaque
 * modèle l'habille à sa façon par les classes qu'il lui passe.
 */
export function CategoryNav({
  categories,
  className,
  linkClassName,
  activeClassName,
  idleClassName,
  offset = 72,
}: CategoryNavProps) {
  const [active, setActive] = useState(categories[0]?.id ?? "");
  const nav = useRef<HTMLElement>(null);

  // La catégorie affichée : la dernière dont le titre est passé sous la barre.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = categories[0]?.id ?? "";
      for (const category of categories) {
        const section = document.getElementById(category.id);
        if (section && section.getBoundingClientRect().top <= offset + 32) current = category.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, [categories, offset]);

  // Le lien actif revient au milieu de la rangée, sans toucher au défilement de la page.
  useEffect(() => {
    const row = nav.current;
    const link = row?.querySelector<HTMLElement>(`[data-category="${CSS.escape(active)}"]`);
    if (!row || !link) return;
    row.scrollTo({ left: link.offsetLeft - (row.clientWidth - link.clientWidth) / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav
      ref={nav}
      aria-label="Catégories"
      className={cn("flex overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", className)}
    >
      {categories.map((category) => (
        <a
          key={category.id}
          href={`#${category.id}`}
          data-category={category.id}
          aria-current={category.id === active ? "true" : undefined}
          className={cn(
            "shrink-0 whitespace-nowrap",
            linkClassName,
            category.id === active ? activeClassName : idleClassName,
          )}
        >
          {category.name}
        </a>
      ))}
    </nav>
  );
}
