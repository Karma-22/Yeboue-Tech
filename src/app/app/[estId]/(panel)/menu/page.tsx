import type { Metadata } from "next";
import { MenuEditor } from "@/components/dashboard/menu-editor";
import { PageHeader } from "@/components/dashboard/page-header";
import { can } from "@/lib/auth/permissions";
import { requireAccess } from "@/lib/auth/session";
import { panelState } from "@/lib/billing/panel";
import { getMenu } from "@/lib/db/menu";

export const metadata: Metadata = { title: "Carte" };

export default async function MenuPage({ params }: PageProps<"/app/[estId]/menu">) {
  const { estId } = await params;
  const { establishment, member } = await requireAccess(estId, "items.toggle");
  const { editable } = panelState(establishment);
  const canEdit = editable && can(member.role, "menu.edit");
  const service = establishment.type === "hotel" || establishment.type === "residence";

  return (
    <>
      <PageHeader
        title={service ? "Vos services" : "Votre carte"}
        description={
          canEdit
            ? "Chaque changement est en ligne tout de suite. L'interrupteur met un article en rupture : il reste affiché, grisé."
            : "L'interrupteur met un article en rupture, ou le remet en vente."
        }
      />
      {canEdit && (
        <details className="mb-6 rounded-lg border border-line bg-surface-raised px-5 py-4">
          <summary className="cursor-pointer font-semibold">Réussir vos photos, en trois gestes</summary>
          <ol className="mt-3 grid gap-2 text-fg-muted">
            <li>
              <strong className="text-fg">1. La lumière du jour.</strong> Près d&apos;une fenêtre ou dehors, jamais avec le
              flash : il aplatit les couleurs.
            </li>
            <li>
              <strong className="text-fg">2. L&apos;assiette entière.</strong> Prenez-la de dessus ou de trois quarts, sans
              la couper, en tenant le téléphone bien droit.
            </li>
            <li>
              <strong className="text-fg">3. Un fond simple.</strong> La table propre, rien autour : c&apos;est le plat
              qu&apos;on regarde.
            </li>
          </ol>
        </details>
      )}
      <MenuEditor
        establishmentId={estId}
        {...await getMenu(estId)}
        canEdit={canEdit}
        canToggle={editable}
        english={establishment.english}
        itemWord={service ? "service" : "article"}
      />
    </>
  );
}
