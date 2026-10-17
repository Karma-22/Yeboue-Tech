"use client";

import { useTemplateMotion, type PluginName, type TemplateMotionTools } from "../kit/motion";
import { isBelowFold } from "../kit/reveals";

const PLUGINS: readonly PluginName[] = ["SplitText"];

/*
 * Le mouvement du modèle Enseigne : chaque panneau se peint d'un coup de
 * pinceau, de gauche à droite ; les lettres du titre se posent une à une, puis
 * les étoiles de prix claquent.
 */
function setup({ gsap, root, plugins }: TemplateMotionTools) {
  const { SplitText } = plugins;

  root.querySelectorAll<HTMLElement>(".ens-panel").forEach((panel) => {
    if (!isBelowFold(panel)) return;
    const title = panel.querySelector<HTMLElement>(".ens-title-text");
    // Découpé en mots puis en lettres : un mot ne se coupe jamais entre deux lettres.
    const letters = title && SplitText ? new SplitText(title, { type: "words,chars" }).chars : [];

    gsap
      .timeline({ scrollTrigger: { trigger: panel, start: "top 86%", once: true } })
      // Le coup de pinceau : le panneau se découvre de gauche à droite, clous et ombre compris.
      .fromTo(
        panel,
        { clipPath: "inset(-1rem 100% -1rem -1rem)" },
        { clipPath: "inset(-1rem -1rem -1rem -1rem)", duration: 0.75, ease: "power2.inOut", clearProps: "clipPath" },
      )
      .from(letters, { opacity: 0, yPercent: 45, rotation: -10, duration: 0.4, ease: "back.out(2.2)", stagger: 0.035 }, "-=0.35")
      .from(
        panel.querySelectorAll(".ens-star, .ens-tag"),
        { scale: 0, rotation: -50, duration: 0.45, ease: "back.out(3)", stagger: 0.07 },
        "-=0.15",
      );
  });
}

export function EnseigneMotion() {
  const anchor = useTemplateMotion(setup, PLUGINS);
  return <span ref={anchor} hidden />;
}
