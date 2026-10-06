"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { PLANS, PLAN_IDS, type PlanId } from "@/config/plans";
import { type Action } from "@/lib/auth/permissions";
import { assertAccess, type Access } from "@/lib/auth/session";
import { canEdit, hasFeature, startTrial, subscriptionState } from "@/lib/billing/subscription";
import { createInvitation, deleteInvitation, listInvitations } from "@/lib/db/admin";
import { pageTag } from "@/lib/db/core";
import {
  listMembers,
  removeMember,
  setMemberRole,
  setSubscription,
  updateEstablishment,
} from "@/lib/db/establishments";
import {
  createCategory,
  createItem,
  deleteCategory,
  deleteItem,
  getMenu,
  moveCategory,
  moveItem,
  seedMenu,
  updateCategory,
  updateItem,
} from "@/lib/db/menu";
import { setOrderStatus, TransitionError } from "@/lib/db/orders";
import { createZone, deleteZone, getFloor } from "@/lib/db/tables";
import { ORDER_STATUSES, ROLES, type OrderStatus, type Role } from "@/lib/db/types";
import { adminAuth } from "@/lib/firebase/admin";
import {
  appearanceSchema,
  categorySchema,
  informationSchema,
  invitationSchema,
  itemSchema,
  parseForm,
  planSchema,
  zoneSchema,
  type FormState,
} from "@/lib/validation/forms";
import { sampleMenu } from "@/templates/sample";

/*
 * Tout ce qu'un membre peut faire dans son établissement. Chaque action
 * commence par les mêmes contrôles (ARCHITECTURE.md §12) : session, rôle,
 * abonnement, puis validation de ce qui a été saisi.
 */

/** Ce que renvoie une action lancée par un simple bouton. */
export interface ActionResult {
  ok: boolean;
  message?: string;
}

const READ_ONLY = "Votre abonnement a expiré : renouvelez-le pour modifier votre établissement.";
const MAX_TABLES = 400;

/** Exige le droit demandé, et un abonnement qui permet encore de modifier. */
async function editor(establishmentId: string, action: Action): Promise<Access | null> {
  const access = await assertAccess(establishmentId, action);
  return canEdit(subscriptionState(access.establishment.subscription, Date.now())) ? access : null;
}

/** À appeler après chaque changement : la page publique est reconstruite, le tableau de bord rafraîchi. */
function publish(access: Access) {
  updateTag(pageTag(access.establishment.slug));
  refresh();
}

/* ——— Création guidée ——— */

export async function goToStep(establishmentId: string, step: number): Promise<void> {
  const access = await assertAccess(establishmentId, "page.edit");
  if (access.establishment.subscription === null && step >= 2 && step <= 4) {
    await updateEstablishment(establishmentId, { setupStep: step });
  }
  redirect(`/app/${establishmentId}/creation`);
}

export async function seedSampleMenu(establishmentId: string): Promise<ActionResult> {
  const access = await editor(establishmentId, "menu.edit");
  if (!access) return { ok: false, message: READ_ONLY };
  const menu = await getMenu(establishmentId);
  if (menu.categories.length > 0) return { ok: false, message: "Votre carte contient déjà des catégories." };
  await seedMenu(establishmentId, sampleMenu(access.establishment.type));
  publish(access);
  return { ok: true };
}

/** Dernier écran de la création : l'offre choisie, le numéro WhatsApp, puis l'essai démarre et la page est en ligne. */
export async function startTrialAction(
  establishmentId: string,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const access = await assertAccess(establishmentId, "billing.manage");
  const parsed = parseForm(planSchema, formData);
  if ("state" in parsed) return parsed.state;
  if (access.establishment.subscription !== null) redirect(`/app/${establishmentId}`);

  await updateEstablishment(establishmentId, {
    whatsapp: parsed.data.whatsapp,
    published: true,
    setupStep: null,
    subscription: startTrial(parsed.data.plan, Date.now()),
  });
  updateTag(pageTag(access.establishment.slug));
  redirect(`/app/${establishmentId}?bienvenue=1`);
}

/* ——— Apparence et informations ——— */

export async function saveAppearance(
  establishmentId: string,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const access = await editor(establishmentId, "page.edit");
  if (!access) return { message: READ_ONLY };
  const parsed = parseForm(appearanceSchema, formData);
  if ("state" in parsed) return parsed.state;
  await updateEstablishment(establishmentId, {
    template: parsed.data.template,
    accentColor: parsed.data.accentColor.toUpperCase(),
  });
  publish(access);
  return { ok: true, message: "L'apparence de votre page est enregistrée." };
}

const PHOTO_URL = /^\/api\/photo\/establishments\/[A-Za-z0-9_-]+\/(item|logo|cover)\/[a-f0-9-]+-(thumb|large)\.(webp|jpg)$/;

/** Pose ou retire le logo ou la couverture. L'adresse vient de l'envoi de photo. */
export async function setPageImage(
  establishmentId: string,
  kind: "logo" | "cover",
  url: string | null,
): Promise<ActionResult> {
  const access = await editor(establishmentId, "page.edit");
  if (!access) return { ok: false, message: READ_ONLY };
  if (url !== null && !(PHOTO_URL.test(url) && url.includes(`/${establishmentId}/${kind}/`))) {
    return { ok: false, message: "Cette image n'est pas reconnue." };
  }
  await updateEstablishment(establishmentId, kind === "logo" ? { logoUrl: url } : { coverUrl: url });
  publish(access);
  return { ok: true };
}

export async function saveInformation(
  establishmentId: string,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const access = await editor(establishmentId, "page.edit");
  if (!access) return { message: READ_ONLY };
  const parsed = parseForm(informationSchema, formData);
  if ("state" in parsed) return parsed.state;
  await updateEstablishment(establishmentId, parsed.data);
  publish(access);
  return { ok: true, message: "Vos informations sont enregistrées." };
}

export async function setPublished(establishmentId: string, published: boolean): Promise<ActionResult> {
  const access = await editor(establishmentId, "page.edit");
  if (!access) return { ok: false, message: READ_ONLY };
  await updateEstablishment(establishmentId, { published });
  publish(access);
  return { ok: true };
}

/* ——— Carte ——— */

export async function saveCategory(
  establishmentId: string,
  categoryId: string | null,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const access = await editor(establishmentId, "menu.edit");
  if (!access) return { message: READ_ONLY };
  const parsed = parseForm(categorySchema, formData);
  if ("state" in parsed) return parsed.state;
  // Sans le champ anglais dans le formulaire, la traduction déjà saisie est gardée.
  if (categoryId) {
    await updateCategory(establishmentId, categoryId, formData.has("nameEn") ? parsed.data : { name: parsed.data.name });
  } else await createCategory(establishmentId, parsed.data.name, parsed.data.nameEn);
  publish(access);
  return { ok: true };
}

export async function saveItem(
  establishmentId: string,
  itemId: string | null,
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const access = await editor(establishmentId, "menu.edit");
  if (!access) return { message: READ_ONLY };
  const parsed = parseForm(itemSchema, formData);
  if ("state" in parsed) return parsed.state;

  const thumb = String(formData.get("photoThumb") ?? "");
  const large = String(formData.get("photoLarge") ?? "");
  const owned = (url: string) => PHOTO_URL.test(url) && url.includes(`/${establishmentId}/item/`);
  const photo = owned(thumb) && owned(large) ? { thumb, large } : null;

  const { categories } = await getMenu(establishmentId);
  if (!categories.some((category) => category.id === parsed.data.categoryId)) {
    return { errors: { categoryId: "Cette catégorie n'existe plus." } };
  }
  if (itemId) {
    const { nameEn, descriptionEn, ...rest } = parsed.data;
    await updateItem(establishmentId, itemId, { ...rest, photo, ...(formData.has("nameEn") ? { nameEn, descriptionEn } : {}) });
  } else await createItem(establishmentId, { ...parsed.data, photo });
  publish(access);
  return { ok: true };
}

type MenuChange =
  | { kind: "category.delete"; id: string }
  | { kind: "category.move"; id: string; direction: -1 | 1 }
  | { kind: "category.visible"; id: string; visible: boolean }
  | { kind: "item.delete"; id: string }
  | { kind: "item.move"; id: string; direction: -1 | 1 }
  | { kind: "item.available"; id: string; available: boolean };

/** Les gestes d'un seul bouton sur la carte : supprimer, déplacer, masquer, mettre en rupture. */
export async function changeMenu(establishmentId: string, change: MenuChange): Promise<ActionResult> {
  // La rupture est le seul geste ouvert à toute l'équipe, pendant le service.
  const access = await editor(establishmentId, change.kind === "item.available" ? "items.toggle" : "menu.edit");
  if (!access) return { ok: false, message: READ_ONLY };
  const direction = "direction" in change && change.direction === -1 ? -1 : 1;

  switch (change.kind) {
    case "category.delete":
      await deleteCategory(establishmentId, change.id);
      break;
    case "category.move":
      await moveCategory(establishmentId, change.id, direction);
      break;
    case "category.visible":
      await updateCategory(establishmentId, change.id, { visible: change.visible === true });
      break;
    case "item.delete":
      await deleteItem(establishmentId, change.id);
      break;
    case "item.move":
      await moveItem(establishmentId, change.id, direction);
      break;
    case "item.available":
      await updateItem(establishmentId, change.id, { available: change.available === true });
      break;
    default:
      return { ok: false, message: "Action inconnue." };
  }
  publish(access);
  return { ok: true };
}

/* ——— Tables ——— */

export async function addZone(establishmentId: string, _previous: FormState, formData: FormData): Promise<FormState> {
  const access = await editor(establishmentId, "tables.edit");
  if (!access) return { message: READ_ONLY };
  if (!hasFeature(access.establishment.subscription, "tableQr", Date.now())) {
    return { message: `Les QR Codes par table font partie de l'offre « ${PLANS.menu_orders.name} ».` };
  }
  const parsed = parseForm(zoneSchema, formData);
  if ("state" in parsed) return parsed.state;
  const floor = await getFloor(establishmentId);
  if (floor.tables.length + parsed.data.count > MAX_TABLES) {
    return { errors: { count: `Un établissement compte ${MAX_TABLES} emplacements au plus.` } };
  }
  const type = access.establishment.type;
  const unit = type === "hotel" ? "Chambre" : type === "residence" ? "Appartement" : "Table";
  await createZone(establishmentId, parsed.data.name, parsed.data.count, unit);
  publish(access);
  return { ok: true };
}

export async function removeZone(establishmentId: string, zoneId: string): Promise<ActionResult> {
  const access = await editor(establishmentId, "tables.edit");
  if (!access) return { ok: false, message: READ_ONLY };
  await deleteZone(establishmentId, zoneId);
  publish(access);
  return { ok: true };
}

/* ——— Commandes ——— */

/** Le jeton qui ouvre l'écoute en direct des commandes dans le navigateur d'un membre. */
export async function liveToken(establishmentId: string): Promise<string> {
  const access = await assertAccess(establishmentId, "orders.handle");
  return adminAuth().createCustomToken(access.session.userId);
}

export async function advanceOrder(
  establishmentId: string,
  orderId: string,
  status: OrderStatus,
  reason = "",
): Promise<ActionResult> {
  await assertAccess(establishmentId, "orders.handle");
  if (!ORDER_STATUSES.includes(status)) return { ok: false, message: "État inconnu." };
  try {
    await setOrderStatus(establishmentId, orderId, status, String(reason).trim().slice(0, 120));
  } catch (error) {
    // Un collègue a été plus rapide : la commande a déjà avancé.
    if (error instanceof TransitionError) return { ok: false, message: "Cette commande a déjà changé d'état." };
    throw error;
  }
  return { ok: true };
}

/* ——— Équipe ——— */

export async function invite(establishmentId: string, _previous: FormState, formData: FormData): Promise<FormState> {
  const access = await editor(establishmentId, "team.manage");
  if (!access) return { message: READ_ONLY };
  const parsed = parseForm(invitationSchema, formData);
  if ("state" in parsed) return parsed.state;

  const plan = PLANS[access.establishment.subscription?.plan ?? "menu"];
  const [members, pending] = await Promise.all([listMembers(establishmentId), listInvitations(establishmentId)]);
  if (members.length + pending.length >= plan.maxMembers) {
    return { message: `L'offre « ${plan.name} » donne ${plan.maxMembers} accès. Retirez quelqu'un, ou changez d'offre.` };
  }
  if (members.some((member) => member.email === parsed.data.email)) {
    return { errors: { email: "Cette personne fait déjà partie de l'équipe." } };
  }
  await createInvitation({
    establishmentId,
    establishmentName: access.establishment.name,
    role: parsed.data.role,
    email: parsed.data.email,
  });
  refresh();
  return { ok: true, message: "Invitation créée. Envoyez-lui le lien ci-dessous." };
}

export async function revokeInvitation(establishmentId: string, code: string): Promise<ActionResult> {
  await assertAccess(establishmentId, "team.manage");
  const pending = await listInvitations(establishmentId);
  if (pending.some((invitation) => invitation.code === code)) await deleteInvitation(code);
  refresh();
  return { ok: true };
}

export async function changeMember(
  establishmentId: string,
  userId: string,
  role: Role | "remove",
): Promise<ActionResult> {
  const access = await assertAccess(establishmentId, "team.manage");
  if (userId === access.establishment.ownerId) return { ok: false, message: "Le propriétaire ne peut pas être retiré." };
  if (role === "remove") await removeMember(establishmentId, userId);
  else if (role !== "owner" && ROLES.includes(role)) await setMemberRole(establishmentId, userId, role);
  else return { ok: false, message: "Rôle inconnu." };
  refresh();
  return { ok: true };
}

/* ——— Abonnement ——— */

/** Changer d'offre pendant l'essai est libre ; ensuite, cela passe par un paiement. */
export async function changePlan(establishmentId: string, plan: PlanId): Promise<ActionResult> {
  const access = await assertAccess(establishmentId, "billing.manage");
  const { subscription } = access.establishment;
  if (!subscription || !PLAN_IDS.includes(plan)) return { ok: false, message: "Offre inconnue." };
  if (subscriptionState(subscription, Date.now()) !== "trial") {
    return { ok: false, message: "Hors essai, l'offre change au prochain paiement : écrivez-nous." };
  }
  await setSubscription(establishmentId, { ...subscription, plan });
  publish(access);
  return { ok: true };
}
