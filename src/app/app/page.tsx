import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import { AccountBar, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { siteHost } from "@/config/site";
import { requireUser } from "@/lib/auth/session";
import { panelState, STATE_LABELS } from "@/lib/billing/panel";
import { listEstablishmentsOf } from "@/lib/db/establishments";
import { accentStyle } from "@/lib/utils/color";
import { TYPE_LABELS } from "@/templates/types";

/** Mes établissements. Avec un seul, on y entre directement ; sans aucun, on en crée un. */
export default async function AppHomePage() {
  const { user, session } = await requireUser();
  const establishments = await listEstablishmentsOf(user);
  if (establishments.length === 0 && !session.superAdmin) redirect("/app/nouveau");
  if (establishments.length === 1 && !session.superAdmin) redirect(`/app/${establishments[0].id}`);

  return (
    <>
      <AccountBar admin={session.superAdmin} />
      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <PageHeader
          title={`Bonjour ${user.firstName}.`}
          description="Choisissez l'établissement à gérer."
          action={
            <Link href="/app/nouveau" className={buttonStyles({ variant: "outline" })}>
              <Plus aria-hidden="true" className="size-4" />
              Nouvel établissement
            </Link>
          }
        />
        <ul className="grid gap-4 sm:grid-cols-2">
          {establishments.map((establishment) => {
            const { state } = panelState(establishment);
            return (
              <li key={establishment.id}>
                <Link
                  href={`/app/${establishment.id}`}
                  style={accentStyle(establishment.accentColor)}
                  className="group flex h-full flex-col rounded-lg border border-line bg-surface-raised p-5 transition-shadow hover:shadow-md"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="grid size-11 place-items-center rounded-md bg-(--brand) font-display text-lg font-bold text-(--on-brand)">
                      {establishment.name.charAt(0).toUpperCase()}
                    </span>
                    <Badge tone={state === "active" || state === "trial" ? "success" : state === "none" ? "neutral" : "warning"}>
                      {STATE_LABELS[state]}
                    </Badge>
                  </span>
                  <span className="mt-4 font-display text-xl font-bold">{establishment.name}</span>
                  <span className="text-sm text-fg-muted">
                    {TYPE_LABELS[establishment.type].fr} · {establishment.district}
                  </span>
                  <span className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="truncate text-fg-subtle">
                      {siteHost}/{establishment.slug}
                    </span>
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
}
