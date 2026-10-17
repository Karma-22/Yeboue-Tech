import type { Metadata } from "next";
import Link from "next/link";
import { BookText, CreditCard, LayoutDashboard, Store, Users } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { PanelNav } from "@/components/dashboard/panel-nav";
import { requireSuperAdmin } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Administration", robots: { index: false } };

const ITEMS = [
  { path: "", label: "Vue d'ensemble", icon: <LayoutDashboard aria-hidden="true" /> },
  { path: "/etablissements", label: "Établissements", icon: <Store aria-hidden="true" /> },
  { path: "/paiements", label: "Paiements", icon: <CreditCard aria-hidden="true" /> },
  { path: "/comptes", label: "Comptes", icon: <Users aria-hidden="true" /> },
  { path: "/journal", label: "Journal", icon: <BookText aria-hidden="true" /> },
];

/** L'administration de la plateforme (ARCHITECTURE.md §3.2) : réservée au compte super-administrateur. */
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  await requireSuperAdmin();
  return (
    <div className="min-h-dvh bg-surface lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 z-30 flex flex-col border-b border-line bg-surface-raised lg:h-dvh lg:border-r lg:border-b-0 lg:p-4">
        <div className="flex items-center gap-3 px-4 py-3 lg:px-2 lg:pb-5">
          <LogoMark className="size-9" />
          <div className="min-w-0 flex-1">
            <p className="font-display leading-tight font-bold">Administration</p>
            <p className="text-xs text-fg-muted">Réservée à vous</p>
          </div>
        </div>
        <PanelNav base="/admin" items={ITEMS} />
        <div className="mt-auto hidden border-t border-line pt-3 lg:block">
          <Link href="/app" className="flex h-10 items-center rounded-md px-3 text-sm font-semibold text-fg-muted hover:bg-fg/7 hover:text-fg">
            Retour au tableau de bord
          </Link>
        </div>
      </aside>
      <main className="mx-auto w-full max-w-5xl min-w-0 px-5 py-8 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
