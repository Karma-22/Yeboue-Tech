import type { TemplateId } from "@/config/templates";
import type { EstablishmentType } from "@/lib/db/types";
import beerCold from "@/assets/photos/boisson-biere-fraiche.jpg";
import beers from "@/assets/photos/boisson-bieres.jpg";
import bissap from "@/assets/photos/boisson-bissap.jpg";
import pineappleJuice from "@/assets/photos/boisson-jus-ananas.jpg";
import bottledJuice from "@/assets/photos/boisson-jus-bouteilles.jpg";
import orangeJuice from "@/assets/photos/boisson-jus-orange.jpg";
import nightGrill from "@/assets/photos/grillade-nuit.jpg";
import chickens from "@/assets/photos/grillade-poulets.jpg";
import grill from "@/assets/photos/maquis-poisson-braise.jpg";
import alloco from "@/assets/photos/plat-alloco.jpg";
import beignets from "@/assets/photos/plat-beignets-bouillie.jpg";
import skewers from "@/assets/photos/plat-brochettes.jpg";
import chickenSkewers from "@/assets/photos/plat-brochettes-poulet.jpg";
import beefSkewers from "@/assets/photos/plat-brochettes-viande.jpg";
import foutou from "@/assets/photos/plat-foutou.jpg";
import corn from "@/assets/photos/plat-mais-braise.jpg";
import omelette from "@/assets/photos/plat-omelette.jpg";
import friedFish from "@/assets/photos/plat-poisson-frit.jpg";
import chicken from "@/assets/photos/plat-poulet-braise.jpg";
import rice from "@/assets/photos/plat-riz-gras.jpg";
import leafSauce from "@/assets/photos/plat-sauce-feuille.jpg";
import spaghetti from "@/assets/photos/plat-spaghetti.jpg";
import smallFry from "@/assets/photos/snack-friture.jpg";
import veggieSandwich from "@/assets/photos/snack-sandwich-crudites.jpg";
import spread from "@/assets/photos/table-plats-du-pays.jpg";
import { buildSample, sampleData, type Sample } from "./sample";
import type { TemplateData } from "./types";

/*
 * Les maisons d'aperçu : des établissements inventés, un par modèle ou presque,
 * pour que les quatre-vingts aperçus ne montrent pas tous la même carte. Elles
 * ne servent qu'à /apercu et aux vignettes ; la création guidée part toujours
 * des cinq établissements de sample.ts.
 *
 * Ce ne sont pas des clients : les noms sont inventés, les photos viennent de
 * banques libres (src/assets/photos/SOURCES.md).
 */

interface Showcase extends Sample {
  type: EstablishmentType;
}

const SHOWCASES = {
  terminus: {
    type: "maquis",
    name: "Le Terminus",
    description: "Au bout de la ligne : on descend du gbaka, on s'assoit, et le poulet est déjà sur la braise.",
    district: "Yopougon",
    address: "Carrefour Siporex, Yopougon",
    hours: "Tous les jours, 10 h – minuit",
    cover: chickens,
    tableLabel: "Table 9",
    categories: [
      {
        name: "Sur la braise",
        items: [
          { name: "Poulet braisé", description: "Le demi, piqué à l'ail et au piment.", price: 4500, photo: chicken },
          { name: "Poisson braisé", description: "Carpe ou capitaine, selon l'arrivage du matin.", price: 5000, photo: grill },
          { name: "Brochettes de bœuf", description: "Les quatre, oignons et kankankan.", price: 3000, photo: beefSkewers },
          { name: "Pintade braisée", description: "Entière, à commander une heure avant.", price: 9000, soldOut: true },
        ],
      },
      {
        name: "Pour accompagner",
        items: [
          { name: "Alloco", description: "La grande assiette.", price: 1000, photo: alloco },
          { name: "Riz gras", description: "À la tomate, bien relevé.", price: 2000, photo: rice },
          { name: "Attiéké", description: "La boule, avec oignons et tomates.", price: 500 },
          { name: "Frites d'igname", description: "Coupées à la main.", price: 1000 },
        ],
      },
      {
        name: "Pour la soif",
        items: [
          { name: "Bière 66 cl", description: "Sortie du congélateur.", price: 1000, photo: beers },
          { name: "Bissap glacé", description: "Le grand verre.", price: 500, photo: bissap },
          { name: "Jus de passion", description: "Pressé sur place.", price: 700 },
          { name: "Eau minérale", description: "La bouteille d'un litre et demi.", price: 600 },
        ],
      },
    ],
  },

  awa: {
    type: "maquis",
    name: "Chez Awa",
    description: "Poulet, poisson, alloco : tout passe sur le feu devant vous. La sauce piment est faite maison.",
    district: "Marcory",
    address: "Rue de la Paix, Marcory",
    hours: "Du lundi au samedi, 11 h – 23 h",
    cover: skewers,
    tableLabel: "Table 3",
    categories: [
      {
        name: "Spécialités",
        items: [
          { name: "Brochettes d'Awa", description: "Poulet mariné la veille, grillé au charbon.", price: 3500, photo: chickenSkewers },
          { name: "Poisson frit", description: "Avec oignons, tomates et citron.", price: 4000, photo: friedFish },
          { name: "Soupe de poisson", description: "Pimentée, à boire chaude.", price: 3000 },
          { name: "Plateau de la maison", description: "Poisson, poulet, brochettes, alloco. Pour quatre.", price: 15000 },
        ],
      },
      {
        name: "Garnitures",
        items: [
          { name: "Alloco", description: "Banane bien mûre, frite à la commande.", price: 1000, photo: alloco },
          { name: "Maïs braisé", description: "L'épi, grillé sur la braise.", price: 300, photo: corn },
          { name: "Attiéké", description: "La boule.", price: 500 },
          { name: "Igname bouillie", description: "Avec la sauce piment.", price: 1000, soldOut: true },
        ],
      },
      {
        name: "Boissons",
        items: [
          { name: "Jus d'ananas", description: "Pressé à la demande.", price: 700, photo: pineappleJuice },
          { name: "Gnamakoudji", description: "Gingembre et citron. Le verre.", price: 500 },
          { name: "Sucrerie", description: "La bouteille.", price: 500 },
        ],
      },
    ],
  },

  akissi: {
    type: "restaurant",
    name: "Maman Akissi",
    description: "Les sauces du pays, mijotées depuis l'aube. On vient pour le foutou, on revient pour la sauce graine.",
    district: "Treichville",
    address: "Avenue 16, Treichville",
    hours: "Du lundi au samedi, 11 h – 16 h",
    cover: spread,
    tableLabel: "Table 5",
    categories: [
      {
        name: "Les sauces",
        items: [
          { name: "Foutou, sauce graine", description: "Foutou banane, sauce graine au poisson fumé et au crabe.", price: 3500, photo: foutou },
          { name: "Riz, sauce feuille", description: "Feuilles de patate, viande de bœuf.", price: 3000, photo: leafSauce },
          { name: "Placali, sauce gombo", description: "Gombo frais, poisson fumé.", price: 3000 },
          { name: "Kedjenou de poulet", description: "Cuit à l'étouffée dans son canari.", price: 4500, soldOut: true },
        ],
      },
      {
        name: "Les plats du jour",
        items: [
          { name: "Riz gras", description: "Riz à la tomate, légumes et poulet.", price: 3000, photo: rice },
          { name: "Poisson braisé, attiéké", description: "La carpe entière.", price: 5000, photo: grill },
          { name: "Alloco, œuf", description: "Banane frite et œuf dur.", price: 1500, photo: alloco },
        ],
      },
      {
        name: "Jus de la maison",
        items: [
          { name: "Bissap", description: "À la menthe.", price: 500, photo: bissap },
          { name: "Jus d'orange", description: "Pressé du matin.", price: 700, photo: orangeJuice },
          { name: "Gnamakoudji", description: "Gingembre pressé.", price: 500 },
          { name: "Jus de baobab", description: "Le bouye, bien frais.", price: 700 },
        ],
      },
    ],
  },

  carrefour: {
    type: "maquis",
    name: "Garba du Carrefour",
    description: "Attiéké, thon frit, piment : le garba comme on l'aime, servi dès 7 heures.",
    district: "Adjamé",
    address: "Carrefour Liberté, Adjamé",
    hours: "Tous les jours, 7 h – 17 h",
    cover: friedFish,
    tableLabel: "Banc 2",
    categories: [
      {
        name: "Le garba",
        items: [
          { name: "Garba simple", description: "Attiéké et un morceau de thon.", price: 500 },
          { name: "Garba complet", description: "Deux morceaux, oignons, tomates, piment.", price: 1000 },
          { name: "Garba royal", description: "Le thon entier, pour les grandes faims.", price: 2000 },
          { name: "Friture du jour", description: "Petits poissons frits, à croquer entiers.", price: 1000, photo: smallFry },
        ],
      },
      {
        name: "À côté",
        items: [
          { name: "Alloco", description: "La barquette.", price: 500, photo: alloco },
          { name: "Brochettes", description: "Les trois.", price: 1500, photo: chickenSkewers },
          { name: "Riz gras", description: "Le bol.", price: 1000, photo: rice },
          { name: "Maïs braisé", description: "L'épi.", price: 200, photo: corn },
          { name: "Œuf dur", description: "La pièce.", price: 200 },
          { name: "Supplément thon", description: "Le morceau.", price: 300, soldOut: true },
        ],
      },
      {
        name: "Boissons",
        items: [
          { name: "Jus de fruits", description: "La petite bouteille.", price: 500, photo: bottledJuice },
          { name: "Bissap", description: "Le sachet glacé.", price: 100, photo: bissap },
          { name: "Eau", description: "Le sachet.", price: 50 },
          { name: "Sucrerie", description: "La bouteille.", price: 400 },
        ],
      },
    ],
  },

  lucioles: {
    type: "maquis",
    name: "Les Lucioles",
    description: "L'allocodrome s'allume à la tombée de la nuit. Alloco, poisson, brochettes : on mange dehors, sous les ampoules.",
    district: "Cocody",
    address: "Allocodrome de Cocody",
    hours: "Tous les soirs, 18 h – 2 h",
    cover: nightGrill,
    tableLabel: "Table 14",
    categories: [
      {
        name: "Alloco",
        items: [
          { name: "Alloco simple", description: "Banane plantain frite, piment à part.", price: 1000, photo: alloco },
          { name: "Alloco poisson", description: "Avec un poisson frit.", price: 2500, photo: friedFish },
          { name: "Alloco œuf", description: "Avec deux œufs durs.", price: 1500 },
        ],
      },
      {
        name: "Grillades",
        items: [
          { name: "Poisson braisé", description: "Carpe du jour, oignons et tomates.", price: 5000, photo: grill },
          { name: "Brochettes de poulet", description: "Les quatre.", price: 3000, photo: chickenSkewers },
          { name: "Poulet braisé", description: "Le demi.", price: 4500, photo: chicken },
          { name: "Choukouya", description: "Mouton épicé. La portion.", price: 4000, soldOut: true },
        ],
      },
      {
        name: "Boissons",
        items: [
          { name: "Bière 66 cl", description: "Bien glacée.", price: 1000, photo: beerCold },
          { name: "Bissap", description: "Le verre.", price: 500, photo: bissap },
          { name: "Sucrerie", description: "La bouteille.", price: 500 },
          { name: "Eau minérale", description: "La grande bouteille.", price: 600 },
        ],
      },
    ],
  },

  mado: {
    type: "maquis",
    name: "La Cantine de Mado",
    description: "À deux pas du lycée : le petit-déjeuner dès 6 h 30, et à midi le plat chaud qui tient jusqu'au soir.",
    district: "Yopougon",
    address: "Face au lycée, Yopougon Toits-Rouges",
    hours: "Du lundi au samedi, 6 h 30 – 18 h",
    cover: beignets,
    tableLabel: "Table 4",
    categories: [
      {
        name: "Le matin",
        items: [
          { name: "Beignets et bouillie", description: "Beignets de haricot tout chauds, bouillie de mil.", price: 300, photo: beignets },
          { name: "Pain omelette", description: "Deux œufs, oignons, tomate, dans une demi-baguette.", price: 500, photo: omelette },
          { name: "Café au lait", description: "Le grand verre.", price: 200 },
          { name: "Thé citron", description: "Bien sucré.", price: 150 },
        ],
      },
      {
        name: "À midi",
        items: [
          { name: "Spaghetti sauce tomate", description: "L'assiette, avec du piment si on veut.", price: 700, photo: spaghetti },
          { name: "Sandwich crudités", description: "Baguette, tomate, salade, mayonnaise.", price: 600, photo: veggieSandwich },
          { name: "Riz gras", description: "Le bol.", price: 800, photo: rice },
          { name: "Alloco", description: "Le sachet.", price: 300, photo: alloco },
          { name: "Garba", description: "Attiéké et thon frit.", price: 500, soldOut: true },
        ],
      },
      {
        name: "Pour boire",
        items: [
          { name: "Jus de fruits", description: "La petite bouteille, orange ou ananas.", price: 200, photo: bottledJuice },
          { name: "Bissap glacé", description: "Le sachet.", price: 100 },
          { name: "Eau", description: "Le sachet.", price: 50 },
        ],
      },
    ],
  },
} satisfies Record<string, Showcase>;

type ShowcaseId = keyof typeof SHOWCASES;

/** La maison qui montre chaque modèle : une maison d'aperçu, ou l'un des cinq établissements de base. */
const HOUSE_FOR_TEMPLATE: Record<TemplateId, ShowcaseId | EstablishmentType> = {
  braise: "restaurant",
  ardoise: "maquis",
  "table-dhote": "restaurant",
  comptoir: "bar",
  palace: "hotel",
  magazine: "restaurant",
  epure: "residence",
  marche: "maquis",
  carnet: "maquis",
  vitrine: "bar",
  gbaka: "terminus",
  enseigne: "awa",
  pagne: "akissi",
  garba: "carrefour",
  guirlande: "lucioles",
  ecolier: "mado",
  stade: "maquis",
};

/**
 * Les données d'aperçu d'un modèle. `type` force l'un des cinq établissements
 * de base : c'est le réglage `?type=` de /apercu, pour voir un modèle avec une
 * carte d'hôtel ou de bar.
 */
export function previewData(
  template: TemplateId,
  type: EstablishmentType | null,
  options: { withTable?: boolean } = {},
): TemplateData {
  const house = type ?? HOUSE_FOR_TEMPLATE[template];
  if (house in SHOWCASES) {
    const showcase: Showcase = SHOWCASES[house as ShowcaseId];
    return buildSample(showcase, showcase.type, options);
  }
  return sampleData(house as EstablishmentType, options);
}
