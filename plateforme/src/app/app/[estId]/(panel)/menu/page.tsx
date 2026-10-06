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
