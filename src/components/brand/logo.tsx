import { cn } from "@/lib/utils/cn";
import { site } from "@/config/site";
import { LOGO_VIEWBOX, WORDMARK_PATH } from "./wordmark-path";

/*
 * Le logo suit le thème, comme le veut la charte : anneau et nom dans la
 * couleur du texte, espace intérieur dans celle du fond, assiette toujours
 * braise. Sur fond clair on obtient logo-full, sur fond sombre logo-full-light.
 */

const RING_AND_HOLE =
  "M20 4h24A16 16 0 0 1 60 20v24A16 16 0 0 1 44 60H20A16 16 0 0 1 4 44V20A16 16 0 0 1 20 4ZM23 14a9 9 0 0 0-9 9v18a9 9 0 0 0 9 9h18a9 9 0 0 0 9-9V23a9 9 0 0 0-9-9Z";

/** Les trois formes du symbole, sur la grille 64 × 64 de la charte. */
function MarkShapes({ mono = false }: { mono?: boolean }) {
  if (mono) {
    return (
      <>
        <path fillRule="evenodd" d={RING_AND_HOLE} fill="currentColor" />
        <circle cx="32" cy="32" r="9" fill="currentColor" />
      </>
    );
  }
  return (
    <>
      <rect x="4" y="4" width="56" height="56" rx="16" className="fill-fg" />
      <rect x="14" y="14" width="36" height="36" rx="9" className="fill-surface" />
      <circle cx="32" cy="32" r="9" className="fill-ember" />
    </>
  );
}

interface LogoMarkProps extends Omit<React.ComponentProps<"svg">, "viewBox"> {
  /** Une seule couleur, centre transparent : prend la couleur du texte. */
  mono?: boolean;
}

/** Le symbole seul. */
export function LogoMark({ mono = false, className, ...props }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={site.name}
      className={cn("size-8 shrink-0", className)}
      {...props}
    >
      <MarkShapes mono={mono} />
    </svg>
  );
}

/** Le symbole et le nom. La hauteur se règle avec une classe (`h-8` par défaut). */
export function Logo({ className, ...props }: Omit<React.ComponentProps<"svg">, "viewBox">) {
  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      preserveAspectRatio="xMinYMid meet"
      role="img"
      aria-label={site.name}
      className={cn("h-8 w-auto shrink-0", className)}
      {...props}
    >
      <MarkShapes />
      <path d={WORDMARK_PATH} className="fill-fg" />
    </svg>
  );
}
