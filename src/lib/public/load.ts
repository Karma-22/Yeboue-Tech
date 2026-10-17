import "server-only";

import { cache } from "react";
import { getPublicPage, type PublicPage } from "@/lib/db/public";
import { slugProblem } from "@/lib/utils/slug";

/**
 * La page publique d'un établissement, lue une seule fois par requête. Une
 * adresse qui ne peut pas être celle d'un établissement ne coûte aucune lecture.
 */
export const loadPublicPage = cache(async (slug: string): Promise<PublicPage | null> => {
  if (slugProblem(slug) !== null) return null;
  return getPublicPage(slug);
});
