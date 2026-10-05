import type { Metadata } from "next";
import { site } from "@/config/site";
import { getDictionary, localePath, type Locale, type SolutionId } from "./index";

/** Les deux versions d'une même page, pour que les moteurs de recherche les relient. */
function alternates(locale: Locale, path: string): Metadata["alternates"] {
  return {
    canonical: localePath(locale, path),
    languages: { fr: localePath("fr", path), en: localePath("en", path) },
  };
}

export function homeMetadata(locale: Locale): Metadata {
  const dict = getDictionary(locale);
  return {
    title: { absolute: `${site.name} — ${dict.meta.title}` },
    description: dict.meta.description,
    alternates: alternates(locale, "/"),
  };
}

export function solutionMetadata(locale: Locale, id: SolutionId): Metadata {
  const copy = getDictionary(locale).solutions[id];
  return {
    title: copy.name,
    description: copy.intro,
    alternates: alternates(locale, `/solutions/${id}`),
  };
}
