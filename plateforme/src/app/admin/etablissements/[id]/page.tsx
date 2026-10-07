import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { extendTrial, openDashboard, setSuspension } from "@/app/admin/actions";
import { PaymentForm } from "@/components/admin/payment-form";
import { ActionButton } from "@/components/dashboard/controls";
import { PageHeader, Section } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonStyles } from "@/components/ui/button";
import { PLANS } from "@/config/plans";
import { TEMPLATES } from "@/config/templates";
import { panelState, STATE_LABELS } from "@/lib/billing/panel";
import { reminderLink } from "@/lib/billing/reminder";
import { listPaymentsOf } from "@/lib/db/admin";
import { getEstablishment, listMembers } from "@/lib/db/establishments";
import { getUser } from "@/lib/db/users";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { formatPhone, whatsappLink } from "@/lib/utils/phone";
import { TYPE_LABELS } from "@/templates/types";

export const metadata: Metadata = { title: "Fiche établissement" };

export default async function AdminEstablishmentPage({ params }: PageProps<"/admin/etablissements/[id]">) {
  const { id } = await params;
  const establishment = await getEstablishment(id);
  if (!establishment) notFound();
  const [owner, members, payments] = await Promise.all([getUser(establishment.ownerId), listMembers(id), listPaymentsOf(id)]);
  const panel = panelState(establishment);
  const { subscription } = establishment;
  const reminder = reminderLink(establishment, panel);
  const facts: [string, React.ReactNode][] = [
    ["Type", TYPE_LABELS[establishment.type].fr],
    ["Quartier", `${establishment.district}, ${establishment.city}`],
    [
      "Page",
      <a key="page" href={`/${establishment.slug}`} target="_blank" rel="noopener" className="underline underline-offset-4">
        /{establishment.slug}
      </a>,
    ],
    ["Modèle", TEMPLATES[establishment.template].name],
    ["En ligne", establishment.published ? "Oui" : "Non"],
    ["Créé le", formatDate(establishment.createdAt)],
    ["Équipe", `${members.length} membre${members.length > 1 ? "s" : ""}`],
  ];

  return (
    <>
      <PageHeader
        title={establishment.name}
        action={<Badge tone={panel.state === "active" || panel.state === "trial" ? "success" : "warning"}>{STATE_LABELS[panel.state]}</Badge>}
      />
      <div className="grid gap-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Section title="L'établissement">
            <dl className="grid gap-2 text-sm">
              {facts.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4">
                  <dt className="text-fg-muted">{label}</dt>
                  <dd className="text-right font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <form action={openDashboard.bind(null, id)} className="mt-5">
              <Button type="submit" variant="outline" size="sm">
                Ouvrir son tableau de bord
              </Button>
            </form>
          </Section>

          <Section title="Le propriétaire">
            {owner ? (
              <div className="grid gap-1 text-sm">
                <p className="text-base font-semibold">
                  {owner.firstName} {owner.lastName}
                </p>
                <p className="text-fg-muted">{owner.email}</p>
                <p className="text-fg-muted">{owner.phone && formatPhone(owner.phone)}</p>
              </div>
            ) : (
              <p className="text-fg-muted">Compte introuvable.</p>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              {establishment.whatsapp && (
                <a href={whatsappLink(establishment.whatsapp, "")} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "outline", size: "sm" })}>
                  <MessageCircle aria-hidden="true" className="size-4" />
                  Lui écrire
                </a>
              )}
              {reminder && (
                <a href={reminder} target="_blank" rel="noopener noreferrer" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                  Envoyer le rappel d&apos;échéance
                </a>
              )}
            </div>
          </Section>
        </div>

        <Section
          title="L'abonnement"
          description={
            subscription
              ? `Offre ${PLANS[subscription.plan].name}. Essai jusqu'au ${formatDate(subscription.trialEndsAt)}${
                  subscription.periodEndsAt ? `, période payée jusqu'au ${formatDate(subscription.periodEndsAt)}` : ", rien de payé pour l'instant"
                }.`
              : "La création guidée n'est pas terminée : aucun essai n'a démarré."
          }
        >
          <div className="flex flex-wrap gap-3">
            {subscription && subscription.periodEndsAt === null && (
              <ActionButton variant="outline" size="sm" action={extendTrial.bind(null, id, 7)}>
                Offrir 7 jours d&apos;essai de plus
              </ActionButton>
            )}
            {subscription &&
              (subscription.suspended ? (
                <ActionButton variant="secondary" size="sm" action={setSuspension.bind(null, id, false)}>
                  Rétablir l&apos;établissement
                </ActionButton>
              ) : (
                <ActionButton
                  variant="danger"
                  size="sm"
                  action={setSuspension.bind(null, id, true)}
                  confirm={`Suspendre « ${establishment.name} » ? Sa page ne sera plus en ligne.`}
                >
                  Suspendre
                </ActionButton>
              ))}
          </div>
        </Section>

        <Section title="Enregistrer un paiement" description="Dès l'enregistrement, l'abonnement est prolongé et tout repart.">
          <PaymentForm establishmentId={id} plan={subscription?.plan ?? "menu_orders"} />
        </Section>

        <Section title="Ses paiements">
          {payments.length === 0 ? (
            <p className="text-fg-muted">Aucun paiement enregistré.</p>
          ) : (
            <ul className="divide-y divide-line">
              {payments.map((payment) => (
                <li key={payment.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <span>
                    <span className="block font-semibold">
                      {PLANS[payment.plan].name} · {payment.months} mois
                    </span>
                    <span className="text-sm text-fg-muted">
                      {formatDate(payment.createdAt)} · {payment.method}
                      {payment.reference && ` · ${payment.reference}`}
                    </span>
                  </span>
                  <span className="font-semibold tabular-nums">{formatPrice(payment.amount)}</span>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </>
  );
}
