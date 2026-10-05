"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Fait apparaître en douceur, une seule fois, les éléments marqués
 * `data-reveal` quand ils entrent dans l'écran. À poser une fois par page.
 * Sans JavaScript, ou si la personne a demandé moins d'animations, tout reste
 * simplement visible.
 */
export function ScrollReveal() {
  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const elements = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(elements, { opacity: 0, y: 28 });

      ScrollTrigger.batch(elements, {
        start: "top 88%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.09,
            overwrite: true,
          });
        },
      });
    });
  });

  return null;
}
