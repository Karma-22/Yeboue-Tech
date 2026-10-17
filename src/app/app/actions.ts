"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { pageTag } from "@/lib/db/core";
import { createEstablishment, isSlugFree, SlugTakenError } from "@/lib/db/establishments";
import type { Establishment } from "@/lib/db/types";
import { updateUser } from "@/lib/db/users";
import { slugCandidates } from "@/lib/utils/slug";
import { newEstablishmentSchema, parseForm, profileSchema, type FormState } from "@/lib/validation/forms";

/* Les actions du compte : son profil, et la création d'un établissement. */

const MAX_ESTABLISHMENTS = 10;

/** L'adresse qu'aurait un établissement de ce nom : la première encore libre. `null` s'il n'y en a pas. */
export async function suggestSlug(name: string, district: string): Promise<string | null> {
  await requireUser();
  for (const slug of slugCandidates(name.slice(0, 60), district.slice(0, 40)).slice(0, 4)) {
    if (await isSlugFree(slug)) return slug;
  }
  return null;
}

/** Premier écran de la création guidée : l'établissement existe dès maintenant, hors ligne (ARCHITECTURE.md §6.1). */
export async function createEstablishmentAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireUser();
  const parsed = parseForm(newEstablishmentSchema, formData);
  if ("state" in parsed) return parsed.state;
  const values = Object.fromEntries([...formData.entries()].filter(([, value]) => typeof value === "string")) as Record<string, string>;

  if (user.establishmentIds.length >= MAX_ESTABLISHMENTS) {
    return { message: `Un compte gère ${MAX_ESTABLISHMENTS} établissements au plus. Écrivez-nous pour aller plus loin.`, values };
  }
  const candidates = slugCandidates(parsed.data.name, parsed.data.district);
  if (candidates.length === 0) {
    return { errors: { name: "Ce nom ne peut pas servir d'adresse. Ajoutez-lui un mot." }, values };
  }

  let created: Establishment | null = null;
  for (const slug of candidates) {
    try {
      created = await createEstablishment({ ...parsed.data, slug, owner: user });
      break;
    } catch (error) {
      // Adresse prise entre-temps : on essaie la suivante.
      if (!(error instanceof SlugTakenError)) throw error;
    }
  }
  if (!created) {
    return { errors: { name: "Ce nom est déjà très utilisé. Ajoutez un mot pour le distinguer." }, values };
  }
  // Si cette adresse a déjà été demandée par erreur, on oublie qu'elle n'existait pas.
  updateTag(pageTag(created.slug));
  redirect(`/app/${created.id}/creation`);
}

export async function updateProfile(_previous: FormState, formData: FormData): Promise<FormState> {
  const { user } = await requireUser();
  const parsed = parseForm(profileSchema, formData);
  if ("state" in parsed) return parsed.state;
  await updateUser(user.id, parsed.data);
  refresh();
  return { ok: true, message: "Votre profil est à jour." };
}
