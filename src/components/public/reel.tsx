"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface ReelProps {
  /** Ce qui s'affiche sous les traits de progression : le nom de la catégorie. */
  label: React.ReactNode;
  /** Une image par article. Celle qui est à l'écran reçoit `data-active`. */
  slides: React.ReactNode[];
}

/**
 * Une suite d'images en plein écran qu'on feuillette du pouce, avec en haut un
 * trait par image, comme dans une « story ». Sur ordinateur, deux flèches.
 */
export function Reel({ label, slides }: ReelProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const onScroll = () => {
    const element = scroller.current;
    if (element) setIndex(Math.round(element.scrollLeft / element.clientWidth));
  };
  const go = (step: number) => {
    const element = scroller.current;
    element?.scrollBy({ left: step * element.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="relative h-full">
      <div
        ref={scroller}
        onScroll={onScroll}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, position) => (
          <div
            key={position}
            data-active={position === index ? "" : undefined}
            className="group/slide relative h-full w-full shrink-0 snap-center overflow-hidden"
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-4 top-3.5 z-10">
        <div className="flex gap-1">
          {slides.map((_, position) => (
            <span
              key={position}
              className={cn(
                "h-[3px] flex-1 rounded-full transition-colors duration-300",
                position <= index ? "bg-white" : "bg-white/30",
              )}
            />
          ))}
        </div>
        <div className="mt-3">{label}</div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Image précédente"
            className="absolute top-1/2 left-2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-opacity disabled:opacity-0 pointer-fine:grid"
          >
            <ChevronLeft aria-hidden="true" className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index >= slides.length - 1}
            aria-label="Image suivante"
            className="absolute top-1/2 right-2 z-10 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-opacity disabled:opacity-0 pointer-fine:grid"
          >
            <ChevronRight aria-hidden="true" className="size-5" />
          </button>
        </>
      )}
    </div>
  );
}
