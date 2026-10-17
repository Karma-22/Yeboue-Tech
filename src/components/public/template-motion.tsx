"use client";

import { useTemplateMotion } from "@/templates/kit/motion";

/**
 * Les entrées en scène communes, pour un modèle qui n'a pas d'animation à lui
 * (voir src/templates/kit/reveals.ts). À poser une fois, dans le modèle.
 */
export function TemplateMotion() {
  const anchor = useTemplateMotion();
  return <span ref={anchor} hidden />;
}
