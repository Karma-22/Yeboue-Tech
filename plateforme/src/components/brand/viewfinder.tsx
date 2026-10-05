import { cn } from "@/lib/utils/cn";

const CORNERS = [
  "top-0 left-0 rounded-tl-[inherit] border-t-2 border-l-2",
  "top-0 right-0 rounded-tr-[inherit] border-t-2 border-r-2",
  "bottom-0 left-0 rounded-bl-[inherit] border-b-2 border-l-2",
  "right-0 bottom-0 rounded-br-[inherit] border-r-2 border-b-2",
];

interface ViewfinderProps extends React.ComponentProps<"div"> {
  /** Taille des quatre angles (classe Tailwind, `size-7` par défaut). */
  cornerClassName?: string;
  /** Ajoute la ligne de scan cyan qui monte et descend. */
  scanning?: boolean;
}

/**
 * Le cadre de visée d'un scan : quatre angles autour du contenu. C'est le
 * motif de la marque pour encadrer une image, et le seul endroit où paraît
 * le cyan.
 */
export function Viewfinder({
  cornerClassName = "size-7",
  scanning = false,
  className,
  children,
  ...props
}: ViewfinderProps) {
  return (
    <div className={cn("relative rounded-md", className)} {...props}>
      {children}
      {CORNERS.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={cn("pointer-events-none absolute border-current", cornerClassName, corner)}
        />
      ))}
      {scanning && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[8%] h-0.5 animate-scan rounded-full bg-signal shadow-[0_0_10px_rgb(46_194_234/0.7)]"
        />
      )}
    </div>
  );
}
