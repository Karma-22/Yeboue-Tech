import type { TemplateId } from "@/config/templates";
import { Ardoise } from "./ardoise";
import { Braise } from "./braise";
import { Carnet } from "./carnet";
import { Comptoir } from "./comptoir";
import { Epure } from "./epure";
import { Magazine } from "./magazine";
import { Marche } from "./marche";
import { Palace } from "./palace";
import { TableDhote } from "./table-dhote";
import type { Template } from "./types";
import { Vitrine } from "./vitrine";

/** Le registre des modèles (ARCHITECTURE.md §10) : ajouter un modèle, c'est ajouter une ligne ici. */
export const TEMPLATE_COMPONENTS: Record<TemplateId, Template> = {
  braise: Braise,
  ardoise: Ardoise,
  "table-dhote": TableDhote,
  comptoir: Comptoir,
  palace: Palace,
  magazine: Magazine,
  epure: Epure,
  marche: Marche,
  carnet: Carnet,
  vitrine: Vitrine,
};
