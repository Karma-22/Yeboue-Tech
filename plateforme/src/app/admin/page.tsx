import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { PageHeader, Section, StatTile } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { panelState, STATE_LABELS } from "@/lib/billing/panel";
import { reminderLink } from "@/lib/billing/reminder";
import { listPayments } from "@/lib/db/admin";
import { listAllEstablishments } from "@/lib/db/establishments";
import { formatDate, formatPrice } from "@/lib/utils/format";

/** Ce qu'il y a à faire aujourd'hui : relancer les essais qui se terminent, voir ce qui est entré. */
async function overview() {
  const [establishments, payments] = await Promise.all([listAllEstablishments(), listPayments(500)]);
  const now = Date.now();
  const month = new Date(now).toISOString().slice(0, 7);
  const rows = establishments.map((establishment) => ({ establishment, panel: panelState(establishment) }));
  const count = (...states: string[]) => rows.filter((row) => states.includes(row.panel.state)).length;

  return {
    total: rows.length,
    trials: count("trial"),
    active: count("active"),
    expired: count("grace", "limited", "offline"),
    unfinished: count("none"),
    monthRevenue: payments
      .filter((payment) => new Date(payment.createdAt).toISOString().startsWith(month))
      .reduce((sum, payment) => sum + payment.amount, 0),
    // À relancer : ce qui se termine dans les cinq jours, et ce qui vient d'expirer.
    toRemind: rows
      .filter(({ panel }) => ((panel.state === "trial" || panel.state === "active") && panel.daysLeft <= 5) || panel.state === "grace")
      .sort((a, b) => a.panel.daysLeft - b.panel.daysLeft),
    recent: rows.slice(0, 6),
  };
}

export default async function AdminHomePage() {
  const data = await overview();
  return (
    <>
      <PageHeader title="Vue d'ensemble" description="Les chiffres viennent de la base, à l'instant." />
      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatTile label="Établissements" value={String(data.total)} hint={`dont ${data.unfinished} en cours de création`} />
          <StatTile label="Essais en cours" value={String(data.trials)} />
          <StatTile label="Abonnés" value={String(data.active)} hint={`${data.expired} expirés`} />
          <StatTile label="Encaissé ce mois-ci" value={formatPrice(data.monthRevenue)} />
        </div>

        <Section
          title="À relancer"
          description="Les essais et les abonnements qui se terminent dans les cinq jours, et ceux qui viennent d'expirer. Le bouton ouvre WhatsApp, le message déjà écrit."
        >
          {data.toRemind.length === 0 ? (
            <p className="text-fg-muted">Personne à relancer aujourd&apos;hui.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.toRemind.map(({ establishment, panel }) => {
                const link = reminderLink(establishment, panel);
                const end = establishment.subscription?.periodEndsAt ?? establishment.subscription?.trialEndsAt ?? 0;
                return (
                  <li key={establishment.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <Link href={`/admin/etablissements/${establishment.id}`} className="font-semibold underline underline-offset-4">
                        {establishment.name}
                      </Link>
                      <p className="text-sm text-fg-muted">
                        {STATE_LABELS[panel.state]} ·{" "}
                        {panel.state === "grace" ? `expiré le ${formatDate(end)}` : `se termine le ${formatDate(end)} (${panel.daysLeft} j)`}
                      </p>
                    </div>
                    {link && (
                      <a href={link} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                        <MessageCircle aria-hidden="true" className="size-4" />
                        Relancer sur WhatsApp
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Section>

        <Section title="Derniers inscrits">
          {data.recent.length === 0 ? (
            <p className="text-fg-muted">Aucun établissement pour l&apos;instant.</p>
          ) : (
            <ul className="divide-y divide-line">
              {data.recent.map(({ establishment, panel }) => (
                <li key={establishment.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <Link href={`/admin/etablissements/${establishment.id}`} className="font-semibold underline underline-offset-4">
                      {establishment.name}
                    </Link>
                    <p className="text-sm text-fg-muted">
                      {establishment.district} · créé le {formatDate(establishment.createdAt)}
                    </p>
                  </div>
                  <Badge tone={panel.state === "active" || panel.state === "trial" ? "success" : panel.state === "none" ? "neutral" : "warning"}>
                    {STATE_LABELS[panel.state]}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}
