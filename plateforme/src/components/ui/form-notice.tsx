import { cn } from "@/lib/utils/cn";

interface FormNoticeProps {
  /** Ce qu'a renvoyé l'action du formulaire. */
  state: { message?: string; ok?: boolean };
  className?: string;
}

/** Le message général d'un formulaire : une erreur, ou une confirmation. */
export function FormNotice({ state, className }: FormNoticeProps) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={cn(
        "rounded-md px-4 py-3 text-sm font-medium",
        state.ok ? "bg-success-soft text-success-text" : "bg-danger-soft text-danger-text",
        className,
      )}
    >
      {state.message}
    </p>
  );
}
