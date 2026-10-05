/** Les langues du site vitrine. Le français est à la racine, l'anglais sous /en. */
export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

/** Les types d'établissement, chacun avec sa page sous /solutions. */
export const SOLUTION_IDS = ["restaurants", "maquis", "bars-lounges", "hotels", "residences"] as const;
export type SolutionId = (typeof SOLUTION_IDS)[number];

export function isSolutionId(value: string): value is SolutionId {
  return (SOLUTION_IDS as readonly string[]).includes(value);
}

/** L'adresse d'une page dans une langue : `/tarifs` en français, `/en/tarifs` en anglais. */
export function localePath(locale: Locale, path = "/"): string {
  const rest = path === "/" ? "" : path;
  if (locale === "fr") return rest || "/";
  return `/en${rest}`;
}

/** La même page dans l'autre langue. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const withoutPrefix = pathname === "/en" ? "/" : pathname.replace(/^\/en(?=\/)/, "");
  return localePath(target, withoutPrefix);
}

export function localeOfPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}
