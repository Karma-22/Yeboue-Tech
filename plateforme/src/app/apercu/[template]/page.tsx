import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LogoMark } from "@/components/brand/logo";
import { SHELL_LABELS } from "@/components/public/shell-labels";
import { DEFAULT_ACCENT, isTemplateId, TEMPLATE_IDS, TEMPLATES } from "@/config/templates";
import { ESTABLISHMENT_TYPES, type EstablishmentType } from "@/lib/db/types";
import { isHexColor } from "@/lib/utils/color";
import { TemplatePage } from "@/templates/page";
import { SAMPLE_FOR_TEMPLATE, sampleData } from "@/templates/sample";

/*
 * L'aperçu d'un modèle, avec un établissement d'exemple (ARCHITECTURE.md §17).
 * Réglages par l'adresse : ?couleur=F2622E, ?type=maquis, ?cadre=1 (sans le
 * bandeau, pour l'afficher dans le tableau de bord).
 */

export function generateStaticParams() {
  return TEMPLATE_IDS.map((template) => ({ template }));
}

export async function generateMetadata({ params }: PageProps<"/apercu/[template]">): Promise<Metadata> {
  const { template } = await params;
  if (!isTemplateId(template)) return {};
  return { title: `Modèle ${TEMPLATES[template].name}`, robots: { index: false } };
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function TemplatePreviewPage({ params, searchParams }: PageProps<"/apercu/[template]">) {
  const { template } = await params;
  if (!isTemplateId(template)) notFound();
  const query = await searchParams;

  const colour = `#${first(query.couleur) ?? ""}`;
  const requested = first(query.type) as EstablishmentType | undefined;
  const type = requested && ESTABLISHMENT_TYPES.includes(requested) ? requested : SAMPLE_FOR_TEMPLATE[template];
  const framed = first(query.cadre) === "1";

  return (
    <>
      {!framed && (
        <div data-theme="dark" className="flex h-11 items-center justify-between gap-3 bg-surface px-4 text-sm">
          <Link href="/#modeles" className="flex min-w-0 items-center gap-2.5 font-semibold">
            <LogoMark className="size-6" />
            <span className="truncate">
              <span className="text-fg-muted">Aperçu du modèle</span> {TEMPLATES[template].name}
            </span>
          </Link>
          <Link href="/inscription" className="shrink-0 font-semibold text-accent-text underline underline-offset-4">
            Créer mon menu
          </Link>
        </div>
      )}
      {/* --screen : la hauteur qui reste aux modèles en plein écran, sous le bandeau. */}
      <div style={framed ? undefined : ({ "--screen": "calc(100dvh - 2.75rem)" } as React.CSSProperties)}>
        <TemplatePage
          template={template}
          accent={isHexColor(colour) ? colour : DEFAULT_ACCENT}
          data={sampleData(type, { withTable: true })}
          ordering={{ mode: "preview" }}
          shellLabels={SHELL_LABELS.fr}
        />
      </div>
    </>
  );
}
