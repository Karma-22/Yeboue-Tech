import type { StaticImageData } from "next/image";
import type { SolutionId } from "@/i18n/config";
import barman from "@/assets/photos/bar-barman.jpg";
import cocktails from "@/assets/photos/bar-cocktails.jpg";
import bar from "@/assets/photos/bar-lounge.jpg";
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
import qrTable from "@/assets/photos/qr-table.jpg";
import livingRoom from "@/assets/photos/residence-salon.jpg";
import restaurant from "@/assets/photos/restaurant-service.jpg";

/** Les images d'un type d'établissement : sa carte, sa page et les écrans de son téléphone. */
export interface SolutionMedia {
  /** La photo de la carte « Pour qui ». */
  card: StaticImageData;
  /** La grande photo en haut de sa page. */
  hero: StaticImageData;
  /** Ce que vise l'appareil photo à l'étape du scan. */
  scan: StaticImageData;
  /** Le bandeau en haut de la liste. */
  cover: StaticImageData;
  /** Une vignette par ligne de la liste, dans l'ordre des textes ; `null` pour une ligne sans photo. */
  items: (StaticImageData | null)[];
  /** La grande photo de la fiche ouverte. */
  detail: StaticImageData;
}

export const SOLUTION_MEDIA: Record<SolutionId, SolutionMedia> = {
  restaurants: {
    card: restaurant,
    hero: restaurant,
    scan: qrTable,
    cover: restaurant,
    items: [rice, foutou, skewers, bissap],
    detail: rice,
  },
  maquis: {
    card: grill,
    hero: grill,
    scan: qrTable,
    cover: grill,
    items: [grill, skewers, alloco, bissap],
    detail: skewers,
  },
  "bars-lounges": {
    card: bar,
    hero: barman,
    scan: qrTable,
    cover: bar,
    items: [greenCocktail, redCocktail, cocktails, alloco],
    detail: redCocktail,
  },
  hotels: {
    card: hotelRoom,
    hero: roomService,
    scan: qrTable,
    cover: hotelRoom,
    items: [null, hotelTray, roomService, null],
    detail: roomService,
  },
  residences: {
    card: livingRoom,
    hero: livingRoom,
    scan: qrTable,
    cover: livingRoom,
    items: [null, null, hotelTray, null],
    detail: livingRoom,
  },
};
