import { site } from "@/config/site";
import type { Establishment } from "@/lib/db/types";
import { formatPrice } from "@/lib/utils/format";
import { whatsappLink } from "@/lib/utils/phone";
import type { PanelState } from "./panel";

/**
 * Le rappel à envoyer au gérant quand son essai ou son abonnement arrive à
 * échéance (ARCHITECTURE.md §6.10) : un lien qui ouvre WhatsApp sur son numéro,
 * le message déjà écrit. `null` s'il n'y a rien à rappeler, ou pas de numéro.
 */
export function reminderLink(establishment: Establishment, panel: PanelState): string | null {
  if (!establishment.whatsapp || !panel.plan) return null;
  const { name } = establishment;
  const price = `${formatPrice(panel.plan.monthlyPrice, "FCFA")} par mois (offre ${panel.plan.name})`;
  const days = panel.daysLeft <= 1 ? "demain" : `dans ${panel.daysLeft} jours`;

  const text: Partial<Record<PanelState["state"], string>> = {
    trial: `Bonjour, c'est ${site.name}. L'essai gratuit de « ${name} » se termine ${days}. Pour garder votre page et votre QR Code en ligne : ${price}. Répondez à ce message, je vous explique comment payer.`,
    active: `Bonjour, c'est ${site.name}. L'abonnement de « ${name} » arrive à échéance ${days}. Le renouvellement est à ${price}. Répondez à ce message quand vous voulez.`,
    grace: `Bonjour, c'est ${site.name}. L'abonnement de « ${name} » a expiré. Votre page est encore en ligne quelques jours : pour qu'elle le reste, ${price}. Répondez à ce message, je m'occupe du reste.`,
    limited: `Bonjour, c'est ${site.name}. L'abonnement de « ${name} » a expiré : votre carte reste visible, mais la commande est coupée. Tout repart dès le paiement : ${price}.`,
    offline: `Bonjour, c'est ${site.name}. La page de « ${name} » n'est plus en ligne, faute d'abonnement. Rien n'est perdu : tout repart dès le paiement, ${price}.`,
  };
  const message = text[panel.state];
  return message ? whatsappLink(establishment.whatsapp, message) : null;
}
