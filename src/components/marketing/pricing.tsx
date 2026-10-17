import Image from "next/image";
import { Check } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { PLANS, TRIAL, type Plan } from "@/config/plans";
import { SIGNUP_PATH } from "@/config/site";
import type { Dictionary } from "@/i18n";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import photographer from "@/assets/photos/photographe.jpg";
import setup from "@/assets/photos/installation.jpg";
import { PricingMotion } from "./pricing-motion";

/* Les prix et le nombre d'accès viennent de src/config/plans.ts ; les textes, des dictionnaires. */

/** Le prix de l'installation clé en main, en FCFA. */
const SETUP_PRICE = 85_000;

export function Pricing({ dict }: { dict: Dictionary }) {
  const copy = dict.pricing;
  const signup = SIGNUP_PATH;
  const servicePhotos = [setup, photographer];
  const servicePrices = [`${formatPrice(SETUP_PRICE)}, ${copy.once}`, copy.onQuote];

  return (
    <div>
      <PricingMotion className="grid gap-8 pt-4 lg:grid-cols-2 lg:gap-10">
        <Ticket
          plan={PLANS.menu}
          summary={copy.plans.menu.summary}
          points={copy.plans.menu.points}
          copy={copy}
          href={signup}
          className="lg:-rotate-1"
        />
        <Ticket
          plan={PLANS.menu_orders}
          summary={copy.plans.menu_orders.summary}
          points={copy.plans.menu_orders.points}
          lead={copy.includedLead}
          copy={copy}
          href={signup}
          featured
          className="lg:rotate-1"
        />
      </PricingMotion>

      <p data-reveal className="mt-10 text-fg-muted">
        {copy.trial.replace("{days}", String(TRIAL.days))}
      </p>

      <div className="mt-20">
        <p data-reveal className="type-eyebrow text-accent-text">
          {copy.servicesEyebrow}
        </p>
        <h3 data-reveal className="type-display-3 mt-3">
          {copy.servicesTitle}
        </h3>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {copy.services.map((service, index) => (
            <article
              key={service.name}
              data-reveal
              className="group relative isolate flex min-h-88 flex-col justify-end overflow-hidden rounded-2xl bg-ink p-6 text-ivory sm:p-8"
            >
              <Image
                src={servicePhotos[index]}
                alt={service.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder="blur"
                className="-z-10 object-cover transition-transform duration-700 ease-emphasized group-hover:scale-105"
              />
              <div className="absolute inset-0 -z-10 bg-linear-to-t from-ink via-ink/55 to-ink/5" />
              <p className="absolute top-5 right-5 rounded-full bg-accent px-3.5 py-1.5 text-sm font-semibold text-on-accent tabular-nums sm:top-6 sm:right-6">
                {servicePrices[index]}
              </p>
              <h4 className="type-display-3">{service.name}</h4>
              <p className="mt-3 max-w-md text-ivory/85">{service.text}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

interface TicketProps {
  plan: Plan;
  summary: string;
  points: string[];
  lead?: string;
  copy: Dictionary["pricing"];
  href: string;
  featured?: boolean;
  className?: string;
}

/**
 * Une offre, présentée comme un billet : le prix en haut, le détail sous la
 * ligne de découpe. L'offre mise en avant prend l'inverse du thème de la page
 * et porte le tampon de l'essai gratuit.
 */
function Ticket({ plan, summary, points, lead, copy, href, featured = false, className }: TicketProps) {
  const surface = featured ? "bg-surface" : "bg-surface-raised";

  return (
    <article
      data-ticket
      className={cn(
        "transition-[rotate,translate] duration-500 ease-emphasized [perspective:1400px] hover:-translate-y-1 lg:hover:rotate-0",
        className,
      )}
    >
      <div
        data-ticket-body
        data-theme={featured ? "contrast" : undefined}
        className="relative flex h-full flex-col drop-shadow-[0_18px_30px_rgb(20_33_61/0.18)]"
      >
        <div className={cn("ticket-top rounded-t-2xl px-7 pt-8 pb-7 sm:px-9", surface)}>
          <h3 className="type-title">{plan.name}</h3>
          <p className="mt-1 text-fg-muted">{summary}</p>
          <p className="mt-7 flex flex-wrap items-baseline gap-x-2">
            <span data-price={plan.monthlyPrice} className="type-display-1 tabular-nums">
              {formatPrice(plan.monthlyPrice)}
            </span>
            <span className="text-fg-muted">{copy.perMonth}</span>
          </p>
        </div>

        <div className={cn("ticket-bottom flex flex-1 flex-col rounded-b-2xl px-7 pb-8 sm:px-9", surface)}>
          {/* La ligne de découpe, entre les deux encoches. */}
          <div aria-hidden="true" className="border-t-2 border-dashed border-fg/20" />

          {lead && (
            <p data-line className="mt-6 font-semibold">
              {lead}
            </p>
          )}
          <ul className={cn("grid gap-2.5", lead ? "mt-3" : "mt-6")}>
            {[...points, copy.seats.replace("{count}", String(plan.maxMembers))].map((point) => (
              <li key={point} data-line className="flex gap-3">
                <Check
                  aria-hidden="true"
                  strokeWidth={2.5}
                  className="mt-1 size-4 shrink-0 text-accent-text"
                />
                {point}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-9">
            <a
              href={href}
              className={buttonStyles({ variant: featured ? "primary" : "secondary", size: "lg", block: true })}
            >
              {copy.cta}
            </a>
          </div>
        </div>

        {featured && (
          <p
            data-stamp
            className="absolute -top-4 right-6 -rotate-6 rounded-md border-2 border-accent bg-surface px-3 py-1.5 text-xs font-bold tracking-wider text-accent-text uppercase outline-2 outline-offset-2 outline-accent/40"
          >
            {copy.stamp}
          </p>
        )}
      </div>
    </article>
  );
}
