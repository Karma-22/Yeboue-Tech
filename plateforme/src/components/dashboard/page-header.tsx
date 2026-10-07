import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  /** Un bouton ou un lien, à droite du titre. */
  action?: React.ReactNode;
  className?: string;
}

/** Le titre d'une page du tableau de bord. */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <header className={cn("mb-8 flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 className="type-display-3">{title}</h1>
        {description && <p className="mt-2 max-w-xl text-fg-muted">{description}</p>}
      </div>
      {action}
    </header>
  );
}

/** Un bloc de réglages : un titre, une explication, puis son contenu. */
export function Section({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-lg border border-line bg-surface-raised p-5 sm:p-6", className)}>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** La barre du haut des pages de compte, hors d'un établissement : le logo, le profil, la déconnexion. */
export function AccountBar({ admin = false }: { admin?: boolean }) {
  return (
    <div className="border-b border-line bg-surface-raised">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href="/app" className="rounded-sm">
          <Logo className="h-7" />
        </Link>
        <div className="flex items-center gap-1 text-sm font-semibold">
          {admin && (
            <Link href="/admin" className="flex h-10 items-center rounded-md px-3 hover:bg-fg/7">
              Administration
            </Link>
          )}
          <Link href="/app/compte" className="flex h-10 items-center rounded-md px-3 hover:bg-fg/7">
            Mon compte
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Se déconnecter"
              className="grid size-10 place-items-center rounded-md text-fg-muted hover:bg-fg/7 hover:text-fg"
            >
              <LogOut aria-hidden="true" className="size-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/** Un chiffre clé : ce qu'il compte, puis sa valeur. Pour une valeur seule, pas de graphique. */
export function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface-raised p-5">
      <p className="text-sm text-fg-muted">{label}</p>
      <p className="mt-1 text-3xl leading-tight font-semibold tracking-[-0.01em]">{value}</p>
      {hint && <p className="mt-1 text-xs text-fg-subtle">{hint}</p>}
    </div>
  );
}
