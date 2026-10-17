/**
 * Les offres. C'est le seul endroit où figurent les prix et les limites :
 * changer une valeur ici suffit (ARCHITECTURE.md §7).
 */

export const PLAN_IDS = ["menu", "menu_orders"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

/** Fonctions réservées à certaines offres. Tout le reste est inclus partout. */
export const FEATURES = ["tableQr", "dineInOrders", "reviews", "loyalty", "salesStats"] as const;
export type Feature = (typeof FEATURES)[number];

export interface Plan {
  id: PlanId;
  name: string;
  /** Prix par mois, en FCFA. */
  monthlyPrice: number;
  features: readonly Feature[];
  maxMembers: number;
}

export const PLANS: Record<PlanId, Plan> = {
  menu: {
    id: "menu",
    name: "Menu",
    monthlyPrice: 10_000,
    features: [],
    maxMembers: 2,
  },
  menu_orders: {
    id: "menu_orders",
    name: "Menu + Commande",
    monthlyPrice: 25_000,
    features: ["tableQr", "dineInOrders", "reviews", "loyalty", "salesStats"],
    maxMembers: 10,
  },
};

/** L'essai gratuit donne accès à tout. */
export const TRIAL = {
  days: 14,
  plan: "menu_orders",
} as const satisfies { days: number; plan: PlanId };

/** Délais après l'échéance d'un abonnement (ARCHITECTURE.md §8). */
export const EXPIRY = {
  /** Jours pendant lesquels rien ne change. */
  graceDays: 5,
  /** Jours suivants pendant lesquels le menu reste visible sans la commande. */
  limitedDays: 30,
} as const;
