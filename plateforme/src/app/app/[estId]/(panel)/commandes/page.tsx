import type { Metadata } from "next";
import Link from "next/link";
import { OrdersBoard } from "@/components/dashboard/orders-board";
import { PageHeader } from "@/components/dashboard/page-header";
import { buttonStyles } from "@/components/ui/button";
import { PLANS } from "@/config/plans";
import { can } from "@/lib/auth/permissions";
import { requireAccess } from "@/lib/auth/session";
import { panelState } from "@/lib/billing/panel";
import { listOrdersSince } from "@/lib/db/orders";

export const metadata: Metadata = { title: "Commandes" };

/** On suit le service en cours : ce qui a été commandé depuis dix-huit heures. */
const SERVICE_MS = 18 * 60 * 60 * 1000;

async function currentService(establishmentId: string) {
  const since = Date.now() - SERVICE_MS;
  return { since, orders: await listOrdersSince(establishmentId, since) };
}

export default async function OrdersPage({ params }: PageProps<"/app/[estId]/commandes">) {
  const { estId } = await params;
  const { establishment, member } = await requireAccess(estId, "orders.handle");
  const panel = panelState(establishment);

  if (!panel.features.dineInOrders) {
    return (
      <>
        <PageHeader title="Commandes" />
        <div className="rounded-lg border border-dashed border-line-strong p-8 text-center">
          <p className="font-display text-xl font-bold">La commande sur place n&apos;est pas ouverte.</p>
          <p className="mx-auto mt-2 max-w-md text-fg-muted">
            Elle fait partie de l&apos;offre « {PLANS.menu_orders.name} » : vos clients commandent depuis leur table, et
            la commande arrive ici, en direct. Les commandes à emporter, elles, vous arrivent sur WhatsApp.
          </p>
          {can(member.role, "billing.manage") && (
            <Link href={`/app/${estId}/abonnement`} className={buttonStyles({ className: "mt-6" })}>
              Voir les offres
            </Link>
          )}
        </div>
      </>
    );
  }

  const { since, orders } = await currentService(estId);
  return (
    <>
      <PageHeader title="Commandes" description="Gardez cette page ouverte pendant le service : les commandes s'y affichent toutes seules." />
      <OrdersBoard establishmentId={estId} initial={orders} since={since} />
    </>
  );
}
