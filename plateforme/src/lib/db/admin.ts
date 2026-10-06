import "server-only";

import { randomBytes } from "node:crypto";
import { db, many, one } from "./core";
import type { AdminLog, Invitation, Payment, Role } from "./types";

/* Invitations d'équipe, paiements et journal de l'administration. */

const invitations = () => db().collection("invitations");
const payments = () => db().collection("payments");
const adminLogs = () => db().collection("adminLogs");

const WEEK = 7 * 24 * 60 * 60 * 1000;

export async function createInvitation(input: {
  establishmentId: string;
  establishmentName: string;
  role: Exclude<Role, "owner">;
  email: string;
}): Promise<Invitation> {
  // Le code est long et tiré au hasard : il ne se devine pas.
  const code = randomBytes(18).toString("base64url");
  const data = { ...input, expiresAt: Date.now() + WEEK, usedAt: null };
  await invitations().doc(code).set(data);
  return { ...data, code };
}

export async function getInvitation(code: string): Promise<Invitation | null> {
  const snapshot = await invitations().doc(code).get();
  if (!snapshot.exists) return null;
  return { ...(snapshot.data() as Omit<Invitation, "code">), code };
}

export async function listInvitations(establishmentId: string): Promise<Invitation[]> {
  const snapshot = await invitations().where("establishmentId", "==", establishmentId).get();
  return snapshot.docs
    .map((doc) => ({ ...(doc.data() as Omit<Invitation, "code">), code: doc.id }))
    .filter((invitation) => invitation.usedAt === null && invitation.expiresAt > Date.now());
}

export async function markInvitationUsed(code: string): Promise<void> {
  await invitations().doc(code).update({ usedAt: Date.now() });
}

export async function deleteInvitation(code: string): Promise<void> {
  await invitations().doc(code).delete();
}

export async function recordPayment(payment: Omit<Payment, "id" | "createdAt">): Promise<Payment> {
  const data = { ...payment, createdAt: Date.now() };
  const ref = await payments().add(data);
  return { ...data, id: ref.id };
}

export async function listPayments(limit = 200): Promise<Payment[]> {
  return many<Omit<Payment, "id">>(await payments().orderBy("createdAt", "desc").limit(limit).get());
}

export async function listPaymentsOf(establishmentId: string): Promise<Payment[]> {
  const snapshot = await payments().where("establishmentId", "==", establishmentId).get();
  return many<Omit<Payment, "id">>(snapshot).sort((a, b) => b.createdAt - a.createdAt);
}

export async function getPayment(id: string): Promise<Payment | null> {
  return one<Omit<Payment, "id">>(await payments().doc(id).get());
}

/** Inscrit une action d'administration au journal. Rien ne s'y efface. */
export async function logAdminAction(entry: Omit<AdminLog, "id" | "createdAt">): Promise<void> {
  await adminLogs().add({ ...entry, createdAt: Date.now() });
}

export async function listAdminLogs(limit = 200): Promise<AdminLog[]> {
  return many<Omit<AdminLog, "id">>(await adminLogs().orderBy("createdAt", "desc").limit(limit).get());
}
