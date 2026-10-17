"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { formatPrice } from "@/lib/utils/format";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Anime les billets des tarifs. Le contenu est déjà là, écrit par le serveur :
 * ce composant ne fait que le mettre en mouvement.
 * - À l'arrivée dans l'écran, chaque billet tombe sur la table, son prix se
 *   compte, ses lignes s'écrivent, et le tampon s'abat.
 * - À la souris, le billet s'incline vers le pointeur.
 */
export function PricingMotion({ className, children }: { className?: string; children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const tickets = gsap.utils.toArray<HTMLElement>("[data-ticket]");

        tickets.forEach((ticket, index) => {
          const price = ticket.querySelector<HTMLElement>("[data-price]");
          const lines = ticket.querySelectorAll("[data-line]");
          const stamp = ticket.querySelector("[data-stamp]");
          const side = index % 2 === 0 ? -1 : 1;

          const timeline = gsap.timeline({
            scrollTrigger: { trigger: ticket, start: "top 82%", once: true },
            delay: index * 0.14,
          });

          timeline.from(ticket, {
            y: 110,
            rotation: side * 7,
            autoAlpha: 0,
            duration: 0.95,
            ease: "back.out(1.5)",
          });

          if (price) {
            const target = Number(price.dataset.price);
            const counter = { value: 0 };
            timeline.to(
              counter,
              {
                value: target,
                duration: 1.1,
                ease: "power2.out",
                // Le compteur avance par pas de 500 F, comme un prix.
                onUpdate: () => {
                  price.textContent = formatPrice(Math.round(counter.value / 500) * 500);
                },
                onComplete: () => {
                  price.textContent = formatPrice(target);
                },
              },
              "<0.15",
            );
          }

          timeline.from(
            lines,
            { opacity: 0, x: -14, duration: 0.4, stagger: 0.06, ease: "power2.out" },
            "<0.3",
          );

          if (stamp) {
            timeline.from(
              stamp,
              { scale: 2.6, autoAlpha: 0, rotation: "+=22", duration: 0.4, ease: "back.out(2.4)" },
              "-=0.25",
            );
          }
        });

        // L'inclinaison au pointeur n'a de sens qu'avec une souris.
        if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

        const cleanups = tickets.map((ticket) => {
          const body = ticket.querySelector<HTMLElement>("[data-ticket-body]");
          if (!body) return () => {};
          const tiltX = gsap.quickTo(body, "rotationX", { duration: 0.5, ease: "power3.out" });
          const tiltY = gsap.quickTo(body, "rotationY", { duration: 0.5, ease: "power3.out" });

          const move = (event: PointerEvent) => {
            const box = ticket.getBoundingClientRect();
            tiltY(((event.clientX - box.left) / box.width - 0.5) * 8);
            tiltX(((event.clientY - box.top) / box.height - 0.5) * -8);
          };
          const leave = () => {
            tiltX(0);
            tiltY(0);
          };

          ticket.addEventListener("pointermove", move);
          ticket.addEventListener("pointerleave", leave);
          return () => {
            ticket.removeEventListener("pointermove", move);
            ticket.removeEventListener("pointerleave", leave);
          };
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
