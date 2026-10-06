import type { Metadata } from "next";
import { Star } from "lucide-react";
import { PageHeader, Section } from "@/components/dashboard/page-header";
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

/** Un diagramme en bâtons, un bâton par jour. Le tableau des mêmes chiffres suit, pour qui ne voit pas le dessin. */
function Bars({ stats, value, format, label }: { stats: DayStats[]; value: (day: DayStats) => number; format: (amount: number) => string; label: string }) {
  const max = Math.max(1, ...stats.map(value));
  return (
    <figure>
      <div role="img" aria-label={`${label}, jour par jour, sur ${stats.length} jours`} className="flex h-40 items-end gap-[3px]">
        {stats.map((day) => {
          const amount = value(day);
          return (
            <div
              key={day.date}
              title={`${dayLabel(day.date)} : ${format(amount)}`}
              style={{ height: `${Math.max(amount > 0 ? 4 : 1, (amount / max) * 100)}%` }}
              className={cn("flex-1 rounded-t-[3px]", amount > 0 ? "bg-fg" : "bg-line")}
            />
          );
        })}
      </div>
      <figcaption className="mt-2 flex justify-between text-xs text-fg-subtle tabular-nums">
        <span>{dayLabel(stats[0].date)}</span>
        <span>Aujourd&apos;hui</span>
      </figcaption>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-semibold text-fg-muted">Voir les chiffres</summary>
        <table className="mt-2 w-full max-w-xs tabular-nums">
          <tbody>
            {[...stats].reverse().map((day) => (
              <tr key={day.date} className="border-b border-line last:border-b-0">
                <th scope="row" className="py-1.5 text-left font-normal text-fg-muted">
                  {dayLabel(day.date)}
                </th>
                <td className="py-1.5 text-right font-semibold">{format(value(day))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

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
            <div key={figure.label} className="rounded-lg border border-line bg-surface-raised p-5">
              <p className="text-sm text-fg-muted">{figure.label}</p>
              <p className="mt-1 font-display text-3xl font-bold tabular-nums">{figure.value}</p>
            </div>
          ))}
        </div>

        <Section title="Scans de votre QR Code" description="Chaque client qui ouvre votre carte compte une fois par visite.">
          <Bars stats={stats} value={(day) => day.scans} format={String} label="Scans" />
        </Section>

        <Section
          title="Ventes sur place"
          description={panel.features.salesStats ? `${formatPrice(sum(stats, "revenue"))} sur ${DAYS} jours, commandes refusées ou annulées déduites.` : upgrade}
        >
          {panel.features.salesStats ? (
            <Bars stats={stats} value={(day) => day.revenue} format={(amount) => formatPrice(amount)} label="Ventes" />
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
