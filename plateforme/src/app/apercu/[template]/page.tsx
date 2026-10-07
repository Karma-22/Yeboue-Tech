import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LogoMark } from "@/components/brand/logo";
import { SHELL_LABELS } from "@/components/public/shell-labels";
import { SIGNUP_PATH } from "@/config/site";
import { ACCENT_PRESETS, isTemplateId, TEMPLATE_IDS, TEMPLATES } from "@/config/templates";
import { ESTABLISHMENT_TYPES, type EstablishmentType } from "@/lib/db/types";
import { cn } from "@/lib/utils/cn";
import { isHexColor } from "@/lib/utils/color";
import { TemplatePage } from "@/templates/page";
import { previewData } from "@/templates/showcases";

/*
 * L'aperçu d'un modèle, avec un établissement d'exemple (ARCHITECTURE.md §17).
 * Réglages par l'adresse : ?couleur=F2622E, ?type=maquis, ?cadre=1 (sans le
 * bandeau, pour l'afficher dans le tableau de bord).
 */

export async function generateMetadata({ params }: PageProps<"/apercu/[template]">): Promise<Metadata> {
  const { template } = await params;
  if (!isTemplateId(template)) return {};
  return { title: `Modèle ${TEMPLATES[template].name}`, description: TEMPLATES[template].description, robots: { index: false } };
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function TemplatePreviewPage({ params, searchParams }: PageProps<"/apercu/[template]">) {
  const { template } = await params;
  if (!isTemplateId(template)) notFound();
  const query = await searchParams;

  // Sans couleur demandée, chaque modèle se montre dans celle qui lui va le mieux.
  const asked = `#${first(query.couleur) ?? ""}`.toUpperCase();
  const chosen = isHexColor(asked) ? asked : null;
  const colour = chosen ?? TEMPLATES[template].accent;
  const requested = first(query.type) as EstablishmentType | undefined;
  const type = requested && ESTABLISHMENT_TYPES.includes(requested) ? requested : null;
  const framed = first(query.cadre) === "1";

  // Les liens du bandeau gardent les réglages en cours : on change de modèle sans perdre la couleur qu'on a choisie.
  const link = (id: string, hex: string | null) => {
    const search = new URLSearchParams();
    if (hex) search.set("couleur", hex.slice(1));
    if (type) search.set("type", type);
    return `/apercu/${id}${search.size ? `?${search}` : ""}`;
  };
  const position = TEMPLATE_IDS.indexOf(template);
  const previous = TEMPLATE_IDS[(position + TEMPLATE_IDS.length - 1) % TEMPLATE_IDS.length];
  const next = TEMPLATE_IDS[(position + 1) % TEMPLATE_IDS.length];
  const arrow = "grid size-8 shrink-0 place-items-center rounded-full hover:bg-fg/12";

  return (
    // --bar : la hauteur du bandeau ; les modèles en plein écran prennent ce qui reste (--screen).
    <div className={framed ? undefined : "[--bar:6rem] [--screen:calc(100dvh-var(--bar))] sm:[--bar:3rem]"}>
      {!framed && (
        <div data-theme="dark" className="grid h-(--bar) content-center gap-y-2.5 bg-surface px-3 text-sm sm:flex sm:items-center sm:gap-x-4">
          {/* Sur téléphone : le modèle et le bouton sur une ligne, les couleurs dessous. Sur grand écran : tout sur une ligne. */}
          <div className="flex min-w-0 items-center justify-between gap-2 sm:contents">
            <div className="flex min-w-0 items-center gap-1 sm:order-1">
              <Link href="/#modeles" aria-label="Retour aux modèles" className="mr-1.5 shrink-0 rounded-sm">
                <LogoMark className="size-7" />
              </Link>
              <Link href={link(previous, chosen)} aria-label={`Modèle précédent : ${TEMPLATES[previous].name}`} className={arrow}>
                <ChevronLeft aria-hidden="true" className="size-5" />
              </Link>
              <p className="min-w-0 truncate px-1 font-semibold">
                <span className="hidden text-fg-muted sm:inline">Modèle </span>
                {TEMPLATES[template].name}
                <span className="hidden text-fg-subtle tabular-nums sm:inline">
                  {" "}
                  · {position + 1}/{TEMPLATE_IDS.length}
                </span>
              </p>
              <Link href={link(next, chosen)} aria-label={`Modèle suivant : ${TEMPLATES[next].name}`} className={arrow}>
                <ChevronRight aria-hidden="true" className="size-5" />
              </Link>
            </div>
            <Link href={SIGNUP_PATH} className="shrink-0 rounded-full bg-accent px-3.5 py-1.5 font-semibold text-on-accent sm:order-3 sm:ml-auto">
              Créer mon menu
            </Link>
          </div>
          {/* La couleur : la même page, à l'enseigne de chacun. */}
          <ul aria-label="Couleur" className="flex items-center justify-between gap-1 sm:order-2 sm:justify-start sm:gap-1.5">
            {ACCENT_PRESETS.map((preset) => (
              <li key={preset.value}>
                <Link
                  href={link(template, preset.value)}
                  replace
                  scroll={false}
                  aria-label={`Couleur ${preset.name}`}
                  aria-current={colour === preset.value ? "true" : undefined}
                  title={preset.name}
                  style={{ backgroundColor: preset.value }}
                  className={cn(
                    "block size-6 rounded-full ring-offset-2 ring-offset-surface transition-transform hover:scale-110",
                    colour === preset.value ? "ring-2 ring-fg" : "ring-1 ring-fg/25",
                  )}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      <TemplatePage
        template={template}
        accent={colour}
        data={previewData(template, type, { withTable: true })}
        ordering={{ mode: "preview" }}
        shellLabels={SHELL_LABELS.fr}
      />
    </div>
  );
}
