"use client";

import { useActionState, useRef, useState, useTransition } from "react";
import Image, { type StaticImageData } from "next/image";
import { Check } from "lucide-react";
import { createEstablishmentAction, suggestSlug, updateProfile } from "@/app/app/actions";
import { addZone, invite, saveInformation, startTrialAction } from "@/app/app/[estId]/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { FormNotice } from "@/components/ui/form-notice";
import { Input, Select, Textarea } from "@/components/ui/input";
import { PLAN_IDS, PLANS, TRIAL, type PlanId } from "@/config/plans";
import { ROLE_HINTS, ROLE_LABELS } from "@/lib/auth/permissions";
import type { Establishment, EstablishmentType, UserProfile } from "@/lib/db/types";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import { formatPhone } from "@/lib/utils/phone";
import type { FormState } from "@/lib/validation/forms";
import bar from "@/assets/photos/bar-lounge.jpg";
import hotel from "@/assets/photos/hotel-chambre.jpg";
import maquis from "@/assets/photos/maquis-poisson-braise.jpg";
import residence from "@/assets/photos/residence-salon.jpg";
import restaurant from "@/assets/photos/restaurant-service.jpg";

/* Les formulaires du tableau de bord. Chacun envoie ses champs à une action du serveur, qui valide et répond. */

const EMPTY: FormState = {};

/** Le numéro tel qu'on le saisit : « 07 00 00 00 00 », sans l'indicatif. */
const localPhone = (normalized: string) => (normalized ? formatPhone(normalized).replace(/^\+225\s/, "") : "");

const TYPES: { id: EstablishmentType; label: string; photo: StaticImageData }[] = [
  { id: "restaurant", label: "Restaurant", photo: restaurant },
  { id: "maquis", label: "Maquis", photo: maquis },
  { id: "bar", label: "Bar, lounge", photo: bar },
  { id: "hotel", label: "Hôtel", photo: hotel },
  { id: "residence", label: "Résidence", photo: residence },
];

/** Premier écran de la création guidée : le nom, le type, le quartier, le numéro WhatsApp. */
export function NewEstablishmentForm({ phone, siteHost }: { phone: string; siteHost: string }) {
  const [state, action, pending] = useActionState(createEstablishmentAction, EMPTY);
  const [type, setType] = useState<EstablishmentType>((state.values?.type as EstablishmentType) ?? "restaurant");
  const [slug, setSlug] = useState<string | null>(null);
  const [, startCheck] = useTransition();
  const fields = useRef({ name: "", district: "" });
  const timer = useRef<number>(undefined);

  // L'adresse est proposée pendant la saisie, une fois la frappe posée.
  const preview = (field: "name" | "district", value: string) => {
    fields.current[field] = value;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const { name, district } = fields.current;
      if (name.trim().length < 3) return setSlug(null);
      startCheck(async () => setSlug(await suggestSlug(name, district)));
    }, 500);
  };

  return (
    <form action={action} className="grid gap-7" noValidate>
      <fieldset>
        <legend className="text-sm font-semibold">Quel type d&apos;établissement ?</legend>
        <input type="hidden" name="type" value={type} />
        <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-5">
          {TYPES.map((entry) => {
            const selected = entry.id === type;
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setType(entry.id)}
                aria-pressed={selected}
                className={cn(
                  "group relative aspect-[4/3] overflow-hidden rounded-md text-left ring-offset-2 ring-offset-surface sm:aspect-[3/4]",
                  selected && "ring-2 ring-fg",
                )}
              >
                <Image
                  src={entry.photo}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 9rem, 45vw"
                  className={cn("object-cover transition-[scale,filter] duration-500", !selected && "brightness-75 saturate-50")}
                />
                <span className="absolute inset-0 bg-linear-to-t from-black/75 to-transparent" />
                <span className="absolute inset-x-3 bottom-2.5 text-sm font-semibold text-white">{entry.label}</span>
                {selected && (
                  <span className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-white text-ink">
                    <Check aria-hidden="true" strokeWidth={3} className="size-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {state.errors?.type && <p className="mt-2 text-sm font-medium text-danger-text">{state.errors.type}</p>}
      </fieldset>

      <Field label="Nom de l'établissement" error={state.errors?.name}>
        <Input
          name="name"
          defaultValue={state.values?.name}
          onChange={(event) => preview("name", event.target.value)}
          placeholder="Chez Tantie"
          autoComplete="organization"
          required
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Quartier" error={state.errors?.district}>
          <Input
            name="district"
            defaultValue={state.values?.district}
            onChange={(event) => preview("district", event.target.value)}
            placeholder="Cocody"
            required
          />
        </Field>
        <Field label="Numéro WhatsApp" hint="Celui où vos clients vous écrivent." error={state.errors?.whatsapp}>
          <Input name="whatsapp" type="tel" inputMode="tel" defaultValue={state.values?.whatsapp ?? localPhone(phone)} required />
        </Field>
      </div>

      <p className="min-h-12 rounded-md bg-surface-sunken px-4 py-3 text-sm" aria-live="polite">
        {slug ? (
          <>
            L&apos;adresse de votre page :{" "}
            <strong className="font-display tracking-tight">
              {siteHost}/{slug}
            </strong>
          </>
        ) : (
          <span className="text-fg-muted">L&apos;adresse de votre page s&apos;affichera ici dès que vous aurez saisi le nom.</span>
        )}
      </p>

      <FormNotice state={state} />
      <Button type="submit" size="lg" loading={pending} className="justify-self-start">
        Continuer
      </Button>
    </form>
  );
}

/** Dernier écran de la création guidée : l'offre, le numéro, et l'essai démarre. Aucun paiement. */
export function PlanStepForm({ establishmentId, whatsapp }: { establishmentId: string; whatsapp: string }) {
  const [state, action, pending] = useActionState(startTrialAction.bind(null, establishmentId), EMPTY);
  const [plan, setPlan] = useState<PlanId>("menu_orders");
  return (
    <form action={action} className="grid gap-7" noValidate>
      <input type="hidden" name="plan" value={plan} />
      <PlanCards value={plan} onChange={setPlan} />
      <Field
        label="Votre numéro WhatsApp"
        hint={`Nous vous y écrirons avant la fin des ${TRIAL.days} jours. Rien à payer aujourd'hui.`}
        error={state.errors?.whatsapp}
        className="max-w-sm"
      >
        <Input name="whatsapp" type="tel" inputMode="tel" defaultValue={state.values?.whatsapp ?? localPhone(whatsapp)} required />
      </Field>
      <FormNotice state={state} />
      <Button type="submit" size="lg" loading={pending} className="justify-self-start">
        Démarrer mes {TRIAL.days} jours gratuits
      </Button>
    </form>
  );
}

const PLAN_LINES: Record<PlanId, string[]> = {
  menu: ["Votre page, votre modèle, votre couleur", "QR Code général", "Commande à emporter par WhatsApp", "2 accès pour votre équipe"],
  menu_orders: [
    "Tout ce que contient l'offre Menu",
    "Un QR Code par table",
    "Commande sur place, écran de commandes",
    "Avis des clients, chiffres de vente",
    "10 accès pour votre équipe",
  ],
};

/** Les deux offres, à choisir d'un geste. Les prix viennent de la configuration, jamais d'ici. */
export function PlanCards({ value, onChange, disabled }: { value: PlanId; onChange: (plan: PlanId) => void; disabled?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {PLAN_IDS.map((id) => {
        const selected = id === value;
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(id)}
            aria-pressed={selected}
            className={cn(
              "rounded-lg border p-5 text-left transition-colors disabled:cursor-not-allowed",
              selected ? "border-fg bg-surface-raised ring-1 ring-fg" : "border-line bg-surface-raised hover:border-line-strong",
            )}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="font-display text-lg font-bold">{PLANS[id].name}</span>
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full border",
                  selected ? "border-fg bg-fg text-surface" : "border-line-strong text-transparent",
                )}
              >
                <Check aria-hidden="true" strokeWidth={3} className="size-3.5" />
              </span>
            </span>
            <span className="mt-1 block">
              <span className="font-display text-2xl font-bold tabular-nums">{formatPrice(PLANS[id].monthlyPrice)}</span>
              <span className="text-sm text-fg-muted"> / mois</span>
            </span>
            <ul className="mt-4 grid gap-1.5 text-sm text-fg-muted">
              {PLAN_LINES[id].map((line) => (
                <li key={line} className="flex gap-2">
                  <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success-text" />
                  {line}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
    </div>
  );
}

export function InformationForm({ establishment }: { establishment: Establishment }) {
  const [state, action, pending] = useActionState(saveInformation.bind(null, establishment.id), EMPTY);
  const value = (name: keyof Establishment) => state.values?.[name] ?? String(establishment[name] ?? "");
  return (
    <form action={action} className="grid gap-5" noValidate>
      <Field label="Nom de l'établissement" error={state.errors?.name}>
        <Input name="name" defaultValue={value("name")} required />
      </Field>
      <Field label="Présentation" hint="Une ou deux phrases, affichées en haut de votre page." optional error={state.errors?.description}>
        <Textarea name="description" rows={3} maxLength={300} defaultValue={value("description")} />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Adresse" optional error={state.errors?.address}>
          <Input name="address" defaultValue={value("address")} placeholder="Rue des Jardins, près de la pharmacie" />
        </Field>
        <Field label="Horaires" optional error={state.errors?.hours}>
          <Input name="hours" defaultValue={value("hours")} placeholder="Tous les jours, 11 h – 23 h" />
        </Field>
        <Field label="Quartier" error={state.errors?.district}>
          <Input name="district" defaultValue={value("district")} required />
        </Field>
        <Field label="Ville" error={state.errors?.city}>
          <Input name="city" defaultValue={value("city")} required />
        </Field>
        <Field label="Téléphone" error={state.errors?.phone}>
          <Input name="phone" type="tel" inputMode="tel" defaultValue={state.values?.phone ?? localPhone(establishment.phone)} required />
        </Field>
        <Field label="WhatsApp" hint="Les commandes à emporter y arrivent." error={state.errors?.whatsapp}>
          <Input name="whatsapp" type="tel" inputMode="tel" defaultValue={state.values?.whatsapp ?? localPhone(establishment.whatsapp)} required />
        </Field>
      </div>
      <Field
        label="Lien de vos avis Google"
        hint="Les clients satisfaits y sont invités après leur commande."
        optional
        error={state.errors?.googleReviewUrl}
      >
        <Input name="googleReviewUrl" type="url" defaultValue={value("googleReviewUrl")} placeholder="https://g.page/r/…" />
      </Field>
      <label className="flex items-start gap-3 rounded-md bg-surface-sunken p-4">
        <input type="checkbox" name="english" defaultChecked={establishment.english} className="mt-1 size-5 accent-ink" />
        <span>
          <span className="block font-semibold">Proposer aussi la carte en anglais</span>
          <span className="text-sm text-fg-muted">
            Un bouton FR / EN apparaît sur votre page. Vous traduisez chaque article dans l&apos;éditeur de carte ; ce qui
            n&apos;est pas traduit reste en français.
          </span>
        </span>
      </label>
      <FormNotice state={state} />
      <Button type="submit" loading={pending} className="justify-self-start">
        Enregistrer
      </Button>
    </form>
  );
}

export function ProfileForm({ user }: { user: UserProfile }) {
  const [state, action, pending] = useActionState(updateProfile, EMPTY);
  return (
    <form action={action} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Prénom" error={state.errors?.firstName}>
          <Input name="firstName" defaultValue={state.values?.firstName ?? user.firstName} autoComplete="given-name" required />
        </Field>
        <Field label="Nom" error={state.errors?.lastName}>
          <Input name="lastName" defaultValue={state.values?.lastName ?? user.lastName} autoComplete="family-name" required />
        </Field>
      </div>
      <Field label="Numéro WhatsApp" error={state.errors?.phone}>
        <Input name="phone" type="tel" inputMode="tel" defaultValue={state.values?.phone ?? localPhone(user.phone)} required />
      </Field>
      <Field label="Adresse e-mail" hint="Elle sert à vous connecter : elle ne se change pas ici.">
        <Input value={user.email} readOnly disabled />
      </Field>
      <FormNotice state={state} />
      <Button type="submit" loading={pending} className="justify-self-start">
        Enregistrer
      </Button>
    </form>
  );
}

/** Créer une zone et ses emplacements d'un coup : « Terrasse », 12 tables. */
export function ZoneForm({ establishmentId, unit }: { establishmentId: string; unit: string }) {
  const [state, action, pending] = useActionState(addZone.bind(null, establishmentId), EMPTY);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem_auto] sm:items-start" noValidate>
      <Field label="Nom de la zone" error={state.errors?.name}>
        <Input name="name" placeholder="Terrasse, Salle, Étage…" required />
      </Field>
      <Field label={`Nombre de ${unit}s`} error={state.errors?.count}>
        <Input name="count" type="number" inputMode="numeric" min={1} max={200} defaultValue={10} required />
      </Field>
      <Button type="submit" loading={pending} className="sm:mt-[1.625rem]">
        Créer
      </Button>
      <FormNotice state={state.ok ? {} : state} className="sm:col-span-3" />
    </form>
  );
}

export function InviteForm({ establishmentId }: { establishmentId: string }) {
  const [state, action, pending] = useActionState(invite.bind(null, establishmentId), EMPTY);
  return (
    <form action={action} className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-start" noValidate>
      <Field label="Son adresse e-mail" error={state.errors?.email}>
        <Input name="email" type="email" defaultValue={state.ok ? "" : state.values?.email} required />
      </Field>
      <Field label="Son rôle" error={state.errors?.role}>
        <Select name="role" defaultValue="waiter">
          {(["manager", "waiter", "kitchen"] as const).map((role) => (
            <option key={role} value={role} title={ROLE_HINTS[role]}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </Select>
      </Field>
      <Button type="submit" loading={pending} className="sm:mt-[1.625rem]">
        Inviter
      </Button>
      <FormNotice state={state} className="sm:col-span-3" />
    </form>
  );
}
