import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { DEFAULT_ACCENT, DEFAULT_TEMPLATE } from "@/config/templates";
import { db, many, one } from "./core";
import type { Establishment, EstablishmentType, Member, Role, Subscription, UserProfile } from "./types";

const establishments = () => db().collection("establishments");
const slugs = () => db().collection("slugs");
const members = (establishmentId: string) => establishments().doc(establishmentId).collection("members");

type EstablishmentData = Omit<Establishment, "id">;

/** L'adresse demandée est déjà prise par un autre établissement. */
export class SlugTakenError extends Error {
  constructor(slug: string) {
    super(`L'adresse « ${slug} » est déjà prise.`);
    this.name = "SlugTakenError";
  }
}

export async function getEstablishment(id: string): Promise<Establishment | null> {
  return one<EstablishmentData>(await establishments().doc(id).get());
}

/** Trouve un établissement par son adresse, en suivant l'ancienne adresse s'il a été renommé. */
export async function getEstablishmentBySlug(slug: string): Promise<Establishment | null> {
  const entry = await slugs().doc(slug).get();
  if (!entry.exists) return null;
  const { establishmentId } = entry.data() as { establishmentId: string };
  return getEstablishment(establishmentId);
}

export async function isSlugFree(slug: string): Promise<boolean> {
  return !(await slugs().doc(slug).get()).exists;
}

interface NewEstablishment {
  name: string;
  slug: string;
  type: EstablishmentType;
  district: string;
  whatsapp: string;
  owner: UserProfile;
}

/**
 * Crée l'établissement, réserve son adresse et inscrit son propriétaire, en
 * une seule opération : soit tout existe, soit rien.
 */
export async function createEstablishment(input: NewEstablishment): Promise<Establishment> {
  const ref = establishments().doc();
  const now = Date.now();
  const data: EstablishmentData = {
    name: input.name,
    slug: input.slug,
    type: input.type,
    ownerId: input.owner.id,
    description: "",
    address: "",
    district: input.district,
    city: "Abidjan",
    phone: input.whatsapp,
    whatsapp: input.whatsapp,
    hours: "",
    logoUrl: null,
    coverUrl: null,
    template: DEFAULT_TEMPLATE,
    accentColor: DEFAULT_ACCENT,
    english: false,
    googleReviewUrl: "",
    published: false,
    subscription: null,
    setupStep: 2,
    createdAt: now,
    updatedAt: now,
  };
  const owner: Omit<Member, "userId"> = {
    role: "owner",
    name: `${input.owner.firstName} ${input.owner.lastName}`.trim(),
    email: input.owner.email,
    addedAt: now,
  };

  await db().runTransaction(async (transaction) => {
    const slugRef = slugs().doc(input.slug);
    if ((await transaction.get(slugRef)).exists) throw new SlugTakenError(input.slug);
    transaction.set(slugRef, { establishmentId: ref.id });
    transaction.set(ref, data);
    transaction.set(members(ref.id).doc(input.owner.id), owner);
    transaction.update(db().collection("users").doc(input.owner.id), {
      establishmentIds: FieldValue.arrayUnion(ref.id),
    });
  });

  return { ...data, id: ref.id };
}

export async function updateEstablishment(
  id: string,
  patch: Partial<Omit<EstablishmentData, "slug" | "ownerId" | "createdAt">>,
): Promise<void> {
  await establishments().doc(id).update({ ...patch, updatedAt: Date.now() });
}

export async function setSubscription(id: string, subscription: Subscription): Promise<void> {
  await establishments().doc(id).update({ subscription, updatedAt: Date.now() });
}

export async function listEstablishmentsOf(user: UserProfile): Promise<Establishment[]> {
  if (user.establishmentIds.length === 0) return [];
  const snapshots = await db().getAll(...user.establishmentIds.map((id) => establishments().doc(id)));
  return snapshots
    .map((snapshot) => one<EstablishmentData>(snapshot))
    .filter((establishment): establishment is Establishment => establishment !== null);
}

/** Tous les établissements, du plus récent au plus ancien. Réservé à l'administration. */
export async function listAllEstablishments(limit = 500): Promise<Establishment[]> {
  return many<EstablishmentData>(await establishments().orderBy("createdAt", "desc").limit(limit).get());
}

/* ——— Équipe ——— */

export async function getMember(establishmentId: string, userId: string): Promise<Member | null> {
  const snapshot = await members(establishmentId).doc(userId).get();
  if (!snapshot.exists) return null;
  return { ...(snapshot.data() as Omit<Member, "userId">), userId: snapshot.id };
}

export async function listMembers(establishmentId: string): Promise<Member[]> {
  const snapshot = await members(establishmentId).orderBy("addedAt", "asc").get();
  return snapshot.docs.map((doc) => ({ ...(doc.data() as Omit<Member, "userId">), userId: doc.id }));
}

export async function addMember(
  establishmentId: string,
  user: UserProfile,
  role: Exclude<Role, "owner">,
): Promise<void> {
  const batch = db().batch();
  batch.set(members(establishmentId).doc(user.id), {
    role,
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    addedAt: Date.now(),
  });
  batch.update(db().collection("users").doc(user.id), {
    establishmentIds: FieldValue.arrayUnion(establishmentId),
  });
  await batch.commit();
}

export async function removeMember(establishmentId: string, userId: string): Promise<void> {
  const batch = db().batch();
  batch.delete(members(establishmentId).doc(userId));
  batch.update(db().collection("users").doc(userId), {
    establishmentIds: FieldValue.arrayRemove(establishmentId),
  });
  await batch.commit();
}

export async function setMemberRole(
  establishmentId: string,
  userId: string,
  role: Exclude<Role, "owner">,
): Promise<void> {
  await members(establishmentId).doc(userId).update({ role });
}
