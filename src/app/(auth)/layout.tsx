import Link from "next/link";
import { Logo, LogoMark } from "@/components/brand/logo";

/** Les pages de compte : le formulaire d'un côté, la marque de l'autre sur grand écran. */
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <Link href="/" className="self-start rounded-sm">
          <Logo className="h-7" />
        </Link>
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">{children}</main>
      </div>

      <aside
        data-theme="dark"
        aria-hidden="true"
        className="relative isolate hidden overflow-hidden bg-surface lg:flex lg:flex-col lg:justify-end lg:p-14"
      >
        <LogoMark className="absolute -top-24 -right-24 -z-10 size-96 opacity-20" />
        <LogoMark className="absolute -bottom-28 -left-28 -z-10 size-80 opacity-10" />
        <p className="type-display-2 max-w-md">Votre carte en ligne, votre QR Code sur les tables.</p>
        <p className="type-lead mt-5 max-w-sm text-fg-muted">
          Quinze minutes pour créer votre page. Quatorze jours pour l&apos;essayer.
        </p>
      </aside>
    </div>
  );
}
