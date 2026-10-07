import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { TEMPLATE_IDS, TEMPLATES } from "@/config/templates";
import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/utils/cn";

/**
 * Les dix modèles de page, chacun dans son téléphone. Une rangée qui défile
 * sur téléphone, une grille sur grand écran ; chaque carte ouvre le modèle
 * pour de vrai, avec une carte d'exemple.
 */
export function TemplateGallery({ dict }: { dict: Dictionary }) {
  return (
    <ul className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pt-3 pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-x-6 lg:gap-y-12 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
      {TEMPLATE_IDS.map((id, index) => (
        <li key={id} data-reveal className="w-[58vw] max-w-52 shrink-0 snap-center lg:w-auto lg:max-w-none">
          <Link href={`/apercu/${id}`} prefetch={false} className="group block rounded-lg">
            <span
              className={cn(
                "block rounded-[1.75rem] bg-ink p-2 shadow-md transition-transform duration-500 ease-emphasized group-hover:-translate-y-2 group-hover:rotate-0",
                index % 2 === 0 ? "-rotate-1" : "rotate-1",
              )}
            >
              <span className="relative block aspect-[9/15] overflow-hidden rounded-[1.3rem] bg-surface-sunken">
                {/* Des captures d'écran légères : dix pages vivantes pèseraient trop lourd ici. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/modeles/${id}.webp`}
                  alt=""
                  width={480}
                  height={935}
                  loading="lazy"
                  decoding="async"
                  className="size-full object-cover object-top"
                />
                <span className="absolute right-2.5 bottom-2.5 grid size-9 translate-y-2 place-items-center rounded-full bg-accent text-on-accent opacity-0 transition-[translate,opacity] duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <ArrowUpRight aria-hidden="true" className="size-5" />
                </span>
              </span>
            </span>
            <span className="mt-4 block font-display text-lg font-bold">{TEMPLATES[id].name}</span>
            <span className="mt-0.5 block text-sm leading-snug text-fg-muted">{dict.templates.descriptions[id]}</span>
            <span className="sr-only">{dict.templates.see}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
