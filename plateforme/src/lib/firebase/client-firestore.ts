import { connectFirestoreEmulator, getFirestore, type Firestore } from "firebase/firestore";
import { clientApp, clientUsesEmulators } from "./client-app";
import { browserEmulatorHost, connectOnce, EMULATOR_PORTS } from "./emulators";

/**
 * La base de données, côté navigateur. Réservée à src/lib/db, et seulement
 * pour l'écoute en direct des commandes : tout le reste passe par le serveur.
 */
export function clientDb(): Firestore {
  const db = getFirestore(clientApp());
  if (clientUsesEmulators()) {
    connectOnce("firestore", () => {
      connectFirestoreEmulator(db, browserEmulatorHost(), EMULATOR_PORTS.firestore);
    });
  }
  return db;
}
