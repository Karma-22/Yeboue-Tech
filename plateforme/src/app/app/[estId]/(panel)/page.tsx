import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { CopyButton, PublishSwitch } from "@/components/dashboard/controls";
import { PageHeader, Section } from "@/components/dashboard/page-header";
import { QrDownloads, QrImage } from "@/components/dashboard/qr-card";
import { Badge } from "@/components/ui/badge";
import { isLocalSite, publicUrl, siteHost } from "@/config/site";
import { can } from "@/lib/auth/permissions";
import { requireAccess } from "@/lib/auth/session";
import { panelState, STATE_LABELS } from "@/lib/billing/panel";
import { getMenu } from "@/lib/db/menu";
import { getStats } from "@/lib/db/orders";
import { getFloor } from "@/lib/db/tables";
import { formatPrice } from "@/lib/utils/format";

/** L'accueil d'un établissement : son QR Code, les chiffres du jour, ce qu'il reste à faire. */
export default async function OverviewPage({ params, searchParams }: PageProps<"/app/[estId]">) {
  const [{ estId }, { bienvenue }] = await Promise.all([params, searchParams]);
  const { establishment, member, user } = await requireAccess(estId);
  const panel = panelState(establishment);
  const manager = can(member.role, "page.edit");
  const [[today], menu, floor] = await Promise.all([getStats(estId, 1), getMenu(estId), getFloor(estId)]);

  const url = publicUrl(establishment.slug);
  const base = `/app/${estId}`;
  const withoutPhoto = menu.items.filter((item) => !item.photo).length;
  const todo = [
    menu.items.length === 0 && { href: `${base}/menu`, text: "Remplir votre carte" },
    menu.items.length > 0 && withoutPhoto > 0 && { href: `${base}/menu`, text: `Ajouter une photo à ${withoutPhoto} article${withoutPhoto > 1 ? "s" : ""}` },
    !establishment.coverUrl && { href: `${base}/apparence`, text: "Choisir la photo de couverture de votre page" },
    (!establishment.hours || !establishment.address) && { href: `${base}/informations`, text: "Indiquer votre adresse et vos horaires" },
    panel.features.tableQr && floor.tables.length === 0 && { href: `${base}/tables`, text: "Créer vos tables pour la commande sur place" },
  ].filter((entry): entry is { href: string; text: string } => Boolean(entry));

  return (
    <>
      {bienvenue === "1" && (
        <div className="mb-8 animate-rise rounded-lg bg-success-soft p-5 text-success-text">
          <p className="flex items-center gap-2.5 font-display text-xl font-bold">
            <CircleCheck aria-hidden="true" className="size-6" />
            Votre page est en ligne.
          </p>
          <p className="mt-1.5">
            Votre essai de {panel.daysLeft} jours vient de commencer. Voici votre QR Code : il ne changera plus jamais,
            même quand vous modifierez votre carte.
          </p>
        </div>
      )}

      <PageHeader
        title={`Bonjour ${user.firstName}.`}
        action={<Badge tone={panel.state === "trial" || panel.state === "active" ? "success" : "warning"}>{STATE_LABELS[panel.state]}</Badge>}
      />

      <div className="grid gap-6">
        <Section title="Votre QR Code" description="Celui de votre page. Imprimez-le sur vos menus, vos affiches, votre vitrine.">
          <div className="grid gap-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-center">
            <QrImage url={url} accent={establishment.accentColor} className="w-44 overflow-hidden rounded-md border border-line" />
            <div className="grid gap-4">
              <p className="flex flex-wrap items-center gap-3">
                <a href={`/${establishment.slug}`} target="_blank" rel="noopener" className="font-display text-lg font-bold underline underline-offset-4">
                  {siteHost}/{establishment.slug}
                </a>
                <CopyButton text={url} label="Copier le lien" />
              </p>
              <QrDownloads url={url} accent={establishment.accentColor} filename={`qr-${establishment.slug}`} />
              {isLocalSite && (
                <p className="rounded-md bg-warning-soft px-4 py-3 text-sm font-medium text-warning-text">
                  Le site tourne encore sur cet ordinateur : ce QR Code ne fonctionne que d&apos;ici. Ne l&apos;imprimez
                  pas avant la mise en ligne sous le vrai nom de domaine.
                </p>
              )}
              {manager && panel.editable && <PublishSwitch establishmentId={estId} published={establishment.published} />}
            </div>
          </div>
        </Section>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Scans aujourd'hui", value: String(today.scans) },
            { label: "Commandes aujourd'hui", value: String(today.orders + today.whatsappOrders) },
            { label: "Ventes sur place", value: formatPrice(today.revenue) },
          ].map((figure) => (
            <div key={figure.label} className="rounded-lg border border-line bg-surface-raised p-5">
              <p className="text-sm text-fg-muted">{figure.label}</p>
              <p className="mt-1 font-display text-3xl font-bold tabular-nums">{figure.value}</p>
            </div>
          ))}
        </div>

        {manager && todo.length > 0 && (
          <Section title="Pour une page plus belle" description="Rien d'obligatoire : chaque geste rend votre carte plus appétissante.">
            <ul className="grid gap-1">
              {todo.map((entry) => (
                <li key={entry.text}>
                  <Link href={entry.href} className="group flex items-center justify-between gap-3 rounded-md px-3 py-2.5 font-semibold hover:bg-fg/5">
                    {entry.text}
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-fg-muted transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </>
  );
}
