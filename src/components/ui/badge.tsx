import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeStyles = cva(
  "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "bg-surface-sunken text-fg-muted",
        solid: "bg-fg text-surface",
        accent: "bg-accent-soft text-accent-text",
        signal: "bg-signal-soft text-signal-text",
        success: "bg-success-soft text-success-text",
        warning: "bg-warning-soft text-warning-text",
        danger: "bg-danger-soft text-danger-text",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

interface BadgeProps extends React.ComponentProps<"span">, VariantProps<typeof badgeStyles> {
  /** Ajoute un point devant le texte ; `live` le fait battre (« En direct »). */
  dot?: boolean | "live";
}

/** Étiquette d'état : commande, abonnement, disponibilité. */
export function Badge({ tone, dot = false, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeStyles({ tone }), className)} {...props}>
      {dot && (
        <span
          aria-hidden="true"
          className={cn("size-1.5 rounded-full bg-current", dot === "live" && "animate-live")}
        />
      )}
      {children}
    </span>
  );
}
