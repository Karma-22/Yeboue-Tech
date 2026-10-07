"use client";

import { useTemplateMotion, type TemplateMotionTools } from "../kit/motion";
import { isBelowFold } from "../kit/reveals";

/*
 * Le mouvement du modèle Pagne : la bande de tissu de chaque catégorie se
 * déroule, son étiquette se pose, puis le point de couture fait le tour de
 * chaque carte.
 */
function setup({ gsap, root }: TemplateMotionTools) {
  root.querySelectorAll<HTMLElement>(".pgn-part, .pgn-foot").forEach((part) => {
    if (!isBelowFold(part)) return;
    const band = part.querySelector(".pgn-band");
    const tab = part.querySelector(".pgn-tab, .pgn-foot-label");
    const timeline = gsap.timeline({ scrollTrigger: { trigger: part, start: "top 88%", once: true } });
    if (band) {
      timeline.fromTo(
        band,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut", clearProps: "clipPath" },
      );
    }
    if (tab) timeline.from(tab, { opacity: 0, scale: 0.8, rotation: -9, duration: 0.45, ease: "back.out(2.4)" }, "-=0.4");
  });

  // La couture : chaque carte arrive, puis son point se trace tout autour.
  const cards = gsap.utils.toArray<HTMLElement>(root.querySelectorAll(".pgn-card")).filter(isBelowFold);
  if (cards.length === 0) return;
  gsap.set(cards, { opacity: 0, y: 24, "--sew": "0deg" });
  cards.forEach((card) => {
    gsap
      .timeline({ scrollTrigger: { trigger: card, start: "top 92%", once: true } })
      .to(card, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" })
      .to(card, { "--sew": "360deg", duration: 1.1, ease: "power1.inOut" }, "-=0.2");
  });
}

export function PagneMotion() {
  const anchor = useTemplateMotion(setup);
  return <span ref={anchor} hidden />;
}
