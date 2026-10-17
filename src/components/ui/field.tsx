import { useId } from "react";
import { CircleAlert } from "lucide-react";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils/cn";

interface FieldProps {
  label: string;
  /** Aide affichée sous le champ. Remplacée par l'erreur quand il y en a une. */
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  /** Un seul champ : Input, Textarea ou Select. */
  children: React.ReactElement;
}

/**
 * Entoure un champ de son libellé, de son aide et de son erreur, et les relie
 * entre eux pour les lecteurs d'écran.
 */
export function Field({ label, hint, error, optional = false, className, children }: FieldProps) {
  const id = useId();
  const messageId = `${id}-message`;
  const message = error ?? hint;

  return (
    <div className={cn("grid content-start gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-fg">
          {label}
        </label>
        {optional && <span className="text-xs text-fg-subtle">Facultatif</span>}
      </div>

      <Slot.Root
        id={id}
        aria-describedby={message ? messageId : undefined}
        aria-invalid={error ? true : undefined}
      >
        {children}
      </Slot.Root>

      {error ? (
        <p id={messageId} role="alert" className="flex gap-1.5 text-sm font-medium text-danger-text">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={messageId} className="text-sm text-fg-muted">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
