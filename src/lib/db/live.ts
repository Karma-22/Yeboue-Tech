import { inMemoryPersistence, setPersistence, signInWithCustomToken } from "firebase/auth";
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { clientAuth } from "@/lib/firebase/client-auth";
import { clientDb } from "@/lib/firebase/client-firestore";
import type { Order } from "./types";

/*
 * Le seul accès direct du navigateur à la base (ARCHITECTURE.md §12) : écouter
 * les commandes en direct. Rien ne s'écrit d'ici ; les règles Firestore
 * n'autorisent que ces deux lectures.
 */

const ordersOf = (establishmentId: string) => collection(clientDb(), "establishments", establishmentId, "orders");

/** Le client suit sa commande : il en connaît l'identifiant, impossible à deviner. */
export function watchOrder(
  establishmentId: string,
  orderId: string,
  onChange: (order: Order | null) => void,
): () => void {
  return onSnapshot(
    doc(ordersOf(establishmentId), orderId),
    (snapshot) => onChange(snapshot.exists() ? ({ ...snapshot.data(), id: snapshot.id } as Order) : null),
    () => {},
  );
}

/** Ouvre la session Firebase du navigateur avec un jeton remis par le serveur. Rien n'est gardé une fois l'onglet fermé. */
export async function connectStaff(token: string): Promise<void> {
  const auth = clientAuth();
  await setPersistence(auth, inMemoryPersistence);
  await signInWithCustomToken(auth, token);
}

/** Le personnel écoute les commandes passées depuis `since`, les plus récentes d'abord. */
export function watchOrders(
  establishmentId: string,
  since: number,
  onChange: (orders: Order[]) => void,
  onError: (error: Error) => void,
): () => void {
  return onSnapshot(
    query(ordersOf(establishmentId), where("createdAt", ">=", since), orderBy("createdAt", "desc")),
    (snapshot) => onChange(snapshot.docs.map((entry) => ({ ...entry.data(), id: entry.id }) as Order)),
    onError,
  );
}
