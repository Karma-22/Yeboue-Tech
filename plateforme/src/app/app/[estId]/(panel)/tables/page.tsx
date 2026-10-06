import type { Metadata } from "next";
import Link from "next/link";
import { Printer } from "lucide-react";
import { removeZone } from "@/app/app/[estId]/actions";
import { ActionButton } from "@/components/dashboard/controls";
import { ZoneForm } from "@/components/dashboard/forms";
import { PageHeader, Section } from "@/components/dashboard/page-header";
import { QrDownloads, QrImage } from "@/components/dashboard/qr-card";
import { buttonStyles } from "@/components/ui/button";
import { PLANS } from "@/config/plans";
import { isLocalSite, publicUrl } from "@/config/site";
import { requireAccess } from "@/lib/auth/session";
import { panelState } from "@/lib/billing/panel";
import { getFloor } from "@/lib/db/tables";

export const metadata: Metadata = { title: "Tables et QR Codes" };

export default async function TablesPage({ params }: PageProps<"/app/[estId]/tables">) {
  const { estId } = await params;
  const { establishment } = await requireAccess(estId, "tables.edit");
  const panel = panelState(establishment);
  const floor = await getFloor(estId);
  const unit = establishment.type === "hotel" ? "chambre" : establishment.type === "residence" ? "appartement" : "table";
  const url = publicUrl(establishment.slug);

  return (
    <>
      <PageHeader
        title="Tables et QR Codes"
        description={`Un QR Code par ${unit} : le client le scanne, et sa commande arrive avec le bon numéro.`}
        action={
          floor.tables.length > 0 && (
            <Link href={`/app/${estId}/planche`} target="_blank" className={buttonStyles({ variant: "secondary" })}>
              <Printer aria-hidden="true" className="size-4" />
              Imprimer tous les QR Codes
            </Link>
          )
        }
      />

      <div className="grid gap-6">
        {isLocalSite && (
          <p className="rounded-md bg-warning-soft px-4 py-3 text-sm font-medium text-warning-text">
            Le site tourne encore sur cet ordinateur : n&apos;imprimez pas ces QR Codes avant la mise en ligne sous le
            vrai nom de domaine. Leur adresse changerait.
          </p>
        )}

        <Section title="Le QR Code général" description="Il ouvre votre carte, sans numéro de table : pour la vitrine, les affiches, les réseaux sociaux.">
          <div className="flex flex-wrap items-center gap-5">
            <QrImage url={url} accent={establishment.accentColor} className="w-28 overflow-hidden rounded-md border border-line" />
            <QrDownloads url={url} accent={establishment.accentColor} filename={`qr-${establishment.slug}`} />
          </div>
        </Section>

        {!panel.features.tableQr ? (
          <div className="rounded-lg border border-dashed border-line-strong p-8 text-center">
            <p className="font-display text-xl font-bold">Les QR Codes par {unit} ne sont pas ouverts.</p>
            <p className="mx-auto mt-2 max-w-md text-fg-muted">
              Ils font partie de l&apos;offre « {PLANS.menu_orders.name} », avec la commande sur place.
            </p>
            <Link href={`/app/${estId}/abonnement`} className={buttonStyles({ className: "mt-6" })}>
              Voir les offres
            </Link>
          </div>
        ) : (
          <>
            {panel.editable && (
              <Section
                title="Ajouter une zone"
                description={`Une zone regroupe des ${unit}s : « Terrasse », « Salle », « Étage ». Les numéros se suivent d'une zone à l'autre.`}
              >
                <ZoneForm establishmentId={estId} unit={unit} />
              </Section>
            )}

            {floor.zones.map((zone) => {
              const inside = floor.tables.filter((table) => table.zoneId === zone.id);
              return (
                <Section
                  key={zone.id}
                  title={zone.name}
                  description={`${inside.length} ${unit}${inside.length > 1 ? "s" : ""}. Touchez un numéro pour ouvrir sa page, comme le ferait un client.`}
                >
                  {/* Un simple numéro par emplacement : les QR Codes, eux, sont sur la planche à imprimer. */}
                  <ul className="flex flex-wrap gap-2">
                    {inside.map((table) => (
                      <li key={table.id}>
                        <a
                          href={`/${establishment.slug}/t/${table.number}`}
                          target="_blank"
                          rel="noopener"
                          title={`Ouvrir la page de : ${table.label}`}
                          className="grid h-11 min-w-11 place-items-center rounded-md border border-line px-3 text-sm font-semibold tabular-nums transition-colors hover:border-fg hover:bg-fg/5"
                        >
                          {table.number}
                        </a>
                      </li>
                    ))}
                  </ul>
                  {panel.editable && (
                    <div className="mt-5">
                      <ActionButton
                        variant="ghost"
                        size="sm"
                        className="text-danger-text"
                        action={removeZone.bind(null, estId, zone.id)}
                        confirm={`Supprimer « ${zone.name} » ? Les QR Codes de ses ${unit}s cesseront de fonctionner.`}
                      >
                        Supprimer cette zone
                      </ActionButton>
                    </div>
                  )}
                </Section>
              );
            })}
          </>
        )}
      </div>
    </>
  );
}
