"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { saveAppearance, setPageImage } from "@/app/app/[estId]/actions";
import { Button } from "@/components/ui/button";
import { FormNotice } from "@/components/ui/form-notice";
import { Spinner } from "@/components/ui/spinner";
import {
  ACCENT_PRESETS,
  TEMPLATE_FAMILIES,
  TEMPLATE_IDS,
  TEMPLATES,
  type TemplateFamily,
  type TemplateId,
} from "@/config/templates";
import type { EstablishmentType } from "@/lib/db/types";
import type { UploadedPhoto } from "@/lib/images/resize";
import { cn } from "@/lib/utils/cn";
import { isHexColor } from "@/lib/utils/color";
import type { FormState } from "@/lib/validation/forms";
import { PhotoInput } from "./photo-input";

interface AppearanceEditorProps {
  establishmentId: string;
  type: EstablishmentType;
  template: TemplateId;
  accentColor: string;
  logoUrl: string | null;
  coverUrl: string | null;
  /** Le texte du bouton : « Enregistrer », ou « Continuer » dans la création guidée. */
  submitLabel: string;
  /** Ce qui suit un enregistrement réussi : dans la création guidée, l'écran suivant. */
  after?: () => Promise<void>;
}

const asPhoto = (url: string | null): UploadedPhoto | null => (url ? { thumb: url, large: url } : null);

/** Les familles qui ont déjà des modèles, précédées de « Tous » : de quoi s'y retrouver parmi des dizaines de mises en page. */
const FAMILIES: { id: TemplateFamily | "all"; name: string; ids: readonly TemplateId[] }[] = [
  { id: "all", name: "Tous", ids: TEMPLATE_IDS },
  ...TEMPLATE_FAMILIES.map((family) => ({ ...family, ids: TEMPLATE_IDS.filter((id) => TEMPLATES[id].family === family.id) })).filter(
    (family) => family.ids.length > 0,
  ),
];

/** Le choix du modèle, de la couleur, du logo et de la couverture, avec l'aperçu sur un téléphone. */
export function AppearanceEditor(props: AppearanceEditorProps) {
  const { establishmentId, type, submitLabel, after } = props;
  const [template, setTemplate] = useState(props.template);
  const [family, setFamily] = useState<TemplateFamily | "all">("all");
  const shown = FAMILIES.find((entry) => entry.id === family)?.ids ?? TEMPLATE_IDS;
  const [colour, setColour] = useState(props.accentColor.toUpperCase());
  const [logo, setLogo] = useState(asPhoto(props.logoUrl));
  const [cover, setCover] = useState(asPhoto(props.coverUrl));
  const [imageError, setImageError] = useState<string | null>(null);
  const [, startImage] = useTransition();

  const previewOf = (id: TemplateId, hex: string) => `/apercu/${id}?cadre=1&type=${type}&couleur=${hex.slice(1)}`;
  const [preview, setPreview] = useState(previewOf(template, colour));
  const timer = useRef<number>(undefined);
  // L'aperçu attend que le choix se pose : glisser dans le nuancier ne recharge pas la page vingt fois.
  const refresh = (id: TemplateId, hex: string) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setPreview(previewOf(id, hex)), 450);
  };
  const pickTemplate = (id: TemplateId) => {
    setTemplate(id);
    refresh(id, colour);
  };
  const pickColour = (hex: string) => {
    setColour(hex.toUpperCase());
    if (isHexColor(hex)) refresh(template, hex.toUpperCase());
  };

  const [state, action, pending] = useActionState(async (previous: FormState, formData: FormData) => {
    const result = await saveAppearance(establishmentId, previous, formData);
    if (result.ok && after) await after();
    return result;
  }, {});

  const saveImage = (kind: "logo" | "cover", photo: UploadedPhoto | null) => {
    (kind === "logo" ? setLogo : setCover)(photo);
    startImage(async () => {
      const result = await setPageImage(establishmentId, kind, photo?.large ?? null);
      setImageError(result.ok ? null : (result.message ?? "L'image n'a pas pu être enregistrée."));
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem]">
      <form action={action} className="grid content-start gap-10">
        <input type="hidden" name="template" value={template} />
        <input type="hidden" name="accentColor" value={colour} />

        <fieldset>
          <legend className="font-display text-lg font-bold">Le modèle</legend>
          <p className="mt-1 text-sm text-fg-muted">
            {TEMPLATE_IDS.length} mises en page, rangées par famille. Vous pourrez en changer quand vous voudrez : votre carte
            suit.
          </p>
          <div
            role="group"
            aria-label="Familles de modèles"
            className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {FAMILIES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setFamily(entry.id)}
                aria-pressed={family === entry.id}
                className={cn(
                  "flex h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold whitespace-nowrap transition-colors",
                  family === entry.id ? "border-fg bg-fg text-surface" : "border-line-strong text-fg-muted hover:text-fg",
                )}
              >
                {entry.name}
                <span className="text-xs tabular-nums opacity-70">{entry.ids.length}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
            {shown.map((id) => {
              const selected = id === template;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => pickTemplate(id)}
                  aria-pressed={selected}
                  title={TEMPLATES[id].description}
                  className="group relative rounded-lg p-1.5 text-left"
                >
                  {selected && (
                    <motion.span
                      layoutId="template-ring"
                      className="absolute inset-0 rounded-lg border-2 border-fg bg-fg/5"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative block aspect-[9/14] overflow-hidden rounded-md border border-line bg-surface-sunken">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`/modeles/${id}.webp`}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover object-top transition-transform duration-500 ease-emphasized group-hover:scale-[1.03]"
                    />
                    {selected && (
                      <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-fg text-surface">
                        <Check aria-hidden="true" strokeWidth={3} className="size-3.5" />
                      </span>
                    )}
                  </span>
                  <span className="relative mt-2 block px-1 pb-1 text-sm font-semibold">{TEMPLATES[id].name}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 rounded-md bg-surface-sunken px-4 py-3 text-sm">
            <strong>{TEMPLATES[template].name}.</strong> {TEMPLATES[template].description}{" "}
            <span className="text-fg-muted">Pensé pour : {TEMPLATES[template].suits.toLowerCase()}.</span>{" "}
            <a
              href={previewOf(template, isHexColor(colour) ? colour : props.accentColor).replace("cadre=1&", "")}
              target="_blank"
              rel="noopener"
              className="font-semibold whitespace-nowrap underline underline-offset-4"
            >
              Le voir en grand
            </a>
          </p>
        </fieldset>

        <fieldset>
          <legend className="font-display text-lg font-bold">La couleur</legend>
          <p className="mt-1 text-sm text-fg-muted">
            Celle de votre enseigne. Elle s&apos;applique au modèle choisi, quel qu&apos;il soit.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            {ACCENT_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => pickColour(preset.value)}
                aria-label={preset.name}
                aria-pressed={colour === preset.value.toUpperCase()}
                title={preset.name}
                style={{ backgroundColor: preset.value }}
                className={cn(
                  "size-10 rounded-full ring-offset-2 ring-offset-surface transition-transform hover:scale-110",
                  colour === preset.value.toUpperCase() && "ring-2 ring-fg",
                )}
              />
            ))}
            <label className="ml-1 flex h-10 items-center gap-2 rounded-full border border-line-strong pr-4 pl-1.5 text-sm font-semibold">
              <input
                type="color"
                value={isHexColor(colour) ? colour : "#F2622E"}
                onChange={(event) => pickColour(event.target.value)}
                className="size-7 cursor-pointer rounded-full border-0 bg-transparent p-0"
              />
              Une autre
            </label>
          </div>
          {state.errors?.accentColor && <p className="mt-2 text-sm font-medium text-danger-text">{state.errors.accentColor}</p>}
        </fieldset>

        <fieldset>
          <legend className="font-display text-lg font-bold">Vos images</legend>
          <p className="mt-1 text-sm text-fg-muted">
            Le logo, et la grande photo du haut de la page. Elles sont enregistrées dès que vous les choisissez.
          </p>
          <div className="mt-5 grid gap-6 sm:grid-cols-[auto_minmax(0,1fr)]">
            <PhotoInput
              establishmentId={establishmentId}
              kind="logo"
              value={logo}
              onChange={(photo) => saveImage("logo", photo)}
              label="Logo"
            />
            <PhotoInput
              establishmentId={establishmentId}
              kind="cover"
              value={cover}
              onChange={(photo) => saveImage("cover", photo)}
              label="Photo de couverture"
              className="max-w-sm"
            />
          </div>
          {imageError && <p className="mt-2 text-sm font-medium text-danger-text">{imageError}</p>}
        </fieldset>

        <div className="grid gap-4">
          <FormNotice state={state} />
          <Button type="submit" size="lg" loading={pending} className="justify-self-start">
            {submitLabel}
          </Button>
        </div>
      </form>

      <aside className="hidden lg:block">
        <div className="sticky top-8">
          <p className="mb-3 text-center text-xs font-semibold tracking-[0.14em] text-fg-subtle uppercase">
            Aperçu, avec une carte d&apos;exemple
          </p>
          <div className="mx-auto w-fit rounded-[2.3rem] bg-ink p-2.5 shadow-lg">
            <div className="relative h-[562px] w-[281px] overflow-hidden rounded-[1.75rem] bg-surface-sunken">
              {/* Visible tant que la page d'aperçu n'a pas fini de se charger par-dessus. */}
              <p className="absolute inset-0 grid place-content-center justify-items-center gap-3 text-sm text-fg-muted">
                <Spinner />
                Chargement de l&apos;aperçu…
              </p>
              <iframe
                key={preview}
                src={preview}
                title="Aperçu du modèle"
                className="relative h-[780px] w-[390px] origin-top-left scale-[0.7205]"
              />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
