import Link from "next/link";
import { placeOrder } from "@/app/[slug]/actions";
import { LogoMark } from "@/components/brand/logo";
import { site } from "@/config/site";
import type { PublicPage } from "@/lib/db/public";
import type { Table } from "@/lib/db/types";
import { publicView } from "@/lib/public/view";
import { toTemplateData } from "@/templates/data";
import { TemplatePage } from "@/templates/page";
import type { Ordering } from "./menu-shell";
import { ScanBeacon } from "./scan-beacon";
import { SHELL_LABELS } from "./shell-labels";

/** Ce que voit le client quand la page n'est pas en ligne : abonnement échu, suspension, ou page pas encore publiée. */
export function Unavailable({ name }: { name: string }) {
  return (
    <main className="grid min-h-dvh place-items-center bg-surface px-6 py-16 text-center">
      <div className="max-w-sm">
        <LogoMark className="mx-auto size-12" />
        <h1 className="type-display-3 mt-8">{name}</h1>
        <p className="type-lead mt-4 text-fg-muted">
          La carte est momentanément indisponible. Demandez-la au personnel, et revenez un peu plus tard.
        </p>
        <p className="mt-10 text-sm text-fg-subtle">
          Page hébergée par{" "}
          <Link href="/" prefetch={false} className="font-semibold underline underline-offset-4">
            {site.name}
          </Link>
        </p>
      </div>
    </main>
  );
}

interface EstablishmentViewProps {
  page: PublicPage;
  /** La table dont le QR Code a été scanné, s'il y en a une. */
  table: Table | null;
  lang: "fr" | "en";
}

/** La page d'un établissement telle que la voient ses clients : son modèle, sa couleur, et la bonne façon de commander. */
export function EstablishmentView({ page, table, lang }: EstablishmentViewProps) {
  const { establishment } = page;
  const view = publicView(establishment, table !== null);
  if (!view.online) return <Unavailable name={establishment.name} />;

  const english = lang === "en" && establishment.english;
  const path = table ? `/${establishment.slug}/t/${table.number}` : `/${establishment.slug}`;
  const ordering: Ordering =
    view.ordering === "table"
      ? { mode: "table", slug: establishment.slug, query: english ? "?lang=en" : "" }
      : view.ordering === "whatsapp"
        ? { mode: "whatsapp", slug: establishment.slug, whatsapp: establishment.whatsapp }
        : { mode: "none" };

  return (
    <>
      <ScanBeacon slug={establishment.slug} />
      <TemplatePage
        template={establishment.template}
        accent={establishment.accentColor}
        data={toTemplateData(page, { lang: english ? "en" : "fr", table, path })}
        ordering={ordering}
        shellLabels={SHELL_LABELS[english ? "en" : "fr"]}
        placeOrder={table && view.ordering === "table" ? placeOrder.bind(null, establishment.slug, table.number) : undefined}
      />
    </>
  );
}
