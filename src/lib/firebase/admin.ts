import "server-only";

import { cert, getApp, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getStorage, type Storage } from "firebase-admin/storage";
import { resolveEmulatorUse } from "./emulators";

function createAdminApp(): App {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!projectId) {
    throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID n'est pas défini (voir .env.example).");
  }

  // Le SDK d'administration se branche seul sur les émulateurs dès que ces variables existent.
  const emulated = resolveEmulatorUse({
    projectId,
    requested: Boolean(
      process.env.FIRESTORE_EMULATOR_HOST ||
        process.env.FIREBASE_AUTH_EMULATOR_HOST ||
        process.env.FIREBASE_STORAGE_EMULATOR_HOST,
    ),
  });
  if (emulated) return initializeApp({ projectId, storageBucket });

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  // La clé est stockée sur une seule ligne, avec des « \n » écrits en toutes lettres.
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!clientEmail || !privateKey) {
    throw new Error(
      "FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY sont nécessaires hors des émulateurs (voir .env.example).",
    );
  }
  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket,
  });
}

/** L'application Firebase côté serveur, créée au premier appel. */
export function adminApp(): App {
  return getApps().length > 0 ? getApp() : createAdminApp();
}

export function adminAuth(): Auth {
  return getAuth(adminApp());
}

/** Réservé à src/lib/db : aucune page ne parle directement à Firestore. */
export function adminDb(): Firestore {
  return getFirestore(adminApp());
}

export function adminStorage(): Storage {
  return getStorage(adminApp());
}
