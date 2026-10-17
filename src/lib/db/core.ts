import "server-only";

import type { DocumentSnapshot, Firestore, QuerySnapshot } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebase/admin";

/*
 * Le seul dossier qui lit et écrit Firestore (ARCHITECTURE.md §14).
 * Ce fichier en regroupe les petits outils.
 */

export function db(): Firestore {
  return adminDb();
}

/** Un document Firestore, avec son identifiant. `null` s'il n'existe pas. */
export function one<T>(snapshot: DocumentSnapshot): (T & { id: string }) | null {
  if (!snapshot.exists) return null;
  return { ...(snapshot.data() as T), id: snapshot.id };
}

export function many<T>(snapshot: QuerySnapshot): (T & { id: string })[] {
  return snapshot.docs.map((doc) => ({ ...(doc.data() as T), id: doc.id }));
}

/** L'étiquette de cache de la page publique d'un établissement. */
export function pageTag(slug: string): string {
  return `page:${slug}`;
}

/** Aujourd'hui à Abidjan (UTC, sans heure d'été), au format `aaaa-mm-jj`. */
export function dayKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}
