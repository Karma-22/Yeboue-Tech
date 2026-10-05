import Link from "next/link";
import { LogoMark } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-5 py-16">
      <div className="w-full max-w-md">
        <LogoMark aria-hidden="true" className="size-12" />
        <p className="type-eyebrow mt-10 text-fg-subtle">Erreur 404</p>
        <h1 className="type-display-2 mt-3">Cette page n&apos;est pas au menu.</h1>
        <p className="mt-5 text-fg-muted">
          L&apos;adresse est peut-être mal écrite, ou la page a été retirée.
        </p>
        <Link href="/" className={cn(buttonStyles({ variant: "secondary" }), "mt-8")}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
