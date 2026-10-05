import { cn } from "@/lib/utils/cn";

/** Surface en relief qui regroupe un contenu : une commande, un plat, un réglage. */
export function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("rounded-lg border border-line bg-surface-raised shadow-xs", className)}
      {...props}
    />
  );
}
