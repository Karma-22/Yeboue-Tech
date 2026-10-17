import type { Role } from "@/lib/db/types";

/* Qui peut faire quoi dans un établissement (ARCHITECTURE.md §2). */

export const ACTIONS = [
  "orders.handle",
  "items.toggle",
  "menu.edit",
  "page.edit",
  "tables.edit",
  "stats.view",
  "team.manage",
  "billing.manage",
  "establishment.delete",
] as const;
export type Action = (typeof ACTIONS)[number];

const EVERYONE: Role[] = ["owner", "manager", "waiter", "kitchen"];
const MANAGERS: Role[] = ["owner", "manager"];
const OWNER: Role[] = ["owner"];

const ALLOWED: Record<Action, Role[]> = {
  "orders.handle": EVERYONE,
  "items.toggle": EVERYONE,
  "menu.edit": MANAGERS,
  "page.edit": MANAGERS,
  "tables.edit": MANAGERS,
  "stats.view": MANAGERS,
  "team.manage": OWNER,
  "billing.manage": OWNER,
  "establishment.delete": OWNER,
};

export function can(role: Role, action: Action): boolean {
  return ALLOWED[action].includes(role);
}

export const ROLE_LABELS: Record<Role, string> = {
  owner: "Propriétaire",
  manager: "Gérant",
  waiter: "Serveur",
  kitchen: "Cuisine",
};

export const ROLE_HINTS: Record<Role, string> = {
  owner: "Tout, y compris l'abonnement et l'équipe.",
  manager: "Le menu, la page, les tables, les chiffres et les commandes.",
  waiter: "Les commandes et les ruptures.",
  kitchen: "Les commandes et les ruptures.",
};
