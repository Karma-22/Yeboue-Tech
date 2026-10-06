import type { Metadata } from "next";
import { PlanSwitcher } from "@/components/dashboard/controls";
import { PageHeader, Section } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { PLANS } from "@/config/plans";
import { site, whatsappUrl } from "@/config/site";
import { requireAccess } from "@/lib/auth/session";
import { panelState, STATE_LABELS } from "@/lib/billing/panel";
import { listPaymentsOf } from "@/lib/db/admin";
import { formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Abonnement" };

const METHODS = { wave: "Wave", orange: "Orange Money", mtn: "MTN MoMo", moov: "Moov Money", cash: "Espèces" };
const date = (timestamp: number) =>
  new Date(timestamp).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export default async function SubscriptionPage({ params }: PageProps<"/app/[estId]/abonnement">) {
  const { estId } = await params;
  const { establishment } = await requireAccess(estId, "billing.manage");
  const panel = panelState(establishment);
  const subscription = establishment.subscription!;
  const plan = PLANS[subscription.plan];
  const payments = await listPaymentsOf(estId);
  const end = subscription.periodEndsAt ?? subscription.trialEndsAt;
  const trial = panel.state === "trial";

  const summary =
    panel.state === "trial"
      ? `Votre essai gratuit se termine le ${date(end)} : encore ${panel.daysLeft} jour${panel.daysLeft > 1 ? "s" : ""}.`
      : panel.state === "active"
        ? `Votre abonnement court jusqu'au ${date(end)}.`
        : panel.state === "suspended"
          ? "Votre établissement est suspendu. Écrivez-nous pour le rétablir."
          : `Votre abonnement a pris fin le ${date(end)}. Un paiement remet tout en marche aussitôt.`;

  return (
    <>
      <PageHeader title="Abonnement" action={<Badge tone={trial || panel.state === "active" ? "success" : "warning"}>{STATE_LABELS[panel.state]}</Badge>} />
      <div className="grid gap-6">
        <Section title={`Offre ${plan.name}`} description={summary}>
          <PlanSwitcher establishmentId={estId} plan={subscription.plan} locked={!trial} />
          <p className="mt-3 text-sm text-fg-muted">
            {trial
              ? "Pendant l'essai, vous changez d'offre d'un geste, autant de fois que vous voulez."
              : "Pour changer d'offre, indiquez-le au moment de votre prochain paiement."}
          </p>
        </Section>

        <Section title="Comment payer" description="Pour l'instant, le paiement se fait par mobile money, et nous l'enregistrons à la main dans la journée.">
          <ol className="grid gap-3">
            <li>
              <strong>1.</strong> Envoyez <strong>{formatPrice(plan.monthlyPrice, "FCFA")}</strong> par mois d&apos;abonnement, par
              Wave ou Orange Money, au <strong>{site.contact.phoneDisplay}</strong>.
            </li>
            <li>
              <strong>2.</strong> En motif, écrivez : <strong className="font-display">{establishment.slug}</strong>
            </li>
            <li>
              <strong>3.</strong> Prévenez-nous : votre abonnement est prolongé dès que nous voyons le paiement.
            </li>
          </ol>
          <a
            href={whatsappUrl(
              `Bonjour, je viens de payer l'abonnement de « ${establishment.name} » (${establishment.slug}), offre ${plan.name}.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ className: "mt-5" })}
          >
            J&apos;ai payé : prévenir {site.name}
          </a>
        </Section>

        <Section title="Vos paiements">
          {payments.length === 0 ? (
            <p className="text-fg-muted">Aucun paiement enregistré pour l&apos;instant.</p>
          ) : (
            <ul className="divide-y divide-line">
              {payments.map((payment) => (
                <li key={payment.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <span>
                    <span className="block font-semibold">
                      {PLANS[payment.plan].name} · {payment.months} mois
                    </span>
                    <span className="text-sm text-fg-muted">
                      {date(payment.createdAt)} · {METHODS[payment.method]}
                    </span>
                  </span>
                  <span className="font-display font-bold tabular-nums">{formatPrice(payment.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}
