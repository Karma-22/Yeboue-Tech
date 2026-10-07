"use client";

import { useTemplateMotion, type TemplateMotionTools } from "../kit/motion";
import { isBelowFold } from "../kit/reveals";

/*
 * Le mouvement du modèle Gbaka : les cars roulent. Celui du haut avance avec la
 * page ; ceux des catégories entrent par la gauche, et leurs roues tournent
 * quand on fait défiler leurs vitres du doigt.
 */
function setup({ gsap, root }: TemplateMotionTools) {
  const lead = root.querySelector<HTMLElement>(".gbk-lead");
  if (lead) {
    const whileLeaving = { trigger: lead, start: "top top", end: "bottom top", scrub: 0.4 };
    gsap.to(lead.querySelectorAll(".gbk-wheel"), { rotation: 540, ease: "none", scrollTrigger: whileLeaving });
    gsap.to(lead.querySelector(".gbk-windows"), { xPercent: -14, ease: "none", scrollTrigger: whileLeaving });
  }

  const stops: (() => void)[] = [];
  root.querySelectorAll<HTMLElement>(".gbk-line .gbk-bus").forEach((bus) => {
    const wheels = bus.querySelectorAll(".gbk-wheel");
    if (isBelowFold(bus)) {
      const arriving = { trigger: bus, start: "top 90%", once: true };
      gsap.from(bus, { xPercent: -16, skewX: -4, opacity: 0, duration: 0.95, ease: "power3.out", scrollTrigger: arriving });
      gsap.from(wheels, { rotation: -540, duration: 0.95, ease: "power3.out", scrollTrigger: arriving });
      gsap.from(bus.querySelectorAll(".gbk-stripe"), {
        scaleX: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.35,
        scrollTrigger: arriving,
      });
    }

    // Faire défiler les vitres fait tourner les roues : le car avance sous le doigt.
    const row = bus.querySelector<HTMLElement>(".gbk-windows");
    if (!row) return;
    const roll = () => gsap.set(wheels, { rotation: row.scrollLeft * 1.15 });
    row.addEventListener("scroll", roll, { passive: true });
    stops.push(() => row.removeEventListener("scroll", roll));
  });

  return () => stops.forEach((stop) => stop());
}

export function GbakaMotion() {
  const anchor = useTemplateMotion(setup);
  return <span ref={anchor} hidden />;
}
