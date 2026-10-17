import "server-only";

import { unstable_cache } from "next/cache";
import { pageTag } from "./core";
import { getEstablishmentBySlug } from "./establishments";
import { getMenu } from "./menu";
import { getFloor } from "./tables";
import type { Category, Establishment, Item, Table } from "./types";

/** Tout ce qu'il faut pour afficher la page d'un établissement à ses clients. */
export interface PublicPage {
  establishment: Establishment;
  categories: Category[];
  items: Item[];
  tables: Table[];
}

async function loadPublicPage(slug: string): Promise<PublicPage | null> {
  const establishment = await getEstablishmentBySlug(slug);
  if (!establishment) return null;
  const [menu, floor] = await Promise.all([getMenu(establishment.id), getFloor(establishment.id)]);
  const categories = menu.categories.filter((category) => category.visible);
  const visible = new Set(categories.map((category) => category.id));
  return {
    establishment,
    categories,
    items: menu.items.filter((item) => visible.has(item.categoryId)),
    tables: floor.tables,
  };
}

/**
 * La page d'un établissement, gardée en cache : mille scans ne coûtent qu'une
 * lecture de la base (ARCHITECTURE.md §11). Le cache est vidé à chaque
 * modification, par `updateTag(pageTag(slug))`.
 */
export function getPublicPage(slug: string): Promise<PublicPage | null> {
  return unstable_cache(() => loadPublicPage(slug), ["public-page", slug], { tags: [pageTag(slug)] })();
}
