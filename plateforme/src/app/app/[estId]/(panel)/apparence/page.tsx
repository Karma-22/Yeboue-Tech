import type { Metadata } from "next";
import { AppearanceEditor } from "@/components/dashboard/appearance-editor";
import { PageHeader } from "@/components/dashboard/page-header";
import { requireAccess } from "@/lib/auth/session";
import { panelState } from "@/lib/billing/panel";

export const metadata: Metadata = { title: "Apparence" };

export default async function AppearancePage({ params }: PageProps<"/app/[estId]/apparence">) {
  const { estId } = await params;
  const { establishment } = await requireAccess(estId, "page.edit");
  const { editable } = panelState(establishment);

  return (
    <>
      <PageHeader title="Apparence" description="Le modèle, la couleur et les images de votre page. Votre carte, elle, ne bouge pas." />
      {editable ? (
        <AppearanceEditor
          establishmentId={estId}
          type={establishment.type}
          template={establishment.template}
          accentColor={establishment.accentColor}
          logoUrl={establishment.logoUrl}
          coverUrl={establishment.coverUrl}
          submitLabel="Enregistrer"
        />
      ) : (
        <p className="rounded-md bg-surface-sunken px-4 py-3 text-fg-muted">
          L&apos;apparence ne se modifie plus tant que l&apos;abonnement n&apos;est pas renouvelé.
        </p>
      )}
    </>
  );
}
