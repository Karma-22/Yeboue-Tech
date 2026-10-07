"use client";

import { useTemplateMotion, type TemplateMotionTools } from "../kit/motion";
import { isBelowFold } from "../kit/reveals";

type Timeline = ReturnType<TemplateMotionTools["gsap"]["timeline"]>;

/** Une ampoule s'allume : elle hésite deux fois avant de tenir. */
function light(timeline: Timeline, bulb: Element, at: number) {
  timeline
    .to(bulb, { "--on": 1, duration: 0.05, ease: "none" }, at)
    .to(bulb, { "--on": 0.12, duration: 0.05, ease: "none" }, at + 0.1)
    .to(bulb, { "--on": 1, duration: 0.06, ease: "none" }, at + 0.19)
    .to(bulb, { "--on": 0.45, duration: 0.05, ease: "none" }, at + 0.3)
    .to(bulb, { "--on": 1, duration: 0.18, ease: "power1.out" }, at + 0.36);
}

/*
 * Le mouvement du modèle Guirlande. Le script ne touche qu'à des réglages
 * (--open, --on, --lit, --swing, --gust) ; c'est la feuille de style qui en fait
 * des auvents qui se déplient et des ampoules qui s'allument et se balancent.
 *
 * - Chaque étal ouvre à son arrivée : l'auvent se rabat, ses trois lampes
 *   s'allument l'une après l'autre, et la planche s'éclaire un peu plus à chacune.
 * - Les ampoules se balancent quand on fait défiler, puis reviennent au repos.
 * - De temps en temps, un coup de vent traverse la guirlande du haut.
 */
function setup({ gsap, ScrollTrigger, root }: TemplateMotionTools) {
  root.querySelectorAll<HTMLElement>(".gld-stall").forEach((stall) => {
    if (!isBelowFold(stall)) return;
    const roof = stall.querySelector(".gld-roof");
    const board = stall.querySelector(".gld-board");
    const bulbs = Array.from(stall.querySelectorAll(".gld-lamps .gld-bulb"));
    gsap.set(roof, { "--open": 0 });
    gsap.set(bulbs, { "--on": 0 });
    gsap.set(board, { "--lit": 0 });

    const timeline = gsap.timeline({ scrollTrigger: { trigger: stall, start: "top 84%", once: true } });
    timeline.to(roof, { "--open": 1, duration: 0.95, ease: "back.out(2.4)" });
    bulbs.forEach((bulb, index) => {
      const at = 0.4 + index * 0.17;
      light(timeline, bulb, at);
      timeline.to(board, { "--lit": (index + 1) / bulbs.length, duration: 0.3, ease: "power2.out" }, at + 0.19);
    });
    timeline.from(stall.querySelectorAll(".gld-rows > li"), { y: 16, duration: 0.5, ease: "power2.out", stagger: 0.05 }, 0.55);
  });

  // La guirlande du bas s'allume à son tour.
  root.querySelectorAll<HTMLElement>(".gld-foot .gld-string").forEach((string) => {
    if (!isBelowFold(string)) return;
    const bulbs = Array.from(string.querySelectorAll(".gld-bulb"));
    gsap.set(bulbs, { "--on": 0 });
    const timeline = gsap.timeline({ scrollTrigger: { trigger: string, start: "top 92%", once: true } });
    bulbs.forEach((bulb, index) => light(timeline, bulb, index * 0.06));
  });

  // Faire défiler secoue les ampoules ; quand la page s'arrête, elles reviennent en oscillant.
  const rows = gsap.utils.toArray<HTMLElement>(".gld-string, .gld-lamps", root);
  let angle = 0;
  const swingTo = (next: number, vars: object) => {
    if (next === angle) return;
    angle = next;
    gsap.to(rows, { "--swing": next, overwrite: true, ...vars });
  };
  const follow = ScrollTrigger.create({
    trigger: root,
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => swingTo(Math.round(gsap.utils.clamp(-20, 20, self.getVelocity() / -170)), { duration: 0.3, ease: "power2.out" }),
  });
  const settle = () => swingTo(0, { duration: 1.8, ease: "elastic.out(1.1, 0.28)" });
  ScrollTrigger.addEventListener("scrollEnd", settle);

  // Le coup de vent : une vague qui court le long du fil. Il ne souffle que si la guirlande est à l'écran.
  const string = root.querySelector(".gld-hero .gld-string");
  const bulbs = string ? Array.from(string.querySelectorAll(".gld-bulb")) : [];
  const gust = gsap.timeline({ repeat: -1, repeatDelay: 6, delay: 4.5 });
  gust
    .to(bulbs, { "--gust": 15, duration: 0.45, ease: "sine.out", stagger: 0.045 })
    .to(bulbs, { "--gust": 0, duration: 2.4, ease: "elastic.out(1.2, 0.22)", stagger: 0.045 }, 0.45);
  ScrollTrigger.create({
    trigger: string,
    start: "top bottom",
    end: "bottom top",
    onToggle: (self) => (self.isActive ? gust.play() : gust.pause()),
  });

  return () => {
    ScrollTrigger.removeEventListener("scrollEnd", settle);
    follow.kill();
  };
}

export function GuirlandeMotion() {
  const anchor = useTemplateMotion(setup);
  return <span ref={anchor} hidden />;
}
