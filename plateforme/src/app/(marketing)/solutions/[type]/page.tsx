import { notFound } from "next/navigation";
import { SolutionPage } from "@/components/marketing/solution-page";
import { isSolutionId, SOLUTION_IDS } from "@/i18n";
import { solutionMetadata } from "@/i18n/metadata";

/** Une page par type d'établissement ; toute autre adresse est introuvable. */
export const dynamicParams = false;

export function generateStaticParams() {
  return SOLUTION_IDS.map((type) => ({ type }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[type]">) {
  const { type } = await params;
  return isSolutionId(type) ? solutionMetadata("fr", type) : {};
}

export default async function Page({ params }: PageProps<"/solutions/[type]">) {
  const { type } = await params;
  if (!isSolutionId(type)) notFound();
  return <SolutionPage locale="fr" id={type} />;
}
