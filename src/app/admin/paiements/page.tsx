import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, StatTile } from "@/components/dashboard/page-header";
import { PLANS } from "@/config/plans";
import { listPayments } from "@/lib/db/admin";
import { formatDate, formatPrice } from "@/lib/utils/format";

export const metadata: Metadata = { title: "Paiements" };

const METHODS = { wave: "Wave", orange: "Orange Money", mtn: "MTN MoMo", moov: "Moov Money", cash: "Espèces" };

/** Les paiements enregistrés, et ce qu'ils totalisent ce mois-ci et depuis le début. */
async function ledger() {
  const payments = await listPayments(500);
  const month = new Date().toISOString().slice(0, 7);
  const total = (list: typeof payments) => list.reduce((sum, payment) => sum + payment.amount, 0);
  return {
    payments,
    all: total(payments),
    thisMonth: total(payments.filter((payment) => new Date(payment.createdAt).toISOString().startsWith(month))),
  };
}

export default async function AdminPaymentsPage() {
  const { payments, all, thisMonth } = await ledger();
  return (
    <>
      <PageHeader
        title="Paiements"
        description="Pour enregistrer un paiement, ouvrez la fiche de l'établissement : le formulaire s'y trouve."
      />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatTile label="Encaissé ce mois-ci" value={formatPrice(thisMonth)} />
        <StatTile label="Encaissé depuis le début" value={formatPrice(all)} />
        <StatTile label="Paiements enregistrés" value={String(payments.length)} />
      </div>
      {payments.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-strong p-8 text-center text-fg-muted">
          Aucun paiement enregistré pour l&apos;instant.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface-raised">
          {payments.map((payment) => (
            <li key={payment.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
              <span className="min-w-0">
                <Link href={`/admin/etablissements/${payment.establishmentId}`} className="font-semibold underline underline-offset-4">
                  {payment.establishmentName}
                </Link>
                <span className="block text-sm text-fg-muted">
                  {formatDate(payment.createdAt)} · {PLANS[payment.plan].name}, {payment.months} mois · {METHODS[payment.method]}
                  {payment.reference && ` · ${payment.reference}`}
                </span>
              </span>
              <span className="font-semibold tabular-nums">{formatPrice(payment.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
