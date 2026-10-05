import { Check } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { PLANS, TRIAL, type Plan } from "@/config/plans";
import { signupHref } from "@/config/site";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

/* Les prix et le nombre de comptes viennent de src/config/plans.ts ; seul le texte est écrit ici. */

const MENU_POINTS = [
  "Votre page, à votre nom et à vos couleurs",
  "Plats et photos illimités",
  "Un QR Code qui ne change jamais",
  "Menu en français et en anglais",
  "Commande à emporter par WhatsApp",
  "Nombre de scans, jour par jour",
];

const ORDERS_POINTS = [
  "Un QR Code par table",
  "Commande depuis la table",
  "Écran de commandes en direct au comptoir",
  "Avis des clients et carte de fidélité",
  "Vos ventes, plat par plat",
];

const SERVICES = [
  {
    name: "Installation clé en main",
    detail: "Nous saisissons votre menu, imprimons et posons vos QR Codes, et formons votre équipe.",
    price: `${formatPrice(85_000)}, une fois`,
  },
  {
    name: "Séance photo de vos plats",
    detail: "Un photographe partenaire vient chez vous.",
    price: "Sur devis",
  },
];

export function Pricing() {
  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-2">
        <PlanCard plan={PLANS.menu} points={MENU_POINTS} summary="Votre carte en ligne, toujours à jour." />
        <PlanCard
          plan={PLANS.menu_orders}
          points={ORDERS_POINTS}
          summary="La carte, et les commandes qui arrivent au comptoir."
          lead="Tout ce qu'il y a dans Menu, et en plus :"
          featured
        />
      </div>

      <p data-reveal className="mt-6 text-fg-muted">
        Essai gratuit de {TRIAL.days} jours avec toutes les fonctions. Sans engagement : vous
        arrêtez quand vous voulez.
      </p>

      <dl data-reveal className="mt-14 grid gap-6 border-t border-line pt-10">
        {SERVICES.map((service) => (
          <div key={service.name}>
            <div className="flex items-baseline gap-3">
              <dt className="type-title">{service.name}</dt>
              <span
                aria-hidden="true"
                className="hidden min-w-6 flex-1 border-b border-dotted border-line-strong sm:block"
              />
              <dd className="ml-auto font-semibold tabular-nums sm:ml-0">{service.price}</dd>
            </div>
            <dd className="mt-1 max-w-xl text-fg-muted">{service.detail}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  summary: string;
  points: string[];
  lead?: string;
  featured?: boolean;
}

function PlanCard({ plan, summary, points, lead, featured = false }: PlanCardProps) {
  return (
    <article
      data-reveal
      data-theme={featured ? "dark" : undefined}
      className={cn(
        "flex flex-col rounded-2xl p-7 sm:p-9",
        featured ? "bg-surface" : "border border-line bg-surface-raised",
      )}
    >
      <h3 className="type-title">{plan.name}</h3>
      <p className="mt-1 text-fg-muted">{summary}</p>

      <p className="mt-7 flex items-baseline gap-2">
        <span className="type-display-2 tabular-nums">{formatPrice(plan.monthlyPrice)}</span>
        <span className="text-fg-muted">par mois</span>
      </p>

      <div className="mt-7 flex-1 border-t border-line pt-6">
        {lead && <p className="mb-3 font-semibold">{lead}</p>}
        <ul className="grid gap-2.5">
          {points.map((point) => (
            <li key={point} className="flex gap-3">
              <Check aria-hidden="true" strokeWidth={2.5} className="mt-1 size-4 shrink-0 text-accent-text" />
              {point}
            </li>
          ))}
          <li className="flex gap-3">
            <Check aria-hidden="true" strokeWidth={2.5} className="mt-1 size-4 shrink-0 text-accent-text" />
            {plan.maxMembers} comptes pour votre équipe
          </li>
        </ul>
      </div>

      <a
        href={signupHref}
        className={cn(buttonStyles({ variant: featured ? "primary" : "secondary", block: true }), "mt-9")}
      >
        Commencer l&apos;essai gratuit
      </a>
    </article>
  );
}
