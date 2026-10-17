"use client";

import { useTemplateMotion, type TemplateMotionTools } from "../kit/motion";
import { isBelowFold } from "../kit/reveals";

type Gsap = TemplateMotionTools["gsap"];

const HALVES = ["h-top", "h-bot", "f-top", "f-bot"] as const;

/**
 * Fait défiler un compteur à volets : dix chiffres passent, et il revient sur
 * le sien. À chaque pas, le volet du haut bascule et découvre le chiffre
 * suivant, puis celui du bas se rabat par-dessus l'ancien.
 */
function spin(gsap: Gsap, cell: HTMLElement, delay: number) {
  const [top, bottom, foldTop, foldBottom] = HALVES.map((half) => cell.querySelector<HTMLElement>(`.std-${half}`));
  if (!top || !bottom || !foldTop || !foldBottom) return;
  const write = (half: HTMLElement, digit: number) => {
    if (half.firstElementChild) half.firstElementChild.textContent = String(digit);
  };
  const start = Number(cell.dataset.digit) || 0;
  const timeline = gsap.timeline({ delay });
  for (let step = 1; step <= 10; step += 1) {
    const next = (start + step) % 10;
    timeline
      .set(foldBottom, { rotationX: 90 })
      .call(() => {
        write(top, next);
        write(foldBottom, next);
      })
      .fromTo(foldTop, { rotationX: 0 }, { rotationX: -90, duration: 0.055, ease: "power1.in" })
      .to(foldBottom, { rotationX: 0, duration: 0.055, ease: "power1.out" })
      .call(() => {
        write(bottom, next);
        write(foldTop, next);
      })
      .set(foldTop, { rotationX: 0 });
  }
}

/*
 * Le mouvement du modèle Stade : les chiffres du tableau basculent à l'arrivée ;
 * les lignes du terrain se tracent à la chaux devant chaque catégorie, sa
 * plaque entre comme un habillage de télévision, les vignettes se collent, et
 * le ballon avance le long de la barre à mesure qu'on lit.
 */
function setup({ gsap, root }: TemplateMotionTools) {
  gsap.utils.toArray<HTMLElement>(".std-flap", root).forEach((cell, index) => spin(gsap, cell, 0.5 + index * 0.09));

  const bar = root.querySelector(".std-bar");
  if (bar) {
    gsap.fromTo(
      bar,
      { "--p": 0 },
      { "--p": 1, ease: "none", scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: 0.4 } },
    );
  }

  root.querySelectorAll<HTMLElement>(".std-part").forEach((part) => {
    if (!isBelowFold(part)) return;
    const kick = part.querySelector(".std-kick");
    const marks = part.querySelectorAll(".std-lines path, .std-lines circle:not(.std-spot)");
    const timeline = gsap.timeline({ scrollTrigger: { trigger: part, start: "top 86%", once: true } });
    timeline
      .fromTo(kick, { "--drawn": 0 }, { "--drawn": 1, duration: 0.6, ease: "power2.inOut" })
      // pathLength="1" est posé dans le dessin : le trait se trace de 0 à 1, sans avoir à le mesurer.
      .fromTo(marks, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut", stagger: 0.12 }, 0.2)
      .from(part.querySelector(".std-spot"), { opacity: 0, duration: 0.2 }, 0.9)
      .fromTo(
        part.querySelector(".std-title"),
        { clipPath: "inset(-20% 100% -20% 0)" },
        { clipPath: "inset(-20% -5% -20% 0)", duration: 0.5, ease: "power3.out", clearProps: "clipPath" },
        0.35,
      );
  });

  // Les vignettes se collent une à une, avec le petit claquement du papier.
  root.querySelectorAll<HTMLElement>(".std-card").forEach((card, index) => {
    if (!isBelowFold(card)) return;
    gsap.from(card.querySelector(".std-stick"), {
      scale: 1.45,
      opacity: 0,
      rotation: index % 2 === 0 ? "-=12" : "+=12",
      duration: 0.45,
      ease: "back.out(2.2)",
      delay: (index % 2) * 0.09,
      scrollTrigger: { trigger: card, start: "top 92%", once: true },
    });
  });

  root.querySelectorAll<HTMLElement>(".std-sheet").forEach((sheet) => {
    const rows = Array.from(sheet.children).filter(isBelowFold);
    if (rows.length === 0) return;
    gsap.from(rows, {
      x: -28,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
      stagger: 0.06,
      scrollTrigger: { trigger: rows[0], start: "top 92%", once: true },
    });
  });
}

export function StadeMotion() {
  const anchor = useTemplateMotion(setup);
  return <span ref={anchor} hidden />;
}
