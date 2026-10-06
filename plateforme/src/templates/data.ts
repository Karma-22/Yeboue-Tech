import type { PublicPage } from "@/lib/db/public";
import type { Table } from "@/lib/db/types";
import { LABELS, TYPE_LABELS, type TemplateData } from "./types";

/** Range les données d'un établissement telles qu'un modèle les attend, dans la langue demandée. */
export function toTemplateData(
  page: PublicPage,
  options: { lang: "fr" | "en"; table: Table | null; path: string },
): TemplateData {
  const { establishment } = page;
  const english = options.lang === "en" && establishment.english;
  const lang = english ? "en" : "fr";
  const pick = (french: string, translated: string) => (english && translated ? translated : french);

  return {
    name: establishment.name,
    type: establishment.type,
    typeLabel: TYPE_LABELS[establishment.type][lang],
    description: establishment.description,
    district: establishment.district,
    city: establishment.city,
    address: establishment.address,
    hours: establishment.hours,
    phone: establishment.phone,
    whatsapp: establishment.whatsapp,
    logoUrl: establishment.logoUrl,
    coverUrl: establishment.coverUrl,
    tableLabel: options.table?.label ?? null,
    languageSwitch: establishment.english
      ? english
        ? { label: "FR", href: options.path }
        : { label: "EN", href: `${options.path}?lang=en` }
      : null,
    labels: LABELS[lang],
    categories: page.categories
      .map((category) => ({
        id: category.id,
        name: pick(category.name, category.nameEn),
        items: page.items
          .filter((item) => item.categoryId === category.id)
          .map((item) => ({
            id: item.id,
            name: pick(item.name, item.nameEn),
            description: pick(item.description, item.descriptionEn),
            price: item.price,
            note: item.note,
            photo: item.photo,
            available: item.available,
          })),
      }))
      // Une catégorie vide n'apporte rien au client.
      .filter((category) => category.items.length > 0),
  };
}
