"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PLANS } from "@/config/plans";
import { requireSuperAdmin } from "@/lib/auth/session";
import { extendPeriod } from "@/lib/billing/subscription";
import { logAdminAction, recordPayment } from "@/lib/db/admin";
import { pageTag } from "@/lib/db/core";
import { getEstablishment, setSubscription } from "@/lib/db/establishments";
import type { Subscription } from "@/lib/db/types";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { parseForm, paymentSchema, type FormState } from "@/lib/validation/forms";

/*
 * Les actions de l'administration (ARCHITECTURE.md §6.9 et §6.10). Chacune
 * exige le compte super-administrateur, et laisse une ligne au journal.
 */

const DAY = 24 * 60 * 60 * 1000;

interface Result {
  ok: boolean;
  message?: string;
}

/** Enregistre un paiement reçu, et prolonge l'abonnement d'autant. */
export async function recordPaymentAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const session = await requireSuperAdmin();
  const parsed = parseForm(paymentSchema, formData);
  if ("state" in parsed) return parsed.state;
  const { establishmentId, plan, months, amount, method, reference } = parsed.data;

  const establishment = await getEstablishment(establishmentId);
  if (!establishment) return { message: "Cet établissement n'existe plus." };

  const now = Date.now();
  // Un paiement peut arriver avant la fin de la création guidée : on part alors d'aujourd'hui.
  const current: Subscription = establishment.subscription ?? { plan, trialEndsAt: now, periodEndsAt: null, suspended: false };
  const next = extendPeriod(current, plan, months, now);

  await setSubscription(establishmentId, next);
  await recordPayment({
    establishmentId,
    establishmentName: establishment.name,
    amount,
    plan,
    months,
    method,
    reference,
    recordedBy: session.userId,
  });
  await logAdminAction({
    adminId: session.userId,
    action: "Paiement enregistré",
    targetId: establishmentId,
    details: `${establishment.name} : ${formatPrice(amount)}, offre ${PLANS[plan].name}, ${months} mois, jusqu'au ${formatDate(next.periodEndsAt ?? now)}.`,
  });
  updateTag(pageTag(establishment.slug));
  refresh();
  return { ok: true, message: `Paiement enregistré. L'abonnement court jusqu'au ${formatDate(next.periodEndsAt ?? now)}.` };
}

/** Coupe un établissement, ou le rétablit. Ses données ne sont jamais effacées. */
export async function setSuspension(establishmentId: string, suspended: boolean): Promise<Result> {
  const session = await requireSuperAdmin();
  const establishment = await getEstablishment(establishmentId);
  if (!establishment?.subscription) return { ok: false, message: "Cet établissement n'a pas encore d'abonnement." };

  await setSubscription(establishmentId, { ...establishment.subscription, suspended });
  await logAdminAction({
    adminId: session.userId,
    action: suspended ? "Établissement suspendu" : "Établissement rétabli",
    targetId: establishmentId,
    details: establishment.name,
  });
  updateTag(pageTag(establishment.slug));
  refresh();
  return { ok: true };
}

/** Offre des jours d'essai en plus : un geste commercial, tant que rien n'a été payé. */
export async function extendTrial(establishmentId: string, days: number): Promise<Result> {
  const session = await requireSuperAdmin();
  const establishment = await getEstablishment(establishmentId);
  const subscription = establishment?.subscription;
  if (!establishment || !subscription) return { ok: false, message: "Cet établissement n'a pas encore d'abonnement." };
  if (subscription.periodEndsAt !== null) return { ok: false, message: "L'essai est terminé : cet établissement a déjà payé." };
  if (!Number.isInteger(days) || days < 1 || days > 30) return { ok: false, message: "Entre 1 et 30 jours." };

  const trialEndsAt = Math.max(Date.now(), subscription.trialEndsAt) + days * DAY;
  await setSubscription(establishmentId, { ...subscription, trialEndsAt });
  await logAdminAction({
    adminId: session.userId,
    action: "Essai prolongé",
    targetId: establishmentId,
    details: `${establishment.name} : ${days} jours de plus, jusqu'au ${formatDate(trialEndsAt)}.`,
  });
  updateTag(pageTag(establishment.slug));
  refresh();
  return { ok: true };
}

/** Ouvre le tableau de bord d'un gérant pour l'aider. Chaque ouverture est inscrite au journal. */
export async function openDashboard(establishmentId: string): Promise<void> {
  const session = await requireSuperAdmin();
  const establishment = await getEstablishment(establishmentId);
  if (!establishment) redirect("/admin/etablissements");
  await logAdminAction({
    adminId: session.userId,
    action: "Tableau de bord ouvert",
    targetId: establishmentId,
    details: establishment.name,
  });
  redirect(`/app/${establishmentId}`);
}
