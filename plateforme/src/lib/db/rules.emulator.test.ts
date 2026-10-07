import { beforeAll, describe, expect, it } from "vitest";
import { adminAuth, adminDb } from "@/lib/firebase/admin";

/*
 * Les règles de sécurité de Firestore (ARCHITECTURE.md §12), essayées comme le
 * ferait un navigateur : par l'interface publique de la base, sans passer par
 * le serveur. Seules les commandes doivent se lire, et rien ne doit s'écrire.
 */

const PROJECT = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const FIRESTORE = `http://${process.env.FIRESTORE_EMULATOR_HOST}/v1/projects/${PROJECT}/databases/(default)/documents`;
const IDENTITY = `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1`;

const run = Date.now().toString(36);
const establishmentId = `rules-${run}`;
const otherEstablishmentId = `rules-other-${run}`;
const orderId = `order-${run}`;

/** Lit ou écrit comme un navigateur : avec le jeton d'un compte, ou sans rien. */
function asBrowser(path: string, token?: string, init: RequestInit = {}) {
  return fetch(`${FIRESTORE}/${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
  });
}

/** Crée un compte dans l'émulateur et rend son identifiant et son jeton de connexion. */
async function signUp(label: string): Promise<{ uid: string; token: string }> {
  const response = await fetch(`${IDENTITY}/accounts:signUp?key=demo-api-key`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: `${label}-${run}@demo.test`, password: "motdepasse-1", returnSecureToken: true }),
  });
  const json = (await response.json()) as { localId: string; idToken: string };
  return { uid: json.localId, token: json.idToken };
}

let member: { uid: string; token: string };
let stranger: { uid: string; token: string };

beforeAll(async () => {
  [member, stranger] = await Promise.all([signUp("membre"), signUp("inconnu")]);
  const db = adminDb();
  const establishment = db.collection("establishments").doc(establishmentId);
  await Promise.all([
    establishment.set({ name: "Règles", slug: establishmentId }),
    establishment.collection("members").doc(member.uid).set({ role: "waiter" }),
    establishment.collection("orders").doc(orderId).set({ status: "new", total: 1000, createdAt: Date.now() }),
    establishment.collection("items").doc("item").set({ name: "Riz", price: 1000 }),
    db.collection("establishments").doc(otherEstablishmentId).set({ name: "Autre" }),
    db.collection("users").doc(member.uid).set({ email: "membre@demo.test" }),
  ]);
  // Le compte existe bien côté serveur : les règles s'appuient sur son identifiant.
  await adminAuth().getUser(member.uid);
});

describe("règles Firestore", () => {
  it("laisse un client lire sa commande, dont il connaît l'identifiant", async () => {
    const response = await asBrowser(`establishments/${establishmentId}/orders/${orderId}`);
    expect(response.status).toBe(200);
  });

  it("refuse à un inconnu la liste des commandes", async () => {
    expect((await asBrowser(`establishments/${establishmentId}/orders`)).status).toBe(403);
    expect((await asBrowser(`establishments/${establishmentId}/orders`, stranger.token)).status).toBe(403);
  });

  it("laisse un membre de l'équipe lister les commandes de son établissement", async () => {
    const response = await asBrowser(`establishments/${establishmentId}/orders`, member.token);
    expect(response.status).toBe(200);
  });

  it("refuse à ce membre les commandes d'un autre établissement", async () => {
    const response = await asBrowser(`establishments/${otherEstablishmentId}/orders`, member.token);
    expect(response.status).toBe(403);
  });

  it("refuse toute écriture, même à un membre", async () => {
    const order = `establishments/${establishmentId}/orders/${orderId}`;
    const body = JSON.stringify({ fields: { status: { stringValue: "served" } } });
    expect((await asBrowser(order, member.token, { method: "PATCH", body })).status).toBe(403);
    expect((await asBrowser(order, undefined, { method: "DELETE" })).status).toBe(403);
    expect(
      (await asBrowser(`establishments/${establishmentId}/orders?documentId=faux`, member.token, { method: "POST", body })).status,
    ).toBe(403);
  });

  it("refuse la lecture de tout le reste : établissement, carte, équipe, comptes", async () => {
    for (const path of [
      `establishments/${establishmentId}`,
      `establishments/${establishmentId}/items/item`,
      `establishments/${establishmentId}/members/${member.uid}`,
      `users/${member.uid}`,
    ]) {
      expect((await asBrowser(path, member.token)).status, path).toBe(403);
      expect((await asBrowser(path)).status, path).toBe(403);
    }
  });
});
