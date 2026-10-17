"use client";

import { useEffect, useState } from "react";
import { Viewfinder } from "@/components/brand/viewfinder";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";
import { Phone } from "./phone";

interface HeroProps {
  /** Un type d'établissement par entrée : le surtitre et le début du titre changent ensemble. */
  rotating: { eyebrow: string; lead: string }[];
  titleRest: string;
  text: string;
  assurances: string;
  primary: { href: string; label: string };
  secondary: { href: string; label: string };
  /** La grande photo, rendue par le serveur. */
  photo: React.ReactNode;
  /** L'écran du téléphone pour chaque entrée de `rotating`, dans le même ordre. */
  screens: React.ReactNode[];
}

const INTERVAL_MS = 3600;

/**
 * Le haut de la page d'accueil. Le début du titre, le surtitre et l'écran du
 * téléphone changent ensemble toutes les quelques secondes : restaurant, bar,
 * hôtel, résidence. On voit ainsi d'emblée que la plateforme sert tous ces
 * établissements.
 */
export function Hero({ rotating, titleRest, text, assurances, primary, secondary, photo, screens }: HeroProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      // L'onglet en arrière-plan ne tourne pas : on reprend où l'on en était.
      if (!document.hidden) setActive((index) => (index + 1) % rotating.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [rotating.length]);

  // Tous les éléments occupent la même case : la place réservée est celle du plus long, rien ne saute.
  const stacked = (index: number) =>
    cn(
      "col-start-1 row-start-1 transition-[opacity,translate] duration-500 ease-emphasized",
      index === active ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
    );

  return (
    <section className="overflow-x-clip">
      <Container className="grid items-center gap-x-10 gap-y-14 pt-12 pb-24 sm:pt-16 lg:grid-cols-2 lg:pb-28">
        <div>
          <p className="type-eyebrow grid animate-rise text-accent-text">
            {rotating.map((item, index) => (
              <span key={item.eyebrow} aria-hidden={index !== 0} className={stacked(index)}>
                {item.eyebrow}
              </span>
            ))}
          </p>

          <h1 className="type-display-1 mt-5 animate-rise [animation-delay:80ms]">
            <span className="grid">
              {rotating.map((item, index) => (
                <span key={item.lead} aria-hidden={index !== 0} className={stacked(index)}>
                  {item.lead}
                </span>
              ))}
            </span>{" "}
            {titleRest}
          </h1>

          <p className="type-lead mt-6 max-w-lg animate-rise text-fg-muted [animation-delay:160ms]">
            {text}
          </p>

          <div className="mt-9 flex animate-rise flex-wrap items-center gap-3 [animation-delay:240ms]">
            <a href={primary.href} className={buttonStyles({ size: "lg" })}>
              {primary.label}
            </a>
            <a href={secondary.href} className={buttonStyles({ variant: "ghost", size: "lg" })}>
              {secondary.label}
            </a>
          </div>

          <p className="mt-6 animate-rise text-sm text-fg-subtle [animation-delay:320ms]">
            {assurances}
          </p>
        </div>

        <div className="relative animate-rise [animation-delay:200ms] lg:ml-10">
          <Viewfinder cornerClassName="size-10" className="rounded-2xl p-3 text-fg">
            {photo}
          </Viewfinder>
          <Phone
            aria-hidden="true"
            className="absolute -bottom-14 left-0 origin-bottom-left scale-[0.52] sm:scale-[0.62] lg:-left-20 lg:scale-[0.8]"
          >
            {screens.map((screen, index) => (
              <div
                key={index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-emphasized",
                  index === active ? "opacity-100" : "opacity-0",
                )}
              >
                {screen}
              </div>
            ))}
          </Phone>
        </div>
      </Container>
    </section>
  );
}
