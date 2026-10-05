import { connectAuthEmulator, getAuth, type Auth } from "firebase/auth";
import { clientApp, clientUsesEmulators } from "./client-app";
import { browserEmulatorHost, connectOnce, EMULATOR_PORTS } from "./emulators";

/** Les comptes, côté navigateur. */
export function clientAuth(): Auth {
  const auth = getAuth(clientApp());
  if (clientUsesEmulators()) {
    connectOnce("auth", () => {
      connectAuthEmulator(auth, `http://${browserEmulatorHost()}:${EMULATOR_PORTS.auth}`, {
        disableWarnings: true,
      });
    });
  }
  return auth;
}
