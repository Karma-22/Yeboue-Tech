import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";
import { Spinner } from "./spinner";

/**
 * Apparence d'un bouton. S'applique aussi à un lien :
 * `<Link className={buttonStyles({ variant: "primary" })}>`.
 */
export const buttonStyles = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 font-semibold whitespace-nowrap select-none",
    "transition-[background-color,border-color,color,translate] duration-150 ease-out",
    "active:translate-y-px disabled:pointer-events-none disabled:not-aria-busy:opacity-50",
    "[&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        // L'action principale de l'écran : une seule par vue.
        primary:
          "bg-accent text-on-accent shadow-[inset_0_-2px_0_rgb(20_33_61/0.16)] hover:bg-accent-hover active:bg-accent-active active:shadow-none",
        secondary: "bg-fg text-surface hover:bg-fg/88",
        outline: "border border-line-strong text-fg hover:border-fg hover:bg-fg/5",
        ghost: "text-fg hover:bg-fg/7",
        danger: "bg-danger text-on-danger hover:bg-danger-hover",
      },
      size: {
        sm: "h-9 rounded-sm px-3.5 text-sm",
        md: "h-11 rounded-md px-5 text-[0.9375rem]",
        lg: "h-13 rounded-[0.875rem] px-7 text-base",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonStyles> {
  /** Affiche un indicateur d'attente et bloque le bouton, sans changer sa largeur. */
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  block,
  loading = false,
  disabled,
  type = "button",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonStyles({ variant, size, block }), className)}
      {...props}
    >
      {loading ? (
        <>
          <span className="absolute inset-0 grid place-items-center">
            <Spinner />
            <span className="sr-only">Chargement</span>
          </span>
          <span className="invisible inline-flex items-center gap-2">{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
