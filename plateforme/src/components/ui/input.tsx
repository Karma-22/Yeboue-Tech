import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/*
 * Base commune aux champs de saisie. Le texte fait 16 px : en dessous, iOS
 * zoome sur la page dès qu'on touche le champ.
 */
const controlStyles = [
  "block w-full rounded-md border border-line-strong bg-surface-raised px-3.5 text-base text-fg",
  "placeholder:text-fg-subtle",
  "transition-[border-color,box-shadow] duration-150 ease-out",
  "hover:border-fg-subtle",
  "focus-visible:border-fg focus-visible:ring-3 focus-visible:ring-fg/15 focus-visible:outline-hidden",
  "aria-invalid:border-danger aria-invalid:focus-visible:ring-danger/20",
  "disabled:cursor-not-allowed disabled:border-line disabled:bg-surface-sunken disabled:text-fg-subtle",
];

export function Input({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return <input type={type} className={cn(controlStyles, "h-11", className)} {...props} />;
}

export function Textarea({ className, rows = 4, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={rows}
      className={cn(controlStyles, "min-h-24 resize-y py-2.5 leading-normal", className)}
      {...props}
    />
  );
}

/** Liste déroulante native : c'est elle qui se comporte le mieux sur téléphone. */
export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <span className="relative block">
      <select
        className={cn(controlStyles, "h-11 appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-fg-muted"
      />
    </span>
  );
}
