import type { StaticImageData } from "next/image";
import type { EstablishmentType } from "@/lib/db/types";
import barLounge from "@/assets/photos/bar-lounge.jpg";
import barCocktails from "@/assets/photos/bar-cocktails.jpg";
import bissap from "@/assets/photos/boisson-bissap.jpg";
import redCocktail from "@/assets/photos/cocktail-rouge.jpg";
import greenCocktail from "@/assets/photos/cocktail-vert.jpg";
import hotelRoom from "@/assets/photos/hotel-chambre.jpg";
import hotelTray from "@/assets/photos/hotel-plateau.jpg";
import roomService from "@/assets/photos/hotel-room-service.jpg";
import grill from "@/assets/photos/maquis-poisson-braise.jpg";
import alloco from "@/assets/photos/plat-alloco.jpg";
import skewers from "@/assets/photos/plat-brochettes.jpg";
import foutou from "@/assets/photos/plat-foutou.jpg";
import rice from "@/assets/photos/plat-riz-gras.jpg";
import livingRoom from "@/assets/photos/residence-salon.jpg";
import restaurant from "@/assets/photos/restaurant-service.jpg";
import { LABELS, TYPE_LABELS, type TemplateData, type TemplateItem } from "./types";

/*
 * Les établissements d'exemple : ils servent à montrer les modèles (/apercu)
 * et à proposer une première carte dans la création guidée. Ce ne sont pas des
 * clients : les noms sont inventés, les photos viennent de banques libres.
 */

export interface SampleItem {
  name: string;
  description: string;
  price: number | null;
  note?: string;
  photo?: StaticImageData;
  soldOut?: boolean;
}

export interface Sample {
  name: string;
  description: string;
  district: string;
  address: string;
  hours: string;
  cover: StaticImageData;
  /** Comment s'appelle un emplacement ici, pour l'étiquette d'aperçu. */
  tableLabel: string;
  categories: { name: string; items: SampleItem[] }[];
}

export const SAMPLES: Record<EstablishmentType, Sample> = {
  restaurant: {
    name: "Le Palmier",
    description: "Cuisine ivoirienne de marché, servie midi et soir au cœur du Plateau.",
    district: "Plateau",
    address: "Avenue Chardy, Plateau",
    hours: "Tous les jours, 11 h – 23 h",
    cover: restaurant,
    tableLabel: "Salle — Table 7",
    categories: [
      {
        name: "Entrées",
        items: [
          { name: "Alloco", description: "Banane plantain frite, sauce piment de la maison.", price: 1500, photo: alloco },
          { name: "Brochettes de poulet", description: "Marinées la veille, grillées au charbon.", price: 3000, photo: skewers },
          { name: "Salade d'avocat", description: "Avocat, tomate, oignon doux, citron vert.", price: 2500 },
        ],
      },
      {
        name: "Plats",
        items: [
          { name: "Riz gras, alloco", description: "Riz parfumé à la tomate, alloco doré, poulet ou poisson au choix.", price: 4000, photo: rice },
          { name: "Foutou, sauce graine", description: "Foutou banane, sauce graine au poisson fumé.", price: 4500, photo: foutou },
          { name: "Poisson braisé", description: "Carpe du jour, oignons, tomates et piment frais.", price: 6000, photo: grill },
          { name: "Kedjenou de poulet", description: "Mijoté à l'étouffée, servi avec de l'attiéké.", price: 5000 },
          { name: "Attiéké poisson", description: "Thon frit, attiéké, crudités.", price: 3500, soldOut: true },
        ],
      },
      {
        name: "Boissons",
        items: [
          { name: "Bissap maison", description: "Fleurs d'hibiscus, menthe fraîche. Le verre.", price: 1000, photo: bissap },
          { name: "Jus de gingembre", description: "Gnamakoudji pressé le matin. Le verre.", price: 1000 },
          { name: "Eau minérale", description: "La grande bouteille.", price: 1000 },
          { name: "Bière locale", description: "La bouteille de 66 cl, bien fraîche.", price: 1500 },
        ],
      },
    ],
  },

  maquis: {
    name: "Chez Tantie",
    description: "Le poisson du jour sur la braise, à déguster sous l'apatam. Ici, on mange avec les doigts.",
    district: "Cocody",
    address: "Rue des Jardins, Cocody",
    hours: "Du mardi au dimanche, 12 h – minuit",
    cover: grill,
    tableLabel: "Terrasse — Table 12",
    categories: [
      {
        name: "Grillades",
        items: [
          { name: "Poisson braisé", description: "Carpe, oignons, tomates, piment. Prix selon la taille.", price: 4500, photo: grill },
          { name: "Brochettes de poulet", description: "Servies avec du riz gras.", price: 3500, photo: skewers },
          { name: "Poulet braisé", description: "Le demi-poulet, mariné à la moutarde.", price: 5000 },
          { name: "Choukouya de mouton", description: "Épicé au kankankan. La portion.", price: 4000, soldOut: true },
        ],
      },
      {
        name: "Plats",
        items: [
          { name: "Riz gras", description: "Riz à la tomate et aux légumes.", price: 2500, photo: rice },
          { name: "Foutou, sauce graine", description: "Au poisson fumé.", price: 3000, photo: foutou },
          { name: "Alloco", description: "Banane plantain frite.", price: 1000, photo: alloco },
          { name: "Attiéké", description: "La boule.", price: 500 },
        ],
      },
      {
        name: "Boissons",
        items: [
          { name: "Bissap maison", description: "Le verre.", price: 500, photo: bissap },
          { name: "Gnamakoudji", description: "Jus de gingembre. Le verre.", price: 500 },
          { name: "Bière 66 cl", description: "Bien glacée.", price: 1000 },
          { name: "Sucrerie", description: "La bouteille de 30 cl.", price: 500 },
        ],
      },
    ],
  },

  bar: {
    name: "Le Baobab Lounge",
    description: "Cocktails de saison, musique live le vendredi, terrasse sur la lagune.",
    district: "Zone 4",
    address: "Rue du Docteur Blanchard, Zone 4",
    hours: "Du mercredi au dimanche, 18 h – 3 h",
    cover: barLounge,
    tableLabel: "Terrasse — Table haute 4",
    categories: [
      {
        name: "Cocktails",
        items: [
          { name: "Mojito passion", description: "Rhum, menthe, citron vert, fruit de la passion.", price: 5000, photo: greenCocktail },
          { name: "Bissap spritz", description: "Bissap maison, gingembre, bulles.", price: 4500, photo: redCocktail },
          { name: "Planteur maison", description: "Rhum ambré, jus de fruits frais, muscade.", price: 5000, photo: barCocktails },
          { name: "Gin tonic gingembre", description: "Gin, tonic, gingembre frais râpé.", price: 5500 },
        ],
      },
      {
        name: "Bières et softs",
        items: [
          { name: "Bière pression", description: "Le demi, 25 cl.", price: 2000 },
          { name: "Bière en bouteille", description: "33 cl, locale ou importée.", price: 2500 },
          { name: "Bissap maison", description: "Sans alcool. Le verre.", price: 1500, photo: bissap },
          { name: "Eau pétillante", description: "La bouteille de 50 cl.", price: 1500 },
        ],
      },
      {
        name: "À partager",
        items: [
          { name: "Alloco à partager", description: "Avec la sauce piment.", price: 2500, photo: alloco },
          { name: "Brochettes de poulet", description: "Six pièces, sauce cacahuète.", price: 5000, photo: skewers },
          { name: "Planche de grillades", description: "Poisson, poulet, alloco. Pour trois ou quatre.", price: 12000, photo: grill },
        ],
      },
    ],
  },

  hotel: {
    name: "Hôtel La Lagune",
    description: "Tout ce que l'hôtel vous propose, depuis votre chambre.",
    district: "Marcory",
    address: "Boulevard de Marseille, Marcory",
    hours: "Réception ouverte 24 h sur 24",
    cover: hotelRoom,
    tableLabel: "Chambre 204",
    categories: [
      {
        name: "Votre séjour",
        items: [
          { name: "Wi-Fi", description: "Réseau « LaLagune-Clients ». Le code est sur votre carte de chambre.", price: null, note: "Gratuit" },
          { name: "Ménage et serviettes", description: "Tous les jours, ou sur simple demande à la réception.", price: null, note: "Inclus" },
          { name: "Départ", description: "Les chambres sont à libérer avant midi.", price: null, note: "Avant 12 h" },
          { name: "Piscine", description: "Serviettes à disposition au bord du bassin.", price: null, note: "7 h – 21 h" },
        ],
      },
      {
        name: "En chambre",
        items: [
          { name: "Petit-déjeuner en chambre", description: "Viennoiseries, fruits, œufs, jus pressé. De 6 h 30 à 10 h 30.", price: 7500, photo: hotelTray },
          { name: "Plateau du soir", description: "Le plat du jour et son dessert, jusqu'à 23 h.", price: 9000, photo: roomService },
          { name: "Riz gras, poulet", description: "Riz à la tomate, poulet braisé, alloco.", price: 6000, photo: rice },
          { name: "Bissap maison", description: "La carafe.", price: 2500, photo: bissap },
        ],
      },
      {
        name: "Services",
        items: [
          { name: "Blanchisserie", description: "Linge déposé avant 9 h, rendu le soir.", price: 3000 },
          { name: "Navette aéroport", description: "À réserver la veille à la réception.", price: 15000 },
          { name: "Réveil", description: "Composez le 9 depuis votre chambre.", price: null, note: "Gratuit" },
        ],
      },
    ],
  },

  residence: {
    name: "Les Cocotiers",
    description: "Le guide de votre appartement et les services de la résidence.",
    district: "Riviera Golf",
    address: "Rue des Cocotiers, Riviera Golf",
    hours: "Gardien présent jour et nuit",
    cover: livingRoom,
    tableLabel: "Appartement B2",
    categories: [
      {
        name: "Le guide",
        items: [
          { name: "Wi-Fi", description: "Réseau « Cocotiers ». Le code est affiché dans l'entrée.", price: null, note: "Inclus" },
          { name: "Arrivée et départ", description: "Les clés se prennent et se rendent chez le gardien.", price: null, note: "14 h / 11 h" },
          { name: "Électricité", description: "Le compteur est prépayé : prévenez-nous avant qu'il ne s'arrête.", price: null, note: "Incluse" },
        ],
      },
      {
        name: "Services",
        items: [
          { name: "Ménage", description: "Passage dans la journée, draps et serviettes changés.", price: 5000, photo: livingRoom },
          { name: "Petit-déjeuner", description: "Livré à l'appartement entre 7 h et 10 h.", price: 4000, photo: hotelTray },
          { name: "Navette aéroport", description: "À réserver la veille.", price: 15000 },
          { name: "Blanchisserie", description: "Le sac, rendu sous 24 heures.", price: 3000 },
        ],
      },
      {
        name: "Bon à savoir",
        items: [
          { name: "Gardien", description: "À l'entrée de la résidence.", price: null, note: "24 h sur 24" },
          { name: "Parking", description: "Une place par appartement, dans la cour.", price: null, note: "Inclus" },
        ],
      },
    ],
  },
};

/** Une photo du dépôt, réduite par le serveur à la largeur voulue. */
function resized(image: StaticImageData, width: 640 | 1200): string {
  return `/_next/image?url=${encodeURIComponent(image.src)}&w=${width}&q=75`;
}

/** Les données d'un établissement d'exemple, telles qu'un modèle les reçoit. */
export function sampleData(type: EstablishmentType, options: { withTable?: boolean } = {}): TemplateData {
  return buildSample(SAMPLES[type], type, options);
}

/** Transforme une maison d'exemple en données de modèle. Sert aussi aux maisons d'aperçu (showcases.ts). */
export function buildSample(sample: Sample, type: EstablishmentType, options: { withTable?: boolean } = {}): TemplateData {
  return {
    name: sample.name,
    type,
    typeLabel: TYPE_LABELS[type].fr,
    description: sample.description,
    district: sample.district,
    city: "Abidjan",
    address: sample.address,
    hours: sample.hours,
    phone: "2250700000000",
    whatsapp: "2250700000000",
    logoUrl: null,
    coverUrl: resized(sample.cover, 1200),
    tableLabel: options.withTable ? sample.tableLabel : null,
    languageSwitch: null,
    labels: LABELS.fr,
    categories: sample.categories.map((category, categoryIndex) => ({
      id: `s${categoryIndex}`,
      name: category.name,
      items: category.items.map(
        (item, itemIndex): TemplateItem => ({
          id: `s${categoryIndex}-${itemIndex}`,
          name: item.name,
          description: item.description,
          price: item.price,
          note: item.note ?? "",
          photo: item.photo ? { thumb: resized(item.photo, 640), large: resized(item.photo, 1200) } : null,
          available: !item.soldOut,
        }),
      ),
    })),
  };
}

/** La carte d'exemple d'un type d'établissement, sans photos : le point de départ proposé au gérant. */
export function sampleMenu(type: EstablishmentType) {
  return SAMPLES[type].categories.map((category) => ({
    category: category.name,
    items: category.items.map((item) => ({
      name: item.name,
      description: item.description,
      price: item.price,
      note: item.note,
    })),
  }));
}
