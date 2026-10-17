import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { EstablishmentView } from "@/components/public/establishment-view";
import { loadPublicPage } from "@/lib/public/load";

 
export async function generateMetadata({ params }: PageProps<"/[slug]/t/[number]">): Promise<Metadata> {
  const page = await loadPublicPage((await params).slug);
  // Une adresse par table : inutile que les moteurs de recherche les retiennent toutes.
  return page ? { title: { absolute: page.establishment.name }, robots: { index: false } } : {};
}

export default async function TablePage({ params, searchParams }: PageProps<"/[slug]/t/[number]">) {
  const [{ slug, number }, { lang }] = await Promise.all([params, searchParams]);
  const page = await loadPublicPage(slug);
  if (!page) notFound();

  const table = page.tables.find((entry) => String(entry.number) === number);
  // Une table supprimée : son QR Code mène encore à la carte, sans la commande sur place.
  if (!table) redirect(`/${page.establishment.slug}`);
  return <EstablishmentView page={page} table={table} lang={lang === "en" ? "en" : "fr"} />;
}
