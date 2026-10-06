import type { EstablishmentType } from "@/lib/db/types";

/*
 * Ce que reçoit un modèle de page (ARCHITECTURE.md §10). Tous reçoivent
 * exactement les mêmes données, déjà rangées et traduites : un modèle ne lit
 * jamais la base, il ne fait que dessiner.
 */

export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  /** En FCFA ; `null` pour une ligne sans prix. */
  price: number | null;
  /** Mention affichée à la place du prix : « Gratuit », « Inclus ». */
  note: string;
  photo: { thumb: string; large: string } | null;
  /** Faux = en rupture : affiché, mais grisé et impossible à commander. */
  available: boolean;
}

export interface TemplateCategory {
  id: string;
  name: string;
  items: TemplateItem[];
}

export interface TemplateData {
  name: string;
  type: EstablishmentType;
  /** Le type, écrit dans la langue du client : « Maquis », « Hotel ». */
  typeLabel: string;
  description: string;
  district: string;
  city: string;
  address: string;
  hours: string;
  /** Numéros complets, sans espaces : `2250700000000`. Vides s'ils ne sont pas renseignés. */
  phone: string;
  whatsapp: string;
  logoUrl: string | null;
  coverUrl: string | null;
  categories: TemplateCategory[];
  /** « Étage — Table 12 », quand le client a scanné le QR Code d'une table. */
  tableLabel: string | null;
  /** Le lien vers l'autre langue, si la carte existe en deux langues. */
  languageSwitch: { label: string; href: string } | null;
  /** Les petits textes de l'interface, dans la langue du client. */
  labels: TemplateLabels;
}

export interface TemplateLabels {
  soldOut: string;
  call: string;
  whatsapp: string;
  hours: string;
  address: string;
  poweredBy: string;
  welcome: string;
  menu: string;
  thanks: string;
  swipe: string;
}

/** Un modèle : un composant qui dessine la page à partir de ces données. */
export type Template = (props: { data: TemplateData }) => React.ReactNode;

export const TYPE_LABELS: Record<EstablishmentType, { fr: string; en: string }> = {
  restaurant: { fr: "Restaurant", en: "Restaurant" },
  maquis: { fr: "Maquis", en: "Maquis" },
  bar: { fr: "Bar", en: "Bar" },
  hotel: { fr: "Hôtel", en: "Hotel" },
  residence: { fr: "Résidence", en: "Serviced apartments" },
};

export const LABELS: Record<"fr" | "en", TemplateLabels> = {
  fr: {
    soldOut: "Rupture",
    call: "Appeler",
    whatsapp: "WhatsApp",
    hours: "Horaires",
    address: "Adresse",
    poweredBy: "Carte créée avec",
    welcome: "Bienvenue",
    menu: "La carte",
    thanks: "Merci de votre visite",
    swipe: "Faites glisser",
  },
  en: {
    soldOut: "Sold out",
    call: "Call",
    whatsapp: "WhatsApp",
    hours: "Opening hours",
    address: "Address",
    poweredBy: "Menu made with",
    welcome: "Welcome",
    menu: "The menu",
    thanks: "Thank you for your visit",
    swipe: "Swipe",
  },
};
