import type { TemplateCategory, TemplateItem } from "../types";

/* De petits outils de texte et de tri, communs aux modèles. */

/** « 03 » : un numéro sur deux chiffres. */
export function two(value: number): string {
  return String(value).padStart(2, "0");
}

/** Les articles d'une catégorie, séparés selon qu'ils ont une photo ou non. L'ordre du gérant est gardé dans chaque groupe. */
export function byPhoto(category: TemplateCategory): { withPhoto: TemplateItem[]; plain: TemplateItem[] } {
  return {
    withPhoto: category.items.filter((item) => item.photo),
    plain: category.items.filter((item) => !item.photo),
  };
}

/** Les premières photos de la carte, pour habiller un haut de page. */
export function firstPhotos(categories: TemplateCategory[], count: number): TemplateItem[] {
  return categories
    .flatMap((category) => category.items)
    .filter((item) => item.photo && item.available)
    .slice(0, count);
}

/**
 * Les ingrédients d'un article, lus dans sa description : « Rhum, menthe, citron vert. »
 * donne trois étiquettes. Rend une liste vide si la description n'est pas une énumération.
 */
export function ingredientsOf(item: TemplateItem, max = 5): string[] {
  const parts = item.description
    .replace(/[.!?]+$/g, "")
    .split(/,|;| et /)
    .map((part) => part.trim())
    .filter((part) => part.length > 1 && part.length <= 28);
  return parts.length >= 2 ? parts.slice(0, max) : [];
}
