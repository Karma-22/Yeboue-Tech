/*
 * Les entrées en scène communes à tous les modèles. Un modèle marque ses
 * éléments, et ils s'animent quand ils arrivent à l'écran :
 *
 * - `data-reveal="up|fade|left|right|pop|clip|write"` : l'élément entre ;
 * - `data-reveal-group` : ses enfants directs entrent l'un après l'autre ;
 * - `data-parallax="0.2"` : l'élément glisse plus lentement que la page (0.2 au plus : en haut de
 *   page, l'image doit dépasser son cadre de 20 % vers le haut) ;
 * - `data-draw` : un tracé SVG se dessine.
 *
 * Rien n'est caché par le CSS : sans JavaScript, ou si la personne a demandé
 * moins d'animations, tout reste simplement visible.
 */

export interface MotionTools {
  gsap: typeof import("gsap").gsap;
  ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;
  /** L'élément racine du modèle : toutes les recherches se font dedans. */
  root: HTMLElement;
}

type Vars = Record<string, string | number>;

/*
 * Un élément qui attend son entrée est transparent, mais jamais retiré de la
 * page (pas de `visibility: hidden`) : il reste atteignable au clavier et lu
 * par les lecteurs d'écran, qui n'ont pas à faire défiler pour le découvrir.
 */
const FROM: Record<string, Vars> = {
  up: { opacity: 0, y: 32 },
  fade: { opacity: 0 },
  left: { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  pop: { opacity: 0, scale: 0.82, rotation: -4 },
  clip: { clipPath: "inset(0 0 100% 0)" },
  write: { opacity: 0, x: -14 },
};

const TO: Record<string, Vars> = {
  up: { opacity: 1, y: 0, duration: 0.75, ease: "power3.out" },
  fade: { opacity: 1, duration: 0.9, ease: "power2.out" },
  left: { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" },
  right: { opacity: 1, x: 0, duration: 0.75, ease: "power3.out" },
  pop: { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.9)" },
  clip: { clipPath: "inset(0 0 0% 0)", duration: 1, ease: "power3.inOut" },
  write: { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
};

/** Vrai si l'élément est encore sous l'écran : ce qui est déjà visible reste en place, on n'anime que ce qui arrive. */
export function isBelowFold(element: Element): boolean {
  return element.getBoundingClientRect().top > window.innerHeight * 0.92;
}

/** À appeler dans un `gsap.context` : il se charge du nettoyage. */
export function applyReveals({ gsap, ScrollTrigger, root }: MotionTools): void {
  const reveal = (elements: Element[], kind: string, stagger: number) => {
    if (elements.length === 0) return;
    const name = kind in FROM ? kind : "up";
    gsap.set(elements, FROM[name]);
    ScrollTrigger.batch(elements, {
      start: "top 90%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { ...TO[name], stagger, overwrite: true }),
    });
  };

  const grouped = new Set<Element>();
  root.querySelectorAll<HTMLElement>("[data-reveal-group]").forEach((group) => {
    const children = Array.from(group.children).filter(isBelowFold);
    children.forEach((child) => grouped.add(child));
    reveal(children, group.dataset.revealGroup || "up", 0.07);
  });

  const byKind = new Map<string, Element[]>();
  root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
    if (grouped.has(element) || !isBelowFold(element)) return;
    const kind = element.dataset.reveal || "up";
    byKind.set(kind, [...(byKind.get(kind) ?? []), element]);
  });
  byKind.forEach((elements, kind) => reveal(elements, kind, 0.09));

  root.querySelectorAll<HTMLElement>("[data-parallax]").forEach((element) => {
    const speed = Number(element.dataset.parallax) || 0.2;
    const frame = element.parentElement ?? element;
    if (frame.getBoundingClientRect().top < window.innerHeight * 0.5) {
      // En haut de page : l'image ne bouge pas à l'arrivée, puis descend moins vite que la page.
      gsap.fromTo(
        element,
        { y: 0 },
        {
          y: () => speed * frame.offsetHeight,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true },
        },
      );
    } else {
      gsap.fromTo(
        element,
        { yPercent: -speed * 50 },
        {
          yPercent: speed * 50,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }
  });

  root.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach((path) => {
    if (!isBelowFold(path)) return;
    // pathLength="1" ramène la longueur du tracé à 1 : pas besoin de la mesurer.
    path.setAttribute("pathLength", "1");
    gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 1.1,
      ease: "power2.inOut",
      scrollTrigger: { trigger: path, start: "top 88%", once: true },
    });
  });
}
