"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

/**
 * L'histoire d'une commande racontée par un téléphone. Sur grand écran, le
 * téléphone reste en place et change d'écran à mesure que les étapes défilent.
 * Sur téléphone, chaque étape montre simplement son écran.
 */
export function PhoneStory({ steps, screens, aside }: PhoneStoryProps) {
  const desktop = useRef<HTMLDivElement>(null);
  const last = steps.length - 1;

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(min-width: 1024px)", () => {
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const stepEls = gsap.utils.toArray<HTMLElement>("[data-step]");
        const screenEls = gsap.utils.toArray<HTMLElement>("[data-screen]");
        const asideEl = desktop.current?.querySelector<HTMLElement>("[data-aside]");
        let current = 0;

        gsap.set(screenEls.slice(1), { autoAlpha: 0 });
        gsap.set(stepEls.slice(1), { opacity: 0.35 });
        if (asideEl) gsap.set(asideEl, { autoAlpha: 0, x: 28 });

        const show = (index: number) => {
          if (index === current) return;
          const forward = index > current;
          const duration = still ? 0 : 0.45;

          gsap.to(screenEls[current], {
            autoAlpha: 0,
            y: forward ? -14 : 14,
            duration,
            ease: "power2.in",
            overwrite: true,
          });
          gsap.fromTo(
            screenEls[index],
            { autoAlpha: 0, y: forward ? 18 : -18 },
            { autoAlpha: 1, y: 0, duration, delay: still ? 0 : 0.14, ease: "power3.out", overwrite: true },
          );

          // Le contenu du nouvel écran entre ligne après ligne.
          const items = screenEls[index].querySelectorAll("[data-item]");
          if (items.length > 0 && !still) {
            gsap.fromTo(
              items,
              { opacity: 0, x: -12 },
              { opacity: 1, x: 0, duration: 0.4, stagger: 0.07, delay: 0.28, ease: "power2.out", overwrite: true },
            );
          }

          gsap.to(stepEls, {
            opacity: (i: number) => (i === index ? 1 : 0.35),
            duration: still ? 0 : 0.3,
            overwrite: true,
          });

          if (asideEl) {
            const visible = index === last;
            gsap.to(asideEl, {
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

        stepEls.forEach((element, index) => {
          ScrollTrigger.create({
            trigger: element,
            start: "top 60%",
            end: "bottom 60%",
            onToggle: (self) => {
              if (self.isActive) show(index);
            },
          });
        });
      });
    },
    { scope: desktop },
  );

  return (
    <>
      {/* Grand écran : les étapes défilent, le téléphone reste. */}
      <div ref={desktop} className="hidden gap-16 lg:grid lg:grid-cols-2">
        {/* La marge du bas laisse le téléphone en place pendant toute la dernière étape. */}
        <ol className="pb-[16vh]">
          {steps.map((step, index) => (
            <li key={step.title} data-step className="flex min-h-[72vh] flex-col justify-center">
              <StepText step={step} index={index} />
            </li>
          ))}
        </ol>

        <div className="sticky top-16 grid h-[calc(100vh-4rem)] place-items-center">
          <div className="relative">
            <Phone aria-hidden="true">
              {screens.map((screen, index) => (
                <div key={index} data-screen className="absolute inset-0">
                  {screen}
                </div>
              ))}
            </Phone>
            {aside && (
              <div data-aside aria-hidden="true" className="absolute -right-28 bottom-20 w-56">
                {aside}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Téléphone et tablette : une étape, son écran, puis la suivante. */}
      <ol className="grid gap-20 lg:hidden">
        {steps.map((step, index) => (
          <li key={step.title} className="grid items-center gap-8 sm:grid-cols-2">
            <StepText step={step} index={index} />
            <div className="relative justify-self-center">
              <Phone aria-hidden="true">
                {screens[index]}
              </Phone>
              {aside && index === last && (
                <div aria-hidden="true" className="absolute -right-4 -bottom-8 w-48">
                  {aside}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function StepText({ step, index }: { step: StoryStep; index: number }) {
  return (
    <div>
      <p className="type-eyebrow text-accent-text">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="type-display-3 mt-3">{step.title}</h3>
      <p className="type-lead mt-4 max-w-md text-fg-muted">{step.text}</p>
    </div>
  );
}
