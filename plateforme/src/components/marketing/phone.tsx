import { cn } from "@/lib/utils/cn";

/**
 * Un téléphone dessiné, pour montrer une page d'établissement dans le site
 * vitrine. Purement décoratif : rien n'y est cliquable.
 */
export function Phone({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19] w-68 shrink-0 rounded-[2.75rem] bg-ink p-2 shadow-lg ring-1 ring-ivory/15",
        // Sur fond sombre, la coque passe au noir pour se détacher de l'encre.
        "dark:bg-[#070b16] dark:ring-ivory/25",
        className,
      )}
      {...props}
    >
      {/* Boutons du côté */}
      <span aria-hidden="true" className="absolute top-[18%] -left-0.5 h-[7%] w-1 rounded-l-sm bg-ink dark:bg-[#070b16]" />
      <span aria-hidden="true" className="absolute top-[24%] -right-0.5 h-[11%] w-1 rounded-r-sm bg-ink dark:bg-[#070b16]" />

      {/* L'écran affiche toujours le thème clair, même dans une section sombre. */}
      <div
        data-theme="light"
        className="relative size-full overflow-hidden rounded-[2.25rem] bg-surface text-[0.6875rem] leading-snug text-fg"
      >
        {children}
      </div>

      {/* Encoche */}
      <span
        aria-hidden="true"
        className="absolute top-4 left-1/2 h-4.5 w-18 -translate-x-1/2 rounded-full bg-ink dark:bg-[#070b16]"
      />
    </div>
  );
}
