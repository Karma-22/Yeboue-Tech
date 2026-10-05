import { cn } from "@/lib/utils/cn";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  className?: string;
}

/** En-tête d'une section du site vitrine : surtitre, grand titre, phrase d'introduction. */
export function SectionHeading({ eyebrow, title, intro, className }: SectionHeadingProps) {
  return (
    <div data-reveal className={cn("max-w-3xl", className)}>
      <p className="type-eyebrow text-accent-text">{eyebrow}</p>
      <h2 className="type-display-2 mt-4">{title}</h2>
      {intro && <p className="type-lead mt-5 max-w-2xl text-fg-muted">{intro}</p>}
    </div>
  );
}
