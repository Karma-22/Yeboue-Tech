import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EstablishmentView } from "@/components/public/establishment-view";
import { loadPublicPage } from "@/lib/public/load";
import { TYPE_LABELS } from "@/templates/types";

/* La page d'un établissement (ARCHITECTURE.md §4) : celle qu'ouvre son QR Code général. */

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const page = await loadPublicPage((await params).slug);
  if (!page) return {};
  const { establishment } = page;
  const place = [establishment.district, establishment.city].filter(Boolean).join(", ");
  return {
    // Le nom du lieu, seul : c'est sa page, pas celle de la plateforme.
    title: { absolute: establishment.name },
    description: establishment.description || `${TYPE_LABELS[establishment.type].fr} — ${place}. La carte en ligne.`,
    robots: establishment.published ? undefined : { index: false },
  };
}

export default async function EstablishmentPage({ params, searchParams }: PageProps<"/[slug]">) {
  const [{ slug }, { lang }] = await Promise.all([params, searchParams]);
  const page = await loadPublicPage(slug);
  if (!page) notFound();
  return <EstablishmentView page={page} table={null} lang={lang === "en" ? "en" : "fr"} />;
}
