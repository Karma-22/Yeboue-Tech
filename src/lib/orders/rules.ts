import type { Item, OrderLine, OrderStatus } from "@/lib/db/types";

/* Le cycle d'une commande (ARCHITECTURE.md §9) : on n'avance que dans le sens des flèches. */

const NEXT: Record<OrderStatus, OrderStatus[]> = {
  new: ["accepted", "rejected"],
  accepted: ["ready", "cancelled"],
  ready: ["served"],
  served: [],
  rejected: [],
  cancelled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return NEXT[from].includes(to);
}

/** Les états où il reste quelque chose à faire. */
export function isOpen(status: OrderStatus): boolean {
  return NEXT[status].length > 0;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Nouvelle",
  accepted: "En préparation",
  ready: "Prête",
  served: "Servie",
  rejected: "Refusée",
  cancelled: "Annulée",
};

/** Ce que lit le client sur sa page de suivi. */
export const CUSTOMER_STATUS: Record<OrderStatus, string> = {
  new: "Commande envoyée",
  accepted: "En préparation",
  ready: "Votre commande est prête",
  served: "Bon appétit",
  rejected: "Commande refusée",
  cancelled: "Commande annulée",
};

/** Le plus gros panier accepté : au-delà, c'est une erreur ou un abus. */
export const MAX_LINES = 40;
export const MAX_QUANTITY = 50;

export interface CartEntry {
  itemId: string;
  quantity: number;
}

export type CartError = "empty" | "too-large" | "unknown-item" | "unavailable" | "no-price";

/**
 * Construit les lignes d'une commande à partir du panier envoyé par le
 * navigateur. Le navigateur ne donne que des identifiants et des quantités :
 * les noms et les prix sont relus ici, dans la carte de l'établissement.
 */
export function buildOrderLines(
  cart: CartEntry[],
  items: Pick<Item, "id" | "name" | "price" | "available">[],
): { lines: OrderLine[]; total: number } | { error: CartError; itemId?: string } {
  if (cart.length === 0) return { error: "empty" };
  if (cart.length > MAX_LINES) return { error: "too-large" };

  const byId = new Map(items.map((item) => [item.id, item]));
  const quantities = new Map<string, number>();
  for (const entry of cart) {
    if (!Number.isInteger(entry.quantity) || entry.quantity < 1) return { error: "too-large" };
    quantities.set(entry.itemId, (quantities.get(entry.itemId) ?? 0) + entry.quantity);
  }

  const lines: OrderLine[] = [];
  for (const [itemId, quantity] of quantities) {
    if (quantity > MAX_QUANTITY) return { error: "too-large", itemId };
    const item = byId.get(itemId);
    if (!item) return { error: "unknown-item", itemId };
    if (!item.available) return { error: "unavailable", itemId };
    if (item.price === null) return { error: "no-price", itemId };
    lines.push({ itemId, name: item.name, price: item.price, quantity });
  }

  return { lines, total: lines.reduce((sum, line) => sum + line.price * line.quantity, 0) };
}
