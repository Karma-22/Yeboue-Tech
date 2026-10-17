/** Ports des émulateurs, identiques à ceux de firebase.json. */
export const EMULATOR_PORTS = {
  auth: 9099,
  firestore: 8080,
  storage: 9199,
} as const;

/**
 * Un projet dont l'identifiant commence par « demo- » n'existe pas chez Google :
 * il ne peut fonctionner que sur les émulateurs.
 */
export function isDemoProject(projectId: string | undefined): boolean {
  return Boolean(projectId?.startsWith("demo-"));
}

/**
 * Dit s'il faut se brancher sur les émulateurs.
 *
 * Les émulateurs acceptent n'importe quel jeton de connexion : les brancher sur
 * un vrai projet ouvrirait l'application à tout le monde. On refuse donc de
 * démarrer dans ce cas, plutôt que de continuer en silence.
 */
export function resolveEmulatorUse(options: {
  projectId: string | undefined;
  requested: boolean;
}): boolean {
  if (!options.requested) return false;
  if (!isDemoProject(options.projectId)) {
    throw new Error(
      `Les émulateurs Firebase sont demandés, mais « ${options.projectId ?? "(aucun)"} » n'est pas un projet de démonstration. ` +
        "Utilisez un identifiant qui commence par « demo- », ou retirez les variables d'émulateur.",
    );
  }
  return true;
}

/** Adresse des émulateurs vue du navigateur : la machine qui sert la page. */
export function browserEmulatorHost(): string {
  if (typeof window === "undefined") return "127.0.0.1";
  const { hostname } = window.location;
  return hostname === "localhost" ? "127.0.0.1" : hostname;
}

/**
 * Exécute `connect` une seule fois par service, même quand le rechargement à
 * chaud ré-évalue les modules en développement.
 */
export function connectOnce(service: keyof typeof EMULATOR_PORTS, connect: () => void): void {
  const store = globalThis as { __firebaseEmulators?: Set<string> };
  store.__firebaseEmulators ??= new Set();
  if (store.__firebaseEmulators.has(service)) return;
  store.__firebaseEmulators.add(service);
  connect();
}
