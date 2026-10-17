"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils/cn";
import { Phone } from "./phone";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export interface StoryStep {
  title: string;
  text: string;
}

interface PhoneStoryProps {
  steps: StoryStep[];
  /** Un écran par étape, dans le même ordre. */
  screens: React.ReactNode[];
  /** Ce qui apparaît à côté du téléphone à la dernière étape. */
  aside?: React.ReactNode;
}

/** Hauteur de défilement accordée à chaque étape sur téléphone. */
const MOBILE_STEP = "85svh";

/**
 * Branche l'animation sur un bloc : chaque élément `data-trigger` qui passe
 * le repère affiche l'écran et le texte du même rang.
 * - « list » : les textes défilent normalement, celui de l'étape en cours ressort.
 * - « pinned » : tout reste en place, les textes se remplacent l'un l'autre.
 */
function bindStory(root: HTMLElement, mode: "list" | "pinned") {
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const select = gsap.utils.selector(root);
  const triggers = select("[data-trigger]") as HTMLElement[];
  const screens = select("[data-screen]") as HTMLElement[];
  const texts = select("[data-text]") as HTMLElement[];
  const dots = select("[data-dot]") as HTMLElement[];
  const aside = (select("[data-aside]") as HTMLElement[])[0];
  const last = triggers.length - 1;
  let current = 0;

  gsap.set(screens.slice(1), { autoAlpha: 0 });
  gsap.set(texts.slice(1), mode === "list" ? { opacity: 0.35 } : { autoAlpha: 0, y: 16 });
  if (aside) gsap.set(aside, { autoAlpha: 0, x: 28 });

  const show = (index: number) => {
    if (index === current) return;
    const forward = index > current;
    const duration = still ? 0 : 0.45;

    gsap.to(screens[current], {
      autoAlpha: 0,
      y: forward ? -14 : 14,
      duration,
      ease: "power2.in",
      overwrite: true,
    });
    gsap.fromTo(
      screens[index],
      { autoAlpha: 0, y: forward ? 18 : -18 },
      { autoAlpha: 1, y: 0, duration, delay: still ? 0 : 0.14, ease: "power3.out", overwrite: true },
    );

    // Le contenu du nouvel écran entre ligne après ligne.
    const items = screens[index].querySelectorAll("[data-item]");
    if (items.length > 0 && !still) {
      gsap.fromTo(
        items,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, delay: 0.28, ease: "power2.out", overwrite: true },
      );
    }

    if (mode === "list") {
      gsap.to(texts, {
        opacity: (i: number) => (i === index ? 1 : 0.35),
        duration: still ? 0 : 0.3,
        overwrite: true,
      });
    } else {
      gsap.to(texts[current], {
        autoAlpha: 0,
        y: forward ? -12 : 12,
        duration: still ? 0 : 0.25,
        ease: "power2.in",
        overwrite: true,
      });
      gsap.fromTo(
        texts[index],
        { autoAlpha: 0, y: forward ? 16 : -16 },
        { autoAlpha: 1, y: 0, duration, delay: still ? 0 : 0.18, ease: "power3.out", overwrite: true },
      );
    }

    dots.forEach((dot, i) => dot.toggleAttribute("data-active", i === index));

    if (aside) {
      const visible = index === last;
      gsap.to(aside, {
        autoAlpha: visible ? 1 : 0,
        x: visible ? 0 : 28,
        duration,
        delay: visible && !still ? 0.5 : 0,
        ease: "power3.out",
        overwrite: true,
      });
    }

    current = index;
  };

  triggers.forEach((element, index) => {
    ScrollTrigger.create({
      trigger: element,
      // « pinned » : le repère est le bas de l'en-tête (64 px), là où le bloc se fige.
      start: mode === "list" ? "top 60%" : "top top+=64",
      end: mode === "list" ? "bottom 60%" : "bottom top+=64",
      onToggle: (self) => {
        if (self.isActive) show(index);
      },
    });
  });
}

/**
 * L'histoire d'une commande racontée par un téléphone, qui change d'écran à
 * mesure qu'on fait défiler. Sur grand écran, les étapes défilent à gauche et
 * le téléphone reste à droite. Sur téléphone, tout se fige le temps des étapes
 * et le texte change sous l'écran.
 */
export function PhoneStory({ steps, screens, aside }: PhoneStoryProps) {
  const desktop = useRef<HTMLDivElement>(null);
  const mobile = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(min-width: 1024px)", () => {
      if (desktop.current) bindStory(desktop.current, "list");
    });
    media.add("(max-width: 1023px)", () => {
      if (mobile.current) bindStory(mobile.current, "pinned");
    });
  });

  return (
    <>
      {/* Pour les lecteurs d'écran : les étapes, simplement, sans l'animation. */}
      <ol className="sr-only">
        {steps.map((step) => (
          <li key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </li>
        ))}
      </ol>

      {/* Grand écran : les étapes défilent, le téléphone reste. */}
      <div ref={desktop} aria-hidden="true" className="hidden gap-16 lg:grid lg:grid-cols-2">
        {/* La marge du bas laisse le téléphone en place pendant toute la dernière étape. */}
        <div className="pb-[16vh]">
          {steps.map((step, index) => (
            <div key={step.title} data-trigger className="flex min-h-[72vh] flex-col justify-center">
              <div data-text>
                <p className="type-eyebrow text-accent-text">{String(index + 1).padStart(2, "0")}</p>
                <p className="type-display-3 mt-3">{step.title}</p>
                <p className="type-lead mt-4 max-w-md text-fg-muted">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky top-16 grid h-[calc(100vh-4rem)] place-items-center">
          <div className="relative">
            <Phone>
              {screens.map((screen, index) => (
                <div
                  key={index}
                  data-screen
                  className={cn("absolute inset-0", index > 0 && "invisible opacity-0")}
                >
                  {screen}
                </div>
              ))}
            </Phone>
            {aside && (
              <div data-aside className="invisible absolute -right-28 bottom-20 w-56 opacity-0">
                {aside}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Téléphone et tablette : le bloc se fige, puis une étape remplace l'autre. */}
      <div
        ref={mobile}
        aria-hidden="true"
        className="relative lg:hidden"
        style={{ height: `calc(${steps.length} * ${MOBILE_STEP} + 100svh - 4rem)` }}
      >
        <div className="sticky top-16 flex h-[calc(100svh-4rem)] flex-col items-center justify-center gap-5 overflow-hidden pb-3">
          <div className="relative shrink-0">
            <Phone className="[zoom:0.74] [@media(max-height:760px)]:[zoom:0.66] [@media(max-height:680px)]:[zoom:0.56]">
              {screens.map((screen, index) => (
                <div
                  key={index}
                  data-screen
                  className={cn("absolute inset-0", index > 0 && "invisible opacity-0")}
                >
                  {screen}
                </div>
              ))}
            </Phone>
            {aside && (
              <div data-aside className="invisible absolute -right-8 bottom-10 w-48 opacity-0 [zoom:0.86]">
                {aside}
              </div>
            )}
          </div>

          <div className="relative h-44 w-full max-w-sm">
            {steps.map((step, index) => (
              <div
                key={step.title}
                data-text
                className={cn("absolute inset-0 text-center", index > 0 && "invisible opacity-0")}
              >
                <p className="type-eyebrow text-accent-text">{String(index + 1).padStart(2, "0")}</p>
                <p className="type-title mt-2 text-balance">{step.title}</p>
                <p className="mt-2 text-[0.9375rem] leading-normal text-fg-muted">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-1.5">
            {steps.map((step, index) => (
              <span
                key={step.title}
                data-dot
                data-active={index === 0 ? "" : undefined}
                className="h-1 w-2 rounded-full bg-fg/25 transition-all duration-300 data-active:w-7 data-active:bg-accent"
              />
            ))}
          </div>
        </div>

        {steps.map((step, index) => (
          <div
            key={step.title}
            data-trigger
            className="pointer-events-none absolute inset-x-0"
            style={{ top: `calc(${index} * ${MOBILE_STEP})`, height: MOBILE_STEP }}
          />
        ))}
      </div>
    </>
  );
}
