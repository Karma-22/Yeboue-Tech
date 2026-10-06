import { hasFeature, isPageOnline, subscriptionState } from "@/lib/billing/subscription";
import type { Establishment } from "@/lib/db/types";

/** Ce que la page d'un établissement montre à ses clients, à cet instant (ARCHITECTURE.md §8). */
export interface PublicView {
  /** La page s'affiche ; sinon, le message « momentanément indisponible ». */
  online: boolean;
  /** Comment le client peut commander. */
  ordering: "table" | "whatsapp" | "none";
  /** Les clients peuvent laisser un avis après leur commande. */
  reviews: boolean;
}

export function publicView(establishment: Establishment, atTable: boolean): PublicView {
  const now = Date.now();
  const state = subscriptionState(establishment.subscription, now);
  const online = establishment.published && isPageOnline(state);
  if (!online || state === "limited") return { online, ordering: "none", reviews: false };

  const dineIn = atTable && hasFeature(establishment.subscription, "dineInOrders", now);
  return {
    online,
    ordering: dineIn ? "table" : establishment.whatsapp ? "whatsapp" : "none",
    reviews: hasFeature(establishment.subscription, "reviews", now),
  };
}
