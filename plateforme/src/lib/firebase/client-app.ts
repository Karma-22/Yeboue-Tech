import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { resolveEmulatorUse } from "./emulators";

// Ces valeurs sont publiques par nature : elles identifient le projet, elles ne donnent aucun droit.
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** L'application Firebase côté navigateur. */
export function clientApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(config);
}

export function clientUsesEmulators(): boolean {
  return resolveEmulatorUse({
    projectId: config.projectId,
    requested: process.env.NEXT_PUBLIC_FIREBASE_USE_EMULATORS === "true",
  });
}
