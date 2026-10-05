import { cn } from "@/lib/utils/cn";

/** Colonne centrale des pages : largeur maximale et marges latérales. */
export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)} {...props} />;
}
