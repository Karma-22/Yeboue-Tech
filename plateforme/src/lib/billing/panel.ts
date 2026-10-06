import { FEATURES, PLANS, type Feature, type Plan } from "@/config/plans";
import type { Establishment } from "@/lib/db/types";
import { canEdit, daysLeft, hasFeature, subscriptionState, type SubscriptionState } from "./subscription";

/** Ce que le tableau de bord doit savoir de l'abonnement d'un établissement, à cet instant. */
export interface PanelState {
  state: SubscriptionState;
  /** Jours avant la prochaine échéance. */
  daysLeft: number;
  /** Le gérant peut encore modifier son établissement. */
  editable: boolean;
  plan: Plan | null;
  features: Record<Feature, boolean>;
}

export function panelState(establishment: Establishment): PanelState {
  const now = Date.now();
  const { subscription } = establishment;
  const state = subscriptionState(subscription, now);
  return {
    state,
    daysLeft: subscription ? daysLeft(subscription, now) : 0,
    editable: canEdit(state),
    plan: subscription ? PLANS[subscription.plan] : null,
    features: Object.fromEntries(FEATURES.map((feature) => [feature, hasFeature(subscription, feature, now)])) as Record<
      Feature,
      boolean
    >,
  };
}

export const STATE_LABELS: Record<SubscriptionState, string> = {
  none: "Création en cours",
  trial: "Essai gratuit",
  active: "Abonnement actif",
  grace: "Abonnement expiré",
  limited: "Commande coupée",
  offline: "Hors ligne",
  suspended: "Suspendu",
};
