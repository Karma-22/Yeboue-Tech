import "server-only";

import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { countAttempt, deleteCode, getCode, saveCode, type CodePurpose } from "@/lib/db/codes";
import { isDemoProject } from "@/lib/firebase/emulators";

/* Les codes à 6 chiffres : vérification de l'e-mail et mot de passe oublié. */

export const CODE_LENGTH = 6;
const VALIDITY_MS = 10 * 60 * 1000;
export const RESEND_DELAY_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;
const MAX_PER_HOUR = 5;
const HOUR = 60 * 60 * 1000;

function hash(userId: string, purpose: CodePurpose, code: string): string {
  return createHash("sha256").update(`${userId}:${purpose}:${code}`).digest("hex");
}

export type IssueResult = { ok: true; code: string } | { ok: false; reason: "too-soon" | "too-many"; waitMs: number };

/** Tire un nouveau code et l'enregistre. Refuse si le précédent vient de partir, ou s'il y en a eu trop. */
export async function issueCode(userId: string, purpose: CodePurpose): Promise<IssueResult> {
  const now = Date.now();
  const previous = await getCode(userId, purpose);

  if (previous && now - previous.lastSentAt < RESEND_DELAY_MS) {
    return { ok: false, reason: "too-soon", waitMs: RESEND_DELAY_MS - (now - previous.lastSentAt) };
  }
  const sameWindow = previous !== null && now - previous.windowStart < HOUR;
  if (sameWindow && previous.sentCount >= MAX_PER_HOUR) {
    return { ok: false, reason: "too-many", waitMs: HOUR - (now - previous.windowStart) };
  }

  const code = String(randomInt(0, 10 ** CODE_LENGTH)).padStart(CODE_LENGTH, "0");
  await saveCode(userId, purpose, {
    codeHash: hash(userId, purpose, code),
    expiresAt: now + VALIDITY_MS,
    attempts: 0,
    lastSentAt: now,
    sentCount: sameWindow ? previous.sentCount + 1 : 1,
    windowStart: sameWindow ? previous.windowStart : now,
    // Avec les émulateurs, aucun e-mail ne part : on garde le code pour l'afficher à l'écran.
    ...(isDemoProject(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) ? { devCode: code } : {}),
  });
  return { ok: true, code };
}

export type CheckResult = "ok" | "wrong" | "expired" | "locked";

/** Compare un code saisi à celui qui a été envoyé. Cinq essais, puis il faut en demander un autre. */
export async function checkCode(userId: string, purpose: CodePurpose, input: string): Promise<CheckResult> {
  const stored = await getCode(userId, purpose);
  if (!stored || Date.now() > stored.expiresAt) return "expired";
  if (stored.attempts >= MAX_ATTEMPTS) return "locked";

  const expected = Buffer.from(stored.codeHash, "hex");
  const given = Buffer.from(hash(userId, purpose, input.trim()), "hex");
  if (expected.length === given.length && timingSafeEqual(expected, given)) {
    await deleteCode(userId, purpose);
    return "ok";
  }
  await countAttempt(userId, purpose, stored.attempts + 1);
  return stored.attempts + 1 >= MAX_ATTEMPTS ? "locked" : "wrong";
}

/** En développement seulement : le code en attente, pour l'afficher sur la page. */
export async function pendingDevCode(userId: string, purpose: CodePurpose): Promise<string | null> {
  if (!isDemoProject(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)) return null;
  return (await getCode(userId, purpose))?.devCode ?? null;
}
