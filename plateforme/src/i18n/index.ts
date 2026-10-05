import type { Locale } from "./config";
import { en } from "./dictionaries/en";
import { fr } from "./dictionaries/fr";
import type { Dictionary } from "./types";

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en };

/** Les textes du site vitrine dans une langue. */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary } from "./types";
export * from "./config";
