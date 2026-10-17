/**
 * Les modèles de page d'établissement. Ce fichier décrit chaque modèle ; son
 * dessin est dans src/templates. La feuille de route des quatre-vingts modèles
 * est dans TEMPLATES.md, à la racine du dépôt.
 */

/** Les familles : elles servent à s'y retrouver quand on choisit un modèle. */
export const TEMPLATE_FAMILIES = [
  { id: "rue", name: "La rue et le quartier" },
  { id: "tables", name: "Les tables" },
  { id: "pouce", name: "Sur le pouce" },
  { id: "nuit", name: "La nuit" },
  { id: "douceurs", name: "Cafés et douceurs" },
  { id: "sejour", name: "Hôtels et résidences" },
  { id: "partis-pris", name: "Partis pris" },
] as const;
export type TemplateFamily = (typeof TEMPLATE_FAMILIES)[number]["id"];

/** Dans l'ordre de leur numéro (TEMPLATES.md). Un modèle s'ajoute ici quand il est terminé. */
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
  "gbaka",
  "enseigne",
  "pagne",
  "garba",
  "guirlande",
  "ecolier",
  "stade",
] as const;
export type TemplateId = (typeof TEMPLATE_IDS)[number];

export function isTemplateId(value: string): value is TemplateId {
  return (TEMPLATE_IDS as readonly string[]).includes(value);
}

export interface TemplateInfo {
  id: TemplateId;
  /** Son numéro dans TEMPLATES.md. */
  number: number;
  name: string;
  /** Ce qui le distingue, en une phrase. */
  description: string;
  /** Pour qui il est pensé d'abord. Tous restent utilisables par tous. */
  suits: string;
  family: TemplateFamily;
  /** La couleur qui le montre sous son meilleur jour : celle de sa vignette. Le gérant garde la sienne. */
  accent: string;
}

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

/** La couleur conseillée d'un modèle se choisit parmi celles proposées aux gérants. */
function accent(name: (typeof ACCENT_PRESETS)[number]["name"]): string {
  return ACCENT_PRESETS.find((preset) => preset.name === name)?.value ?? DEFAULT_ACCENT;
}
const BRAISE = accent("Braise");
const PIMENT = accent("Piment");
const SAFRAN = accent("Safran");
const FEUILLE = accent("Feuille");
const LAGUNE = accent("Lagune");
const INDIGO = accent("Indigo");
const PRUNE = accent("Prune");

export const TEMPLATES: Record<TemplateId, TemplateInfo> = {
  braise: {
    id: "braise",
    number: 1,
    name: "Braise",
    description: "De grandes photos en cartes, sous une couverture généreuse.",
    suits: "Restaurants et maquis qui ont de belles photos",
    family: "tables",
    accent: BRAISE,
  },
  ardoise: {
    id: "ardoise",
    number: 2,
    name: "Ardoise",
    description: "Le tableau noir du maquis : écriture à la craie, prix alignés.",
    suits: "Maquis et grillades",
    family: "rue",
    accent: BRAISE,
  },
  "table-dhote": {
    id: "table-dhote",
    number: 3,
    name: "Table d'hôte",
    description: "La carte classique sur papier ivoire, titres en lettres élégantes.",
    suits: "Restaurants de table",
    family: "tables",
    accent: BRAISE,
  },
  comptoir: {
    id: "comptoir",
    number: 4,
    name: "Comptoir",
    description: "Ambiance de nuit : fond sombre, cocktails en grand, catégories qui glissent.",
    suits: "Bars et lounges",
    family: "nuit",
    accent: BRAISE,
  },
  palace: {
    id: "palace",
    number: 5,
    name: "Palace",
    description: "Sobre et raffiné, avec les services rangés en volets qui s'ouvrent.",
    suits: "Hôtels",
    family: "sejour",
    accent: BRAISE,
  },
  magazine: {
    id: "magazine",
    number: 6,
    name: "Magazine",
    description: "Mise en page de revue : grands numéros, photos qui alternent.",
    suits: "Tables qui veulent raconter leur cuisine",
    family: "partis-pris",
    accent: BRAISE,
  },
  epure: {
    id: "epure",
    number: 7,
    name: "Épure",
    description: "Presque rien : une liste nette, très rapide à lire et à charger.",
    suits: "Cartes longues, ou sans photos",
    family: "partis-pris",
    accent: BRAISE,
  },
  marche: {
    id: "marche",
    number: 8,
    name: "Marché",
    description: "Grands aplats de couleur, étiquettes de prix, ton joyeux.",
    suits: "Restauration rapide et cuisine de rue",
    family: "pouce",
    accent: BRAISE,
  },
  carnet: {
    id: "carnet",
    number: 9,
    name: "Carnet",
    description: "Comme un ticket de caisse : papier clair, chiffres alignés, découpes.",
    suits: "Cafés, snacks, résidences",
    family: "douceurs",
    accent: BRAISE,
  },
  vitrine: {
    id: "vitrine",
    number: 10,
    name: "Vitrine",
    description: "Chaque catégorie se feuillette comme une suite d'images en plein écran.",
    suits: "Cartes courtes aux photos fortes",
    family: "partis-pris",
    accent: BRAISE,
  },
  gbaka: {
    id: "gbaka",
    number: 11,
    name: "Gbaka",
    description: "La carrosserie peinte du minibus : ses bandes, son slogan, ses vitres.",
    suits: "Maquis, cuisine de rue",
    family: "rue",
    accent: SAFRAN,
  },
  enseigne: {
    id: "enseigne",
    number: 12,
    name: "Enseigne",
    description: "L'enseigne peinte à la main : lettres à ombre portée, prix en étoile.",
    suits: "Maquis, grillades, petits restaurants",
    family: "rue",
    accent: PIMENT,
  },
  pagne: {
    id: "pagne",
    number: 13,
    name: "Pagne",
    description: "Le wax : des motifs dessinés dans votre couleur, des cartes cousues.",
    suits: "Cuisine ivoirienne, traiteurs",
    family: "rue",
    accent: INDIGO,
  },
  garba: {
    id: "garba",
    number: 14,
    name: "Garba",
    description: "Le garbadrome : de grandes assiettes rondes, le prix sur une pastille.",
    suits: "Garbadromes, cantines, cuisine du midi",
    family: "rue",
    accent: FEUILLE,
  },
  guirlande: {
    id: "guirlande",
    number: 15,
    name: "Guirlande",
    description: "Le marché de nuit : une guirlande d'ampoules, des étals à auvent rayé.",
    suits: "Allocodromes, maquis du soir, grillades",
    family: "rue",
    accent: LAGUNE,
  },
  ecolier: {
    id: "ecolier",
    number: 16,
    name: "Écolier",
    description: "Le cahier d'écolier : la carte écrite à l'encre bleue, les prix entourés en rouge.",
    suits: "Cantines, snacks, petits maquis",
    family: "rue",
    accent: PRUNE,
  },
  stade: {
    id: "stade",
    number: 17,
    name: "Stade",
    description: "Le jour de match : un tableau à volets, la pelouse, un numéro de maillot par article.",
    suits: "Maquis et bars qui diffusent les matchs",
    family: "rue",
    accent: BRAISE,
  },
};

export const DEFAULT_TEMPLATE: TemplateId = "braise";
