/**
 * Les dix modèles de page d'établissement. Ce fichier décrit chaque modèle ;
 * son dessin est dans src/templates/{id}.tsx.
 */

export const TEMPLATE_IDS = [
  "braise",
  "ardoise",
  "table-dhote",
  "comptoir",
  "palace",
  "magazine",
  "epure",
  "marche",
  "carnet",
  "vitrine",
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export function isTemplateId(value: string): value is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(value);
}

export interface TemplateInfo {
  id: TemplateId;
  name: string;
  /** Ce qui le distingue, en une phrase. */
  description: string;
  /** Pour qui il est pensé d'abord. Tous restent utilisables par tous. */
  suits: string;
}

export const TEMPLATES: Record<TemplateId, TemplateInfo> = {
  braise: {
    id: "braise",
    name: "Braise",
    description: "De grandes photos en cartes, sous une couverture généreuse.",
    suits: "Restaurants et maquis qui ont de belles photos",
  },
  ardoise: {
    id: "ardoise",
    name: "Ardoise",
    description: "Le tableau noir du maquis : écriture à la craie, prix alignés.",
    suits: "Maquis et grillades",
  },
  "table-dhote": {
    id: "table-dhote",
    name: "Table d'hôte",
    description: "La carte classique sur papier ivoire, titres en lettres élégantes.",
    suits: "Restaurants de table",
  },
  comptoir: {
    id: "comptoir",
    name: "Comptoir",
    description: "Ambiance de nuit : fond sombre, cocktails en grand, catégories qui glissent.",
    suits: "Bars et lounges",
  },
  palace: {
    id: "palace",
    name: "Palace",
    description: "Sobre et raffiné, avec les services rangés en volets qui s'ouvrent.",
    suits: "Hôtels",
  },
  magazine: {
    id: "magazine",
    name: "Magazine",
    description: "Mise en page de revue : grands numéros, photos qui alternent.",
    suits: "Tables qui veulent raconter leur cuisine",
  },
  epure: {
    id: "epure",
    name: "Épure",
    description: "Presque rien : une liste nette, très rapide à lire et à charger.",
    suits: "Cartes longues, ou sans photos",
  },
  marche: {
    id: "marche",
    name: "Marché",
    description: "Grands aplats de couleur, étiquettes de prix, ton joyeux.",
    suits: "Restauration rapide et cuisine de rue",
  },
  carnet: {
    id: "carnet",
    name: "Carnet",
    description: "Comme un ticket de caisse : papier clair, chiffres alignés, découpes.",
    suits: "Cafés, snacks, résidences",
  },
  vitrine: {
    id: "vitrine",
    name: "Vitrine",
    description: "Chaque catégorie se feuillette comme une suite d'images en plein écran.",
    suits: "Cartes courtes aux photos fortes",
  },
};

export const DEFAULT_TEMPLATE: TemplateId = "braise";

/** Les couleurs proposées d'emblée. Le gérant peut aussi saisir la sienne. */
export const ACCENT_PRESETS = [
  { name: "Braise", value: "#F2622E" },
  { name: "Piment", value: "#D7263D" },
  { name: "Safran", value: "#E8A317" },
  { name: "Feuille", value: "#2E7D4F" },
  { name: "Lagune", value: "#0E7C86" },
  { name: "Indigo", value: "#3D4EAC" },
  { name: "Prune", value: "#7A2E63" },
  { name: "Rose", value: "#D6457E" },
  { name: "Cacao", value: "#6B4226" },
  { name: "Encre", value: "#14213D" },
] as const;

export const DEFAULT_ACCENT = ACCENT_PRESETS[0].value;
