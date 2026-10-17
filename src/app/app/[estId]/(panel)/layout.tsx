import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BellRing,
  BookOpenText,
  ChartColumn,
  CreditCard,
  ExternalLink,
  House,
  LogOut,
  Palette,
  QrCode,
  Store,
  UserRound,
  Users,
} from "lucide-react";
import { signOut } from "@/app/(auth)/actions";
import { LogoMark } from "@/components/brand/logo";
import { PanelNav, type PanelNavItem } from "@/components/dashboard/panel-nav";
import { site } from "@/config/site";
import { can, ROLE_LABELS, type Action } from "@/lib/auth/permissions";
import { requireAccess } from "@/lib/auth/session";
import { panelState, type PanelState } from "@/lib/billing/panel";
import { cn } from "@/lib/utils/cn";

const ITEMS: (PanelNavItem & { needs?: Action })[] = [
  { path: "", label: "Accueil", icon: <House aria-hidden="true" /> },
  { path: "/commandes", label: "Commandes", icon: <BellRing aria-hidden="true" />, needs: "orders.handle" },
  { path: "/menu", label: "Carte", icon: <BookOpenText aria-hidden="true" />, needs: "items.toggle" },
  { path: "/tables", label: "Tables et QR Codes", icon: <QrCode aria-hidden="true" />, needs: "tables.edit" },
  { path: "/apparence", label: "Apparence", icon: <Palette aria-hidden="true" />, needs: "page.edit" },
  { path: "/informations", label: "Informations", icon: <Store aria-hidden="true" />, needs: "page.edit" },
  { path: "/statistiques", label: "Statistiques", icon: <ChartColumn aria-hidden="true" />, needs: "stats.view" },
  { path: "/equipe", label: "Équipe", icon: <Users aria-hidden="true" />, needs: "team.manage" },
  { path: "/abonnement", label: "Abonnement", icon: <CreditCard aria-hidden="true" />, needs: "billing.manage" },
];

/** Le bandeau qui dit où en est l'abonnement, quand il y a quelque chose à savoir (ARCHITECTURE.md §8). */
function StateBanner({ panel, href }: { panel: PanelState; href: string }) {
  const days = `${panel.daysLeft} jour${panel.daysLeft > 1 ? "s" : ""}`;
  const messages: Partial<Record<PanelState["state"], [string, string]>> = {
    trial: ["bg-accent-soft text-accent-text", `Essai gratuit : encore ${days}.`],
    grace: ["bg-warning-soft text-warning-text", "Votre abonnement a expiré. Renouvelez-le pour que rien ne s'arrête."],
    limited: [
      "bg-danger-soft text-danger-text",
      "Abonnement expiré : votre carte reste visible, mais la commande est coupée et vous ne pouvez plus rien modifier.",
    ],
    offline: ["bg-danger-soft text-danger-text", "Abonnement expiré : votre page n'est plus en ligne."],
    suspended: ["bg-danger-soft text-danger-text", `Votre établissement est suspendu. Écrivez-nous au ${site.contact.phoneDisplay}.`],
  };
  const message = messages[panel.state];
  // Pendant l'essai, on ne le rappelle que la dernière semaine.
  if (!message || (panel.state === "trial" && panel.daysLeft > 7)) return null;
  return (
    <p className={cn("px-5 py-2.5 text-center text-sm font-semibold sm:px-8", message[0])}>
      {message[1]}{" "}
      <Link href={href} className="underline underline-offset-4">
        Voir mon abonnement
      </Link>
    </p>
  );
}

/** Le cadre du tableau de bord d'un établissement : son menu, son état, puis la page demandée. */
export default async function PanelLayout({ children, params }: LayoutProps<"/app/[estId]">) {
  const { estId } = await params;
  const { establishment, member } = await requireAccess(estId);
  // Tant que la création guidée n'est pas terminée, c'est elle qu'on affiche.
  if (establishment.subscription === null) redirect(`/app/${estId}/creation`);

  const base = `/app/${estId}`;
  const items = ITEMS.filter((item) => !item.needs || can(member.role, item.needs)).map(({ path, label, icon }) => ({
    path,
    label,
    icon,
  }));
  const footLink = "flex h-10 items-center gap-2.5 rounded-md px-3 text-sm font-semibold text-fg-muted hover:bg-fg/7 hover:text-fg";

  return (
    <div className="lg:grid lg:min-h-dvh lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 z-30 flex flex-col border-b border-line bg-surface-raised lg:h-dvh lg:border-r lg:border-b-0 lg:p-4">
        <div className="flex items-center gap-3 px-4 py-3 lg:px-2 lg:pb-5">
          <Link href="/app" aria-label="Mes établissements" className="shrink-0 rounded-sm">
            <LogoMark className="size-9" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display leading-tight font-bold">{establishment.name}</p>
            <p className="truncate text-xs text-fg-muted">{ROLE_LABELS[member.role]}</p>
          </div>
          <a
            href={`/${establishment.slug}`}
            target="_blank"
            rel="noopener"
            className="flex h-9 items-center gap-1.5 rounded-sm border border-line-strong px-3 text-sm font-semibold lg:hidden"
          >
            Ma page
            <ExternalLink aria-hidden="true" className="size-3.5" />
          </a>
          <Link
            href="/app/compte"
            aria-label="Mon compte"
            className="grid size-9 place-items-center rounded-sm border border-line-strong lg:hidden"
          >
            <UserRound aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <PanelNav base={base} items={items} />
        <div className="mt-auto hidden border-t border-line pt-3 lg:block">
          <a href={`/${establishment.slug}`} target="_blank" rel="noopener" className={footLink}>
            <ExternalLink aria-hidden="true" className="size-[1.125rem]" />
            Voir ma page
          </a>
          <Link href="/app/compte" className={footLink}>
            <UserRound aria-hidden="true" className="size-[1.125rem]" />
            Mon compte
          </Link>
          <form action={signOut}>
            <button type="submit" className={cn(footLink, "w-full")}>
              <LogOut aria-hidden="true" className="size-[1.125rem]" />
              Me déconnecter
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0">
        <StateBanner panel={panelState(establishment)} href={`${base}/abonnement`} />
        <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 lg:py-10">{children}</main>
      </div>
    </div>
  );
}
