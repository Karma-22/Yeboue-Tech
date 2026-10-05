/**
 * Identifiants qu'un établissement ne peut pas choisir pour son adresse,
 * puisque sa page vit à la racine du site (`/chez-ali`).
 */
const RESERVED = [
  // Pages de la plateforme (ARCHITECTURE.md §4)
  "app",
  "admin",
  "api",
  "tarifs",
  "fonctionnement",
  "demo",
  "contact",
  "mentions-legales",
  "confidentialite",
  "cgv",
  "inscription",
  "verification",
  "connexion",
  "mot-de-passe-oublie",
  "invitation",
  "charte",
  "solutions",
  "en",
  "fr",

  // Fichiers et dossiers techniques
  "brand",
  "icon",
  "apple-icon",
  "favicon",
  "manifest",
  "robots",
  "sitemap",
  "static",
  "assets",
  "public",

  // Mots gardés pour de futures pages, ou trompeurs s'ils étaient pris par un tiers
  "yeboue-tech",
  "yebouetech",
  "aide",
  "support",
  "blog",
  "compte",
  "paiement",
  "abonnement",
  "commande",
  "menu",
  "qr",
  "login",
  "signup",
  "dashboard",
  "www",
] as const;

const reserved: ReadonlySet<string> = new Set(RESERVED);

export function isReservedSlug(slug: string): boolean {
  return reserved.has(slug.trim().toLowerCase());
}
