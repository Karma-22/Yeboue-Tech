"use client";

import { useTemplateMotion, type TemplateMotionTools } from "../kit/motion";
import { isBelowFold } from "../kit/reveals";

/*
 * Le mouvement du modèle Garba : les assiettes arrivent en tournant, de la
 * gauche pour une colonne et de la droite pour l'autre, et se posent sur le
 * plateau avec un petit rebond. La pastille de prix claque juste après.
 */
function setup({ gsap, root }: TemplateMotionTools) {
  root.querySelectorAll<HTMLElement>(".grb-cell").forEach((cell, index) => {
    if (!isBelowFold(cell)) return;
    const plate = cell.querySelector(".grb-plate");
    const fromLeft = index % 2 === 0;
    const timeline = gsap.timeline({ scrollTrigger: { trigger: cell, start: "top 90%", once: true } });
    timeline
      .from(plate, { xPercent: fromLeft ? -70 : 70, rotation: fromLeft ? -220 : 220, opacity: 0, duration: 0.85, ease: "power3.out" })
      // L'assiette qu'on pose oscille un instant avant de s'immobiliser.
      .fromTo(plate, { scale: 1.06 }, { scale: 1, duration: 0.6, ease: "elastic.out(1.1, 0.4)" }, "-=0.15")
      .from(cell.querySelectorAll(".grb-item, .grb-desc"), { opacity: 0, y: 10, duration: 0.35, stagger: 0.05 }, "-=0.45");
    // Une assiette sans photo n'a pas de pastille : son prix est écrit au fond.
    const coin = cell.querySelector(".grb-coin");
    if (coin) timeline.from(coin, { scale: 0, rotation: -60, duration: 0.4, ease: "back.out(3)" }, 0.5);
  });
}

export function GarbaMotion() {
  const anchor = useTemplateMotion(setup);
  return <span ref={anchor} hidden />;
}
