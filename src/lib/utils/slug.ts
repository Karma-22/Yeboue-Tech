import { isReservedSlug } from "@/config/reserved-slugs";

export const SLUG_MIN = 3;
export const SLUG_MAX = 40;

/**
 * Transforme un nom en identifiant d'adresse : « Chez Tantie Affoué » devient
 * `chez-tantie-affoue`. Minuscules, chiffres et tirets seulement.
 */
export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // les accents
    .toLowerCase()
    .replace(/['’]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX)
    .replace(/-+$/, "");
}

export type SlugProblem = "too-short" | "too-long" | "invalid" | "reserved";

/** Dit ce qui ne va pas dans un identifiant, ou `null` s'il est acceptable. */
export function slugProblem(slug: string): SlugProblem | null {
  if (slug.length < SLUG_MIN) return "too-short";
  if (slug.length > SLUG_MAX) return "too-long";
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) return "invalid";
  if (isReservedSlug(slug)) return "reserved";
  return null;
}

/** Les identifiants à essayer quand le premier est pris : avec le quartier, puis numérotés. */
export function slugCandidates(name: string, district: string): string[] {
  const base = slugify(name);
  const withDistrict = slugify(`${name} ${district}`);
  const numbered = [2, 3, 4, 5, 6, 7, 8, 9].map((n) => `${base}-${n}`);
  return [...new Set([base, withDistrict, ...numbered])].filter((slug) => slugProblem(slug) === null);
}
