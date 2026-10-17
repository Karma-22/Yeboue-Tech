import "server-only";

import { db } from "./core";

/* Les codes à 6 chiffres envoyés par e-mail (ARCHITECTURE.md §3.1 bis). On n'enregistre que leur empreinte. */

export type CodePurpose = "verify" | "reset";

export interface StoredCode {
  codeHash: string;
  expiresAt: number;
  attempts: number;
  lastSentAt: number;
  /** Envois depuis `windowStart`, pour limiter le nombre de codes par heure. */
  sentCount: number;
  windowStart: number;
  /** Le code en clair. Présent seulement avec les émulateurs, pour l'afficher à l'écran en développement. */
  devCode?: string;
}

const codes = () => db().collection("emailCodes");
const key = (userId: string, purpose: CodePurpose) => `${userId}_${purpose}`;

export async function getCode(userId: string, purpose: CodePurpose): Promise<StoredCode | null> {
  const snapshot = await codes().doc(key(userId, purpose)).get();
  return snapshot.exists ? (snapshot.data() as StoredCode) : null;
}

export async function saveCode(userId: string, purpose: CodePurpose, code: StoredCode): Promise<void> {
  await codes().doc(key(userId, purpose)).set(code);
}

export async function countAttempt(userId: string, purpose: CodePurpose, attempts: number): Promise<void> {
  await codes().doc(key(userId, purpose)).update({ attempts });
}

export async function deleteCode(userId: string, purpose: CodePurpose): Promise<void> {
  await codes().doc(key(userId, purpose)).delete();
}
