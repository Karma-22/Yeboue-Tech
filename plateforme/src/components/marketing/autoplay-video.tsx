"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

interface AutoplayVideoProps {
  src: string;
  poster: string;
  className?: string;
}

/**
 * Vidéo d'ambiance, muette et en boucle. Elle n'est téléchargée et lancée que
 * lorsqu'elle entre dans l'écran, et s'arrête dès qu'elle en sort : rien n'est
 * chargé pour qui ne descend pas jusque-là. Si la personne a demandé moins
 * d'animations, seule l'image fixe s'affiche.
 */
export function AutoplayVideo({ src, poster, className }: AutoplayVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Le navigateur peut refuser la lecture automatique : l'image fixe reste alors affichée.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
      className={cn("size-full object-cover", className)}
    />
  );
}
