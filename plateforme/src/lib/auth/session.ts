import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEstablishment, getMember } from "@/lib/db/establishments";
import type { Establishment, Member, UserProfile } from "@/lib/db/types";
import { getUser } from "@/lib/db/users";
import { adminAuth } from "@/lib/firebase/admin";
import { can, type Action } from "./permissions";

/* La session (ARCHITECTURE.md §3.3) : un cookie sécurisé, lu et vérifié par le serveur à chaque page. */

const COOKIE = "session";
const DURATION_MS = 14 * 24 * 60 * 60 * 1000;

export interface Session {
  userId: string;
  email: string;
  emailVerified: boolean;
  superAdmin: boolean;
}

export async function startSession(idToken: string): Promise<void> {
  const value = await adminAuth().createSessionCookie(idToken, { expiresIn: DURATION_MS });
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: DURATION_MS / 1000,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

/** La session de la requête en cours, ou `null`. Lue une seule fois par requête. */
export const getSession = cache(async (): Promise<Session | null> => {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return null;
  try {
    const claims = await adminAuth().verifySessionCookie(value);
    return {
      userId: claims.uid,
      email: claims.email ?? "",
      emailVerified: claims.email_verified === true,
      superAdmin: claims.superAdmin === true,
    };
  } catch {
    // Cookie expiré ou falsifié : comme s'il n'y en avait pas.
    return null;
  }
});

export const getCurrentUser = cache(async (): Promise<UserProfile | null> => {
  const session = await getSession();
  return session ? getUser(session.userId) : null;
});

/** Exige une personne connectée dont l'e-mail est vérifié ; sinon renvoie vers la bonne page. */
export async function requireUser(): Promise<{ session: Session; user: UserProfile }> {
  const session = await getSession();
  if (!session) redirect("/connexion");
  if (!session.emailVerified) redirect("/verification");
  const user = await getCurrentUser();
  if (!user) redirect("/connexion");
  return { session, user };
}

export async function requireSuperAdmin(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/connexion");
  if (!session.superAdmin) redirect("/app");
  return session;
}

export interface Access {
  session: Session;
  user: UserProfile;
  establishment: Establishment;
  member: Member;
}

/** Les droits de la personne connectée dans un établissement, ou `null` si elle n'en est pas membre. */
export const getAccess = cache(async (establishmentId: string): Promise<Access | null> => {
  const { session, user } = await requireUser();
  const [establishment, member] = await Promise.all([
    getEstablishment(establishmentId),
    getMember(establishmentId, session.userId),
  ]);
  if (!establishment) return null;
  if (member) return { session, user, establishment, member };
  // L'administration ouvre le tableau de bord d'un gérant pour l'aider, avec tous les droits (ARCHITECTURE.md §6.10).
  if (!session.superAdmin) return null;
  return {
    session,
    user,
    establishment,
    member: { userId: session.userId, role: "owner", name: "Administration", email: session.email, addedAt: 0 },
  };
});

/** Pour une page : exige d'être membre et d'avoir le droit demandé, sinon retour à la liste. */
export async function requireAccess(establishmentId: string, action?: Action): Promise<Access> {
  const access = await getAccess(establishmentId);
  if (!access) redirect("/app");
  if (action && !can(access.member.role, action)) redirect(`/app/${establishmentId}`);
  return access;
}

/** Pour une action : même contrôle, mais lève une erreur au lieu de rediriger. */
export async function assertAccess(establishmentId: string, action: Action): Promise<Access> {
  const access = await getAccess(establishmentId);
  if (!access || !can(access.member.role, action)) {
    throw new Error("Vous n'avez pas le droit de faire cela.");
  }
  return access;
}
