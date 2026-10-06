import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const STEPS = ["L'établissement", "L'apparence", "La carte", "L'offre"];

interface StepsProps {
  /** L'écran affiché, de 1 à 4. */
  current: number;
  /** Revenir à un écran déjà passé : une action du serveur par écran, à partir du deuxième. */
  goTo?: Record<number, () => Promise<void>>;
}

/** Les quatre écrans de la création guidée, et où l'on en est. */
export function Steps({ current, goTo }: StepsProps) {
  return (
    <ol className="flex items-center gap-2 text-sm font-semibold">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const done = step < current;
        const back = done ? goTo?.[step] : undefined;
        const content = (
          <>
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-xs tabular-nums",
                done ? "bg-success text-white" : step === current ? "bg-fg text-surface" : "bg-surface-sunken text-fg-subtle",
              )}
            >
              {done ? <Check aria-hidden="true" strokeWidth={3} className="size-3.5" /> : step}
            </span>
            <span className={cn("hidden sm:inline", step === current ? "text-fg" : "text-fg-subtle")}>{label}</span>
          </>
        );
        return (
          <li key={label} aria-current={step === current ? "step" : undefined} className="flex flex-1 items-center gap-2 last:flex-none">
            {back ? (
              <form action={back}>
                <button type="submit" className="flex items-center gap-2 rounded-full hover:opacity-70">
                  {content}
                </button>
              </form>
            ) : (
              <span className="flex items-center gap-2">{content}</span>
            )}
            {step < STEPS.length && <span className={cn("h-px flex-1", done ? "bg-success" : "bg-line")} />}
          </li>
        );
      })}
    </ol>
  );
}
