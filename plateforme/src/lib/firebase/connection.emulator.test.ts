import { doc, getDoc, terminate } from "firebase/firestore";
import { getBytes, ref } from "firebase/storage";
import { afterAll, describe, expect, it } from "vitest";
import { adminAuth, adminDb, adminStorage } from "./admin";
import { clientDb } from "./client-firestore";
import { clientStorage } from "./client-storage";

/*
 * Vérifie, sur les émulateurs, que l'application sait parler à Firebase des
 * deux côtés, et que le navigateur n'a aucun accès direct tant qu'une règle
 * ne l'ouvre pas. Lancé par « npm run test:emulators ».
 */

afterAll(async () => {
  await terminate(clientDb());
});

describe("côté serveur", () => {
  it("écrit puis relit un document", async () => {
    const document = adminDb().collection("_checks").doc();
    await document.set({ name: "Chez Ali" });

    const snapshot = await document.get();
    expect(snapshot.data()).toEqual({ name: "Chez Ali" });

    await document.delete();
  });

  it("crée puis retrouve un compte", async () => {
    const email = `check-${Date.now()}@exemple.ci`;
    const created = await adminAuth().createUser({ email, password: "un-mot-de-passe" });

    const found = await adminAuth().getUserByEmail(email);
    expect(found.uid).toBe(created.uid);

    await adminAuth().deleteUser(created.uid);
  });

  it("enregistre puis relit un fichier", async () => {
    const file = adminStorage().bucket().file("_checks/bonjour.txt");
    await file.save("bonjour");

    const [content] = await file.download();
    expect(content.toString()).toBe("bonjour");

    await file.delete();
  });
});

describe("côté navigateur : fermé par défaut", () => {
  it("refuse la lecture directe de la base", async () => {
    const document = adminDb().doc("establishments/check");
    await document.set({ name: "Chez Ali" });

    await expect(getDoc(doc(clientDb(), "establishments/check"))).rejects.toMatchObject({
      code: "permission-denied",
    });

    await document.delete();
  });

  it("refuse la lecture directe d'un fichier", async () => {
    await expect(
      getBytes(ref(clientStorage(), "establishments/check/photo.webp")),
    ).rejects.toMatchObject({ code: "storage/unauthorized" });
  });
});
