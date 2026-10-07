import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { panelState, STATE_LABELS } from "@/lib/billing/panel";
import type { SubscriptionState } from "@/lib/billing/subscription";
import { listAllEstablishments } from "@/lib/db/establishments";
import { formatDate } from "@/lib/utils/format";
import { TYPE_LABELS } from "@/templates/types";

export const metadata: Metadata = { title: "Établissements" };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value) ?? "";
/** Pour chercher sans se soucier des accents ni des majuscules. */
const plain = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export default async function AdminEstablishmentsPage({ searchParams }: PageProps<"/admin/etablissements">) {
  const query = await searchParams;
  const search = first(query.q).trim();
  const state = first(query.etat) as SubscriptionState | "";
  const rows = (await listAllEstablishments())
    .map((establishment) => ({ establishment, panel: panelState(establishment) }))
    .filter(({ establishment, panel }) => {
      if (state && panel.state !== state) return false;
      if (!search) return true;
      return plain(`${establishment.name} ${establishment.slug} ${establishment.district}`).includes(plain(search));
    });

  return (
    <>
      <PageHeader title="Établissements" description={`${rows.length} affiché${rows.length > 1 ? "s" : ""}.`} />
      <form className="mb-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem_auto]">
        <Input name="q" defaultValue={search} placeholder="Nom, adresse ou quartier" aria-label="Chercher un établissement" />
        <Select name="etat" defaultValue={state} aria-label="État de l'abonnement">
          <option value="">Tous les états</option>
          {(Object.keys(STATE_LABELS) as SubscriptionState[]).map((value) => (
            <option key={value} value={value}>
              {STATE_LABELS[value]}
            </option>
          ))}
        </Select>
        <Button type="submit" variant="secondary">
          Filtrer
        </Button>
      </form>

      {rows.length === 0 ? (
        <p className="rounded-lg border border-dashed border-line-strong p-8 text-center text-fg-muted">
          Aucun établissement ne correspond.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-surface-raised">
          {rows.map(({ establishment, panel }) => (
            <li key={establishment.id}>
              <Link href={`/admin/etablissements/${establishment.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-fg/4">
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{establishment.name}</span>
                  <span className="block truncate text-sm text-fg-muted">
                    {TYPE_LABELS[establishment.type].fr} · {establishment.district} · /{establishment.slug} · créé le{" "}
                    {formatDate(establishment.createdAt)}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-3 text-sm">
                  {panel.plan && <span className="text-fg-muted">{panel.plan.name}</span>}
                  <Badge tone={panel.state === "active" || panel.state === "trial" ? "success" : panel.state === "none" ? "neutral" : "warning"}>
                    {STATE_LABELS[panel.state]}
                    {(panel.state === "trial" || panel.state === "active") && ` · ${panel.daysLeft} j`}
                  </Badge>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
