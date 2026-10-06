import type { Metadata } from "next";
import { InformationForm } from "@/components/dashboard/forms";
import { PageHeader, Section } from "@/components/dashboard/page-header";
import { siteHost } from "@/config/site";
import { requireAccess } from "@/lib/auth/session";
import { panelState } from "@/lib/billing/panel";

export const metadata: Metadata = { title: "Informations" };

export default async function InformationPage({ params }: PageProps<"/app/[estId]/informations">) {
  const { estId } = await params;
  const { establishment } = await requireAccess(estId, "page.edit");
  const { editable } = panelState(establishment);

  return (
    <>
      <PageHeader title="Informations" description="Ce que vos clients lisent en haut et en bas de votre page." />
      <div className="grid gap-6">
        <Section title="Votre établissement">
          {editable ? (
            <InformationForm establishment={establishment} />
          ) : (
            <p className="text-fg-muted">Ces informations ne se modifient plus tant que l&apos;abonnement n&apos;est pas renouvelé.</p>
          )}
        </Section>
        <Section
          title="L'adresse de votre page"
          description="Elle est imprimée dans votre QR Code : elle ne change jamais, même si vous renommez l'établissement."
        >
          <p className="font-display text-lg font-bold">
            {siteHost}/{establishment.slug}
          </p>
        </Section>
      </div>
    </>
  );
}
