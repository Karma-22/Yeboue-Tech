import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isReservedSlug } from "./reserved-slugs";

const appDir = path.resolve(import.meta.dirname, "../app");

/**
 * Le premier segment d'adresse de chaque page de la plateforme, lu dans
 * src/app. Les groupes « (nom) » n'apparaissent pas dans l'adresse : on y
 * descend. Les dossiers dynamiques « [slug] » et privés « _nom » sont ignorés.
 */
function topLevelSegments(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      if (entry.name.startsWith("(")) return topLevelSegments(path.join(dir, entry.name));
      if (entry.name.startsWith("[") || entry.name.startsWith("_")) return [];
      return [entry.name];
    });
}

describe("isReservedSlug", () => {
  it("réserve les pages de la plateforme", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("tarifs")).toBe(true);
  });

  it("ignore la casse et les espaces autour", () => {
    expect(isReservedSlug("  Admin ")).toBe(true);
  });

  it("laisse libres les noms d'établissement", () => {
    expect(isReservedSlug("chez-ali")).toBe(false);
    expect(isReservedSlug("maquis-chez-tantie")).toBe(false);
  });

  // Sans cela, un établissement pourrait choisir l'adresse d'une page ajoutée
  // plus tard, et sa propre page deviendrait inaccessible.
  it("couvre tous les dossiers de pages présents dans src/app", () => {
    const segments = topLevelSegments(appDir);
    expect(segments.length).toBeGreaterThan(0);
    const missing = segments.filter((segment) => !isReservedSlug(segment));
    expect(missing).toEqual([]);
  });
});
