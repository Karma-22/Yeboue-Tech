import { describe, expect, it } from "vitest";
import { SOLUTION_MEDIA } from "@/components/marketing/solution-media";
import { localeOfPath, localePath, SOLUTION_IDS, switchLocalePath } from "./config";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import { frenchSpaces } from "./typography";

/** La forme d'une valeur : ses clés, et la longueur de ses listes, sans les textes. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, item]) => [key, shape(item)]),
    );
  }
  return typeof value;
}

describe("adresses par langue", () => {
  it("laisse le français à la racine et met l'anglais sous /en", () => {
    expect(localePath("fr")).toBe("/");
    expect(localePath("en")).toBe("/en");
    expect(localePath("fr", "/solutions/hotels")).toBe("/solutions/hotels");
    expect(localePath("en", "/solutions/hotels")).toBe("/en/solutions/hotels");
  });

  it("reconnaît la langue d'une adresse", () => {
    expect(localeOfPath("/")).toBe("fr");
    expect(localeOfPath("/en")).toBe("en");
    expect(localeOfPath("/en/solutions/hotels")).toBe("en");
    // Un établissement dont l'adresse commence par « en » reste en français.
    expect(localeOfPath("/entre-amis")).toBe("fr");
  });

  it("trouve la même page dans l'autre langue", () => {
    expect(switchLocalePath("/", "en")).toBe("/en");
    expect(switchLocalePath("/en", "fr")).toBe("/");
    expect(switchLocalePath("/solutions/maquis", "en")).toBe("/en/solutions/maquis");
    expect(switchLocalePath("/en/solutions/maquis", "fr")).toBe("/solutions/maquis");
    expect(switchLocalePath("/entre-amis", "en")).toBe("/en/entre-amis");
  });
});

describe("typographie française", () => {
  it("rend insécable l'espace avant la ponctuation haute", () => {
    expect(frenchSpaces("Est-ce pour moi ?")).toBe("Est-ce pour moi ?");
    expect(frenchSpaces("Total : 500 F")).toBe("Total : 500 F");
    expect(frenchSpaces("« Nouvelle »")).toBe("« Nouvelle »");
  });

  it("ne touche pas au reste", () => {
    expect(frenchSpaces("https://exemple.ci")).toBe("https://exemple.ci");
    expect(frenchSpaces("De 6 h 30 à 10 h 30")).toBe("De 6 h 30 à 10 h 30");
  });
});

describe("dictionnaires", () => {
  // TypeScript vérifie les champs, pas la longueur des listes : un écran anglais
  // avec une ligne de moins décalerait les photos.
  it("ont la même forme en français et en anglais", () => {
    expect(shape(en)).toEqual(shape(fr));
  });

  it.each(SOLUTION_IDS)("%s : une photo (ou un vide) par ligne de la liste, quatre étapes", (id) => {
    for (const dictionary of [fr, en]) {
      const copy = dictionary.solutions[id];
      expect(copy.screens.list.items).toHaveLength(SOLUTION_MEDIA[id].items.length);
      expect(copy.steps).toHaveLength(4);
    }
  });

  it("propose un texte de titre par type montré en haut de page", () => {
    expect(fr.hero.rotating).toHaveLength(4);
  });
});
