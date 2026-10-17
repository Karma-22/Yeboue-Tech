"use client";

import { useEffect, useRef } from "react";
import { applyReveals, type MotionTools } from "./reveals";

/*
 * Le moteur d'animation des modèles. GSAP et ses extensions ne sont téléchargés
 * qu'après l'affichage : la carte se lit tout de suite, même en 3G, et s'anime
 * ensuite. Un modèle n'emporte que les extensions qu'il demande.
 *
 * Rien ne se lance si la personne a demandé moins d'animations.
 */

const PLUGINS = {
  SplitText: () => import("gsap/SplitText").then((module) => module.SplitText),
  DrawSVG: () => import("gsap/DrawSVGPlugin").then((module) => module.DrawSVGPlugin),
  MorphSVG: () => import("gsap/MorphSVGPlugin").then((module) => module.MorphSVGPlugin),
  MotionPath: () => import("gsap/MotionPathPlugin").then((module) => module.MotionPathPlugin),
  Flip: () => import("gsap/Flip").then((module) => module.Flip),
  Draggable: () => import("gsap/Draggable").then((module) => module.Draggable),
  Inertia: () => import("gsap/InertiaPlugin").then((module) => module.InertiaPlugin),
  ScrambleText: () => import("gsap/ScrambleTextPlugin").then((module) => module.ScrambleTextPlugin),
  Physics2D: () => import("gsap/Physics2DPlugin").then((module) => module.Physics2DPlugin),
  CustomEase: () => import("gsap/CustomEase").then((module) => module.CustomEase),
  Observer: () => import("gsap/Observer").then((module) => module.Observer),
} as const;

export type PluginName = keyof typeof PLUGINS;

/** Les extensions demandées, une fois chargées. */
export type LoadedPlugins = { [Name in PluginName]?: Awaited<ReturnType<(typeof PLUGINS)[Name]>> };

export interface TemplateMotionTools extends MotionTools {
  plugins: LoadedPlugins;
}

const NO_PLUGINS: readonly PluginName[] = [];

/**
 * Anime un modèle. Les entrées en scène communes (`data-reveal`, `data-parallax`,
 * `data-draw`) sont toujours appliquées ; `setup` ajoute ce qui n'appartient
 * qu'à ce modèle. `setup` et `plugins` doivent être déclarés hors du composant,
 * pour ne pas changer d'un affichage à l'autre.
 *
 * Rend une référence à poser sur un élément placé dans le modèle : c'est par
 * elle qu'on retrouve sa racine (`data-template`).
 */
export function useTemplateMotion(
  /** Peut rendre une fonction de nettoyage, pour ce que GSAP ne défait pas lui-même (écouteurs, minuteries). */
  setup?: (tools: TemplateMotionTools) => void | (() => void),
  plugins: readonly PluginName[] = NO_PLUGINS,
) {
  const anchor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = anchor.current?.closest<HTMLElement>("[data-template]");
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let revert = () => {};

    (async () => {
      const [{ gsap }, { ScrollTrigger }, loaded] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        Promise.all(plugins.map((name) => PLUGINS[name]())),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger, ...loaded);

      const tools: TemplateMotionTools = {
        gsap,
        ScrollTrigger,
        root,
        plugins: Object.fromEntries(plugins.map((name, index) => [name, loaded[index]])) as LoadedPlugins,
      };
      // Tout ce qui est créé ici est défait d'un coup quand le modèle quitte l'écran.
      let cleanup: void | (() => void);
      const context = gsap.context(() => {
        applyReveals(tools);
        cleanup = setup?.(tools);
      }, root);
      revert = () => {
        cleanup?.();
        context.revert();
      };
    })();

    return () => {
      cancelled = true;
      revert();
    };
  }, [setup, plugins]);

  return anchor;
}
