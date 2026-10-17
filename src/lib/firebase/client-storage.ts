import { connectStorageEmulator, getStorage, type FirebaseStorage } from "firebase/storage";
import { clientApp, clientUsesEmulators } from "./client-app";
import { browserEmulatorHost, connectOnce, EMULATOR_PORTS } from "./emulators";

/** Le stockage des photos, côté navigateur. */
export function clientStorage(): FirebaseStorage {
  const storage = getStorage(clientApp());
  if (clientUsesEmulators()) {
    connectOnce("storage", () => {
      connectStorageEmulator(storage, browserEmulatorHost(), EMULATOR_PORTS.storage);
    });
  }
  return storage;
}
