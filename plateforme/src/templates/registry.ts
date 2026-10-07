import type { TemplateId } from "@/config/templates";
import type { Template } from "./types";

/*
 * Le registre des modèles (ARCHITECTURE.md §10) : ajouter un modèle, c'est
 * ajouter une ligne ici, et sa fiche dans src/config/templates.ts.
 *
 * Chaque modèle n'est chargé que lorsqu'une page le demande : le serveur ne lit
 * pas les quatre-vingts pour en afficher un.
 */
const LOADERS: Record<TemplateId, () => Promise<Template>> = {
  braise: () => import("./braise").then((module) => module.Braise),
  ardoise: () => import("./ardoise").then((module) => module.Ardoise),
  "table-dhote": () => import("./table-dhote").then((module) => module.TableDhote),
  comptoir: () => import("./comptoir").then((module) => module.Comptoir),
  palace: () => import("./palace").then((module) => module.Palace),
  magazine: () => import("./magazine").then((module) => module.Magazine),
  epure: () => import("./epure").then((module) => module.Epure),
  marche: () => import("./marche").then((module) => module.Marche),
  carnet: () => import("./carnet").then((module) => module.Carnet),
  vitrine: () => import("./vitrine").then((module) => module.Vitrine),
  gbaka: () => import("./gbaka").then((module) => module.Gbaka),
  enseigne: () => import("./enseigne").then((module) => module.Enseigne),
  pagne: () => import("./pagne").then((module) => module.Pagne),
  garba: () => import("./garba").then((module) => module.Garba),
  guirlande: () => import("./guirlande").then((module) => module.Guirlande),
};

export function loadTemplate(id: TemplateId): Promise<Template> {
  return LOADERS[id]();
}
