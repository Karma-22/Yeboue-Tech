import { EXPIRY, PLANS, TRIAL, type Feature, type PlanId } from "@/config/plans";
import type { Subscription } from "@/lib/db/types";

/*
 * L'état d'un abonnement n'est jamais enregistré : il se calcule à partir des
 * dates, à chaque lecture (ARCHITECTURE.md §8). Il ne peut donc pas être faux,
 * et aucune tâche programmée n'est nécessaire.
 */

export type SubscriptionState =
  /** La création guidée n'est pas terminée. */
  | "none"
  | "trial"
  | "active"
  /** Échéance dépassée depuis peu : rien ne change, on prévient. */
  | "grace"
  /** Le menu reste visible, la commande est coupée. */
  | "limited"
  | "offline"
  /** Coupure décidée par l'administration. */
  | "suspended";

const DAY = 24 * 60 * 60 * 1000;

export function subscriptionState(subscription: Subscription | null, now: number): SubscriptionState {
  if (!subscription) return "none";
  if (subscription.suspended) return "suspended";

  // Tant qu'une période payée court, elle prime sur l'essai.
  if (subscription.periodEndsAt !== null && now < subscription.periodEndsAt) return "active";
  if (subscription.periodEndsAt === null && now < subscription.trialEndsAt) return "trial";

  // Le délai court depuis la dernière chose qui a pris fin.
  const endedAt = subscription.periodEndsAt ?? subscription.trialEndsAt;
  const overdue = now - endedAt;
  if (overdue < EXPIRY.graceDays * DAY) return "grace";
  if (overdue < (EXPIRY.graceDays + EXPIRY.limitedDays) * DAY) return "limited";
  return "offline";
}

/** La page de l'établissement s'affiche-t-elle aux clients ? */
export function isPageOnline(state: SubscriptionState): boolean {
  return state === "trial" || state === "active" || state === "grace" || state === "limited";
}

/** Le gérant peut-il modifier son établissement ? Sinon, seule la page Abonnement reste ouverte. */
export function canEdit(state: SubscriptionState): boolean {
  return state === "none" || state === "trial" || state === "active" || state === "grace";
}

/**
 * La seule fonction qui dit si un établissement a droit à une fonction payante.
 * En mode limité, hors ligne ou suspendu, plus aucune n'est ouverte.
 */
export function hasFeature(subscription: Subscription | null, feature: Feature, now: number): boolean {
  if (!subscription) return false;
  const state = subscriptionState(subscription, now);
  if (state !== "trial" && state !== "active" && state !== "grace") return false;
  return PLANS[subscription.plan].features.includes(feature);
}

/** Jours entiers restants avant la prochaine échéance ; 0 si elle est passée. */
export function daysLeft(subscription: Subscription, now: number): number {
  const end = subscription.periodEndsAt ?? subscription.trialEndsAt;
  return Math.max(0, Math.ceil((end - now) / DAY));
}

/** L'abonnement posé à la fin de la création guidée : l'essai gratuit de l'offre choisie. */
export function startTrial(plan: PlanId, now: number): Subscription {
  return { plan, trialEndsAt: now + TRIAL.days * DAY, periodEndsAt: null, suspended: false };
}

/**
 * Ajoute des mois payés. La nouvelle période part de la fin de la précédente
 * si elle court encore, sinon d'aujourd'hui : payer en avance ne fait rien perdre.
 */
export function extendPeriod(
  subscription: Subscription,
  plan: PlanId,
  months: number,
  now: number,
): Subscription {
  const base = Math.max(now, subscription.periodEndsAt ?? 0, subscription.trialEndsAt);
  const end = new Date(base);
  end.setMonth(end.getMonth() + months);
  return { ...subscription, plan, periodEndsAt: end.getTime(), suspended: false };
}
