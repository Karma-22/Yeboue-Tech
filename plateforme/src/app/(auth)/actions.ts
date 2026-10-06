"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkCode, issueCode, RESEND_DELAY_MS } from "@/lib/auth/codes";
import { isBadCredentials, signInAs, signInWithPassword } from "@/lib/auth/identity";
import { endSession, getSession, startSession } from "@/lib/auth/session";
import { PLANS } from "@/config/plans";
import { getInvitation, markInvitationUsed } from "@/lib/db/admin";
import { addMember, getEstablishment, listMembers } from "@/lib/db/establishments";
import { createUser, getUser } from "@/lib/db/users";
import { sendCodeEmail } from "@/lib/email/send";
import { adminAuth } from "@/lib/firebase/admin";
import {
  codeSchema,
  parseForm,
  resetRequestSchema,
  resetSchema,
  signInSchema,
  signUpSchema,
  type FormState,
} from "@/lib/validation/forms";

/** Nom du cookie qui retient une invitation d'équipe pendant l'inscription. */
const INVITATION_COOKIE = "invitation";

function hasCode(error: unknown, code: string): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === code;
}

/** Où aller une fois connecté : vers l'invitation en attente s'il y en a une, sinon le tableau de bord. */
async function afterSignIn(): Promise<string> {
  const store = await cookies();
  const invitation = store.get(INVITATION_COOKIE)?.value;
  if (!invitation) return "/app";
  store.delete(INVITATION_COOKIE);
  return `/invitation/${invitation}`;
}

export async function signUp(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(signUpSchema, formData);
  if ("state" in parsed) return parsed.state;
  const { firstName, lastName, phone, email, password } = parsed.data;
  const values = { firstName, lastName, phone: String(formData.get("phone") ?? ""), email };

  let userId: string;
  try {
    const record = await adminAuth().createUser({ email, password, displayName: `${firstName} ${lastName}` });
    userId = record.uid;
  } catch (error) {
    if (hasCode(error, "auth/email-already-exists")) {
      return { errors: { email: "Un compte existe déjà avec cette adresse. Connectez-vous." }, values };
    }
    throw error;
  }

  await createUser({ id: userId, firstName, lastName, email, phone, establishmentIds: [], createdAt: Date.now() });
  const issued = await issueCode(userId, "verify");
  if (issued.ok) await sendCodeEmail(email, issued.code, "verify");
  await startSession(await signInAs(userId));
  redirect("/verification");
}

export async function verifyEmail(_previous: FormState, formData: FormData): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/connexion");
  const parsed = parseForm(codeSchema, formData);
  if ("state" in parsed) return { message: parsed.state.errors?.code };

  const result = await checkCode(session.userId, "verify", parsed.data.code);
  if (result === "wrong") return { message: "Ce code n'est pas le bon. Vérifiez et réessayez." };
  if (result === "expired") return { message: "Ce code a expiré. Demandez-en un nouveau." };
  if (result === "locked") return { message: "Trop d'essais. Demandez un nouveau code." };

  await adminAuth().updateUser(session.userId, { emailVerified: true });
  // Nouvelle session : l'ancienne dit encore que l'adresse n'est pas vérifiée.
  await startSession(await signInAs(session.userId));
  // La page joue son animation de réussite, puis va à cette adresse.
  return { ok: true, message: await afterSignIn() };
}

export async function resendVerification(): Promise<FormState> {
  const session = await getSession();
  if (!session) redirect("/connexion");
  const issued = await issueCode(session.userId, "verify");
  if (!issued.ok) {
    return {
      message:
        issued.reason === "too-soon"
          ? `Patientez encore ${Math.ceil(issued.waitMs / 1000)} secondes avant de redemander un code.`
          : "Trop de codes demandés. Réessayez dans une heure.",
    };
  }
  await sendCodeEmail(session.email, issued.code, "verify");
  return { ok: true, message: `Un nouveau code est parti. Vous pourrez en redemander un dans ${RESEND_DELAY_MS / 1000} secondes.` };
}

export async function signIn(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(signInSchema, formData);
  if ("state" in parsed) return parsed.state;
  const { email, password } = parsed.data;

  let idToken: string;
  try {
    idToken = await signInWithPassword(email, password);
  } catch (error) {
    if (isBadCredentials(error)) {
      return { message: "E-mail ou mot de passe incorrect.", values: { email } };
    }
    if (hasCode(error, "TOO_MANY_ATTEMPTS_TRY_LATER")) {
      return { message: "Trop d'essais. Réessayez dans quelques minutes.", values: { email } };
    }
    throw error;
  }
  await startSession(idToken);
  redirect(await afterSignIn());
}

export async function signOut(): Promise<void> {
  await endSession();
  redirect("/connexion");
}

export async function requestPasswordReset(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(resetRequestSchema, formData);
  if ("state" in parsed) return parsed.state;
  const { email } = parsed.data;

  try {
    const user = await adminAuth().getUserByEmail(email);
    const issued = await issueCode(user.uid, "reset");
    if (issued.ok) await sendCodeEmail(email, issued.code, "reset");
  } catch (error) {
    // Compte inconnu : on ne le dit pas, pour ne pas révéler qui est inscrit.
    if (!hasCode(error, "auth/user-not-found")) throw error;
  }
  redirect(`/mot-de-passe-oublie?email=${encodeURIComponent(email)}`);
}

export async function resetPassword(_previous: FormState, formData: FormData): Promise<FormState> {
  const parsed = parseForm(resetSchema, formData);
  if ("state" in parsed) return parsed.state;
  const { email, code, password } = parsed.data;
  const wrong: FormState = { errors: { code: "Ce code n'est pas le bon, ou il a expiré." }, values: { email } };

  let userId: string;
  try {
    userId = (await adminAuth().getUserByEmail(email)).uid;
  } catch (error) {
    if (hasCode(error, "auth/user-not-found")) return wrong;
    throw error;
  }
  const result = await checkCode(userId, "reset", code);
  if (result === "locked") {
    return { errors: { code: "Trop d'essais. Demandez un nouveau code." }, values: { email } };
  }
  if (result !== "ok") return wrong;

  await adminAuth().updateUser(userId, { password });
  redirect("/connexion?motdepasse=change");
}

/** Retient une invitation d'équipe le temps de créer un compte ou de se connecter. */
export async function rememberInvitation(code: string): Promise<void> {
  (await cookies()).set(INVITATION_COOKIE, code, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 3600 });
}

/** Depuis la page d'invitation : retient l'invitation, puis envoie créer un compte ou se connecter. */
export async function continueInvitation(code: string, destination: "/inscription" | "/connexion"): Promise<void> {
  await rememberInvitation(code);
  redirect(destination === "/inscription" ? "/inscription" : "/connexion");
}

/** Fait entrer la personne connectée dans l'équipe qui l'a invitée (ARCHITECTURE.md §6.8). */
export async function acceptInvitation(code: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/connexion");
  if (!session.emailVerified) redirect("/verification");

  const invitation = await getInvitation(code);
  if (!invitation || invitation.usedAt !== null || invitation.expiresAt < Date.now() || invitation.role === "owner") {
    redirect(`/invitation/${code}`);
  }
  const [user, establishment, members] = await Promise.all([
    getUser(session.userId),
    getEstablishment(invitation.establishmentId),
    listMembers(invitation.establishmentId),
  ]);
  if (!user || !establishment) redirect(`/invitation/${code}`);

  if (!members.some((member) => member.userId === user.id)) {
    // L'offre a pu changer depuis l'envoi de l'invitation : on recompte.
    const plan = PLANS[establishment.subscription?.plan ?? "menu"];
    if (members.length >= plan.maxMembers) redirect(`/invitation/${code}?erreur=complet`);
    await addMember(establishment.id, user, invitation.role);
  }
  await markInvitationUsed(code);
  redirect(`/app/${establishment.id}`);
}
