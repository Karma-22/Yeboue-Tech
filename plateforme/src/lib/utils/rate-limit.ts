import "server-only";

import { headers } from "next/headers";

/*
 * Un frein simple pour les points ouverts au public (ARCHITECTURE.md §12) :
 * tant d'appels par appareil et par période. Le compte est tenu en mémoire, par
 * serveur : c'est un garde-fou contre les abus, pas une barrière absolue.
 */

const calls = new Map<string, number[]>();
const MAX_KEYS = 5000;

/** Vrai si l'appel est accepté ; faux si cet appareil en a déjà fait `limit` pendant la période. */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (calls.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) {
    calls.set(key, recent);
    return false;
  }
  recent.push(now);
  calls.set(key, recent);
  // La mémoire ne grossit pas sans fin : au-delà d'un seuil, on repart de zéro.
  if (calls.size > MAX_KEYS) calls.clear();
  return true;
}

/** Ce qui distingue un appareil d'un autre, vu du serveur : son adresse. */
export async function clientKey(): Promise<string> {
  const forwarded = (await headers()).get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0].trim() || "local";
}
