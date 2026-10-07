import type { Metadata } from "next";
import { Star } from "lucide-react";
import { BarChart } from "@/components/dashboard/bar-chart";
import { PageHeader, Section, StatTile } from "@/components/dashboard/page-header";
import { PLANS } from "@/config/plans";
import { requireAccess } from "@/lib/auth/session";
import { panelState } from "@/lib/billing/panel";
import { getStats, listReviews } from "@/lib/db/orders";
import type { DayStats } from "@/lib/db/types";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Statistiques" };

const DAYS = 30;
const dayLabel = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
const sum = (stats: DayStats[], key: "scans" | "orders" | "revenue" | "whatsappOrders") =>
  stats.reduce((total, day) => total + day[key], 0);

const toPoints = (stats: DayStats[], key: "scans" | "revenue") =>
  stats.map((day) => ({ key: day.date, label: dayLabel(day.date), value: day[key] }));

export default async function StatsPage({ params }: PageProps<"/app/[estId]/statistiques">) {
  const { estId } = await params;
  const { establishment } = await requireAccess(estId, "stats.view");
  const panel = panelState(establishment);
  const [stats, reviews] = await Promise.all([
    getStats(estId, DAYS),
    panel.features.reviews ? listReviews(estId, 20) : Promise.resolve([]),
  ]);
  const week = stats.slice(-7);
  const average = reviews.length ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length : 0;
  const upgrade = `Avec l'offre « ${PLANS.menu_orders.name} ».`;

  return (
    <>
      <PageHeader title="Statistiques" description={`Les ${DAYS} derniers jours.`} />
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Scans, 7 jours", value: String(sum(week, "scans")) },
            { label: `Scans, ${DAYS} jours`, value: String(sum(stats, "scans")) },
            { label: "Commandes WhatsApp", value: String(sum(stats, "whatsappOrders")) },
            { label: "Commandes sur place", value: panel.features.salesStats ? String(sum(stats, "orders")) : "—" },
          ].map((figure) => (
            <StatTile key={figure.label} {...figure} />
          ))}
        </div>

        <Section title="Scans de votre QR Code" description="Chaque client qui ouvre votre carte compte une fois par visite.">
          <BarChart label="Scans" points={toPoints(stats, "scans")} format="count" />
        </Section>

        <Section
          title="Ventes sur place"
          description={panel.features.salesStats ? `${formatPrice(sum(stats, "revenue"))} sur ${DAYS} jours, commandes refusées ou annulées déduites.` : upgrade}
        >
          {panel.features.salesStats ? (
            <BarChart label="Ventes sur place" points={toPoints(stats, "revenue")} format="price" />
          ) : (
            <p className="text-fg-muted">Le chiffre de chaque jour, calculé à partir des commandes passées depuis les tables.</p>
          )}
        </Section>

        <Section
          title="Avis des clients"
          description={
            !panel.features.reviews
              ? upgrade
              : reviews.length
                ? `${average.toFixed(1).replace(".", ",")} sur 5, sur les ${reviews.length} derniers avis.`
                : "Après chaque commande servie, le client peut laisser une note. Aucune pour l'instant."
          }
        >
          <ul className="grid gap-4">
            {reviews.map((review) => (
              <li key={review.id} className="border-b border-line pb-4 last:border-b-0 last:pb-0">
                <p className="flex items-center gap-0.5" aria-label={`${review.rating} sur 5`}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      aria-hidden="true"
                      className={cn("size-4", value <= review.rating ? "fill-warning text-warning" : "text-line-strong")}
                    />
                  ))}
                  <span className="ml-2 text-xs text-fg-subtle">{new Date(review.createdAt).toLocaleDateString("fr-FR")}</span>
                </p>
                {review.comment && <p className="mt-1.5">{review.comment}</p>}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </>
  );
}
