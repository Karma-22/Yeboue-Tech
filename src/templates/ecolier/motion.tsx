"use client";

import { useTemplateMotion, type TemplateMotionTools } from "../kit/motion";
import { isBelowFold } from "../kit/reveals";

/*
 * Le mouvement du modèle Écolier : la carte s'écrit. Le surligneur passe sur le
 * titre de chaque catégorie ; puis chaque ligne se trace de gauche à droite,
 * son image se colle, et le stylo rouge entoure le prix.
 */
function setup({ gsap, root }: TemplateMotionTools) {
  root.querySelectorAll<HTMLElement>(".ecl-part").forEach((part) => {
    const highlight = part.querySelector(".ecl-hl");
    if (!highlight || !isBelowFold(part)) return;
    gsap.fromTo(
      highlight,
      { "--hl": "0%" },
      { "--hl": "100%", duration: 0.7, ease: "power2.inOut", scrollTrigger: { trigger: part, start: "top 86%", once: true } },
    );
  });

  root.querySelectorAll<HTMLElement>(".ecl-line").forEach((line) => {
    if (!isBelowFold(line)) return;
    const timeline = gsap.timeline({ scrollTrigger: { trigger: line, start: "top 92%", once: true } });
    // La plume : le texte se découvre dans le sens de l'écriture. La marge négative garde les hampes et les jambages.
    timeline.fromTo(
      line.querySelector(".ecl-text"),
      { clipPath: "inset(-10% 100% -10% 0)" },
      { clipPath: "inset(-10% -5% -10% 0)", duration: 0.7, ease: "power1.inOut", clearProps: "clipPath" },
    );
    const snap = line.querySelector(".ecl-snap");
    if (snap) timeline.from(snap, { opacity: 0, scale: 1.25, rotation: "+=9", duration: 0.45, ease: "back.out(1.6)" }, 0.1);
    timeline.from(line.querySelector(".ecl-mark"), { opacity: 0, duration: 0.2 }, 0.5);
    const ring = line.querySelector<SVGPathElement>(".ecl-ring path");
    if (ring) {
      // pathLength="1" ramène la longueur du trait à 1 : pas besoin de la mesurer.
      ring.setAttribute("pathLength", "1");
      timeline.fromTo(ring, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.5, ease: "power1.inOut" }, 0.6);
    }
  });
}

export function EcolierMotion() {
  const anchor = useTemplateMotion(setup);
  return <span ref={anchor} hidden />;
}
