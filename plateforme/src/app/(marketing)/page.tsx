import Link from "next/link";
import { Logo, LogoMark } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils/cn";

// Page d'attente. Le vrai site vitrine arrive à l'étape 2 (ARCHITECTURE.md §16).
export default function HomePage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden">
      <Container className="relative z-10 flex flex-1 flex-col py-8 sm:py-10">
        <Logo className="self-start" />

        <div className="my-auto max-w-3xl py-20">
          <p className="type-eyebrow text-fg-subtle">Plateforme en construction</p>
          <h1 className="type-display-1 mt-5">Votre menu en ligne en 15&nbsp;minutes.</h1>
          <p className="type-lead mt-7 max-w-xl text-fg-muted">
            Votre QR Code sur les tables ce soir. Vos plats et vos prix modifiés depuis votre
            téléphone, sans rien réimprimer.
          </p>

          {process.env.NODE_ENV === "development" && (
            <Link href="/charte" className={cn(buttonStyles({ variant: "secondary" }), "mt-10")}>
              Voir la charte d&apos;interface
            </Link>
          )}
        </div>
      </Container>

      {/* Le repère, posé dans l'angle de la page comme au coin d'un QR Code. */}
      <LogoMark
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -bottom-20 size-64 sm:-right-28 sm:-bottom-28 sm:size-104"
      />
    </main>
  );
}
