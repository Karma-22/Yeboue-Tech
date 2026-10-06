import "server-only";

import { adminAuth } from "@/lib/firebase/admin";

/*
 * La connexion se fait ici, côté serveur, en parlant directement au service de
 * comptes de Firebase : le navigateur n'a pas à charger Firebase Auth.
 */

const emulator = process.env.FIREBASE_AUTH_EMULATOR_HOST;
const base = emulator
  ? `http://${emulator}/identitytoolkit.googleapis.com/v1`
  : "https://identitytoolkit.googleapis.com/v1";

/** Le service de comptes a refusé : mauvais mot de passe, compte inconnu, trop d'essais… */
export class IdentityError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = "IdentityError";
  }
}

async function call(method: string, body: Record<string, unknown>): Promise<{ idToken: string }> {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "";
  const response = await fetch(`${base}/accounts:${method}?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, returnSecureToken: true }),
    cache: "no-store",
  });
  const json = await response.json();
  if (!response.ok) throw new IdentityError(String(json?.error?.message ?? "UNKNOWN").split(" ")[0]);
  return json;
}

/** Vérifie l'e-mail et le mot de passe ; rend le jeton de connexion. */
export async function signInWithPassword(email: string, password: string): Promise<string> {
  return (await call("signInWithPassword", { email, password })).idToken;
}

/** Connecte un compte sans mot de passe : après une inscription ou une vérification réussie. */
export async function signInAs(userId: string): Promise<string> {
  const token = await adminAuth().createCustomToken(userId);
  return (await call("signInWithCustomToken", { token })).idToken;
}

/** Vrai si le refus vient d'identifiants incorrects, et non d'une panne. */
export function isBadCredentials(error: unknown): boolean {
  return (
    error instanceof IdentityError &&
    ["EMAIL_NOT_FOUND", "INVALID_PASSWORD", "INVALID_LOGIN_CREDENTIALS", "USER_DISABLED"].includes(error.code)
  );
}
