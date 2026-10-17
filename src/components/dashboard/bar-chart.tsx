"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";

export interface ChartPoint {
  /** Ce qui distingue le point : la date, `aaaa-mm-jj`. */
  key: string;
  /** La date telle qu'on la lit : « 06/10 ». */
  label: string;
  value: number;
}

interface BarChartProps {
  /** Ce que mesure le graphique : « Scans », « Ventes ». Il n'y a qu'une série, donc pas de légende. */
  label: string;
  points: ChartPoint[];
  /** Des nombres entiers, ou des montants en francs CFA. */
  format: "count" | "price";
}

const write = (value: number, format: "count" | "price") => (format === "price" ? formatPrice(value) : String(value));

/** Le plus petit pas « rond » au moins égal à `raw` : 1, 2, 5, 10, 20, 50… */
function roundStep(raw: number): number {
  const power = 10 ** Math.floor(Math.log10(Math.max(raw, 1)));
  const fraction = Math.max(raw, 1) / power;
  return (fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10) * power;
}

/**
 * Un diagramme en bâtons, un bâton par jour. Le survol (ou les flèches du
 * clavier) donne la valeur du jour ; le tableau, dessous, donne les mêmes
 * chiffres à qui ne voit pas le dessin.
 */
export function BarChart({ label, points, format }: BarChartProps) {
  const [active, setActive] = useState<number | null>(null);
  const step = roundStep(Math.max(...points.map((point) => point.value)) / 2);
  const top = step * 2;
  const current = active === null ? null : points[active];

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const index = Math.floor(((event.clientX - box.left) / box.width) * points.length);
    setActive(Math.min(points.length - 1, Math.max(0, index)));
  };
  const fromKey = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const move = event.key === "ArrowLeft" ? -1 : 1;
    setActive((index) => Math.min(points.length - 1, Math.max(0, (index ?? points.length - 1) + move)));
  };

  return (
    <figure>
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3">
        {/* L'échelle : trois repères ronds, discrets. */}
        <div aria-hidden="true" className="flex h-44 flex-col justify-between text-right text-xs leading-none text-fg-subtle tabular-nums">
          <span>{write(top, format)}</span>
          <span>{write(step, format)}</span>
          <span>0</span>
        </div>

        <div
          role="group"
          tabIndex={0}
          aria-label={`${label}, jour par jour, sur ${points.length} jours. Les flèches gauche et droite donnent la valeur de chaque jour.`}
          onPointerMove={fromPointer}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive((index) => index ?? points.length - 1)}
          onBlur={() => setActive(null)}
          onKeyDown={fromKey}
          className="relative h-44 rounded-xs"
        >
          {[0, 50, 100].map((position) => (
            <span key={position} aria-hidden="true" style={{ bottom: `${position}%` }} className="absolute inset-x-0 h-px bg-line" />
          ))}

          {/* Chaque jour a sa colonne entière pour cible ; le bâton, lui, ne dépasse pas 24 px de large. */}
          <div className="absolute inset-0 flex items-end">
            {points.map((point, index) => (
              <div key={point.key} className={cn("flex h-full flex-1 items-end justify-center px-px", index === active && "bg-fg/6")}>
                <div
                  style={point.value > 0 ? { height: `${(point.value / top) * 100}%` } : undefined}
                  className={cn(
                    "w-full max-w-6 rounded-t-[4px] bg-chart transition-opacity",
                    point.value === 0 && "h-px rounded-none bg-line-strong",
                    active !== null && index !== active && "opacity-55",
                  )}
                />
              </div>
            ))}
          </div>

          {current && active !== null && (
            <div
              style={{ left: `${((active + 0.5) / points.length) * 100}%` }}
              className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full rounded-md bg-fg px-3 py-1.5 text-center whitespace-nowrap text-surface shadow-md"
            >
              <span className="block text-sm font-semibold">{write(current.value, format)}</span>
              <span className="block text-xs opacity-75">{current.label}</span>
            </div>
          )}
        </div>

        <span />
        <figcaption className="mt-2 flex justify-between text-xs text-fg-subtle tabular-nums">
          <span>{points[0]?.label}</span>
          <span>{points[Math.floor(points.length / 2)]?.label}</span>
          <span>Aujourd&apos;hui</span>
        </figcaption>
      </div>

      <p aria-live="polite" className="sr-only">
        {current ? `${current.label} : ${write(current.value, format)}` : ""}
      </p>

      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold text-fg-muted">Voir les chiffres</summary>
        <table className="mt-2 w-full max-w-xs tabular-nums">
          <caption className="sr-only">{label}, jour par jour</caption>
          <tbody>
            {[...points].reverse().map((point) => (
              <tr key={point.key} className="border-b border-line last:border-b-0">
                <th scope="row" className="py-1.5 text-left font-normal text-fg-muted">
                  {point.label}
                </th>
                <td className="py-1.5 text-right font-semibold">{write(point.value, format)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}
