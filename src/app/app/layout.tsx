import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false } };

/** Tout ce qui est sous /app demande un compte dont l'e-mail est vérifié (ARCHITECTURE.md §6.1). */
export default async function AppLayout({ children }: LayoutProps<"/app">) {
  await requireUser();
  return <div className="min-h-dvh bg-surface">{children}</div>;
}
