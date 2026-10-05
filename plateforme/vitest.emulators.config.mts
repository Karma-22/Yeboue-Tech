import { readFileSync } from "node:fs";
import path from "node:path";
import { parseEnv } from "node:util";
import { defineConfig } from "vitest/config";

const root = import.meta.dirname;

// Tests qui parlent aux émulateurs Firebase. Lancés par « npm run test:emulators ».
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
      // « server-only » refuse tout import hors du serveur Next. Ici on teste justement le code serveur.
      "server-only": path.resolve(root, "test/stubs/server-only.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.emulator.test.ts"],
    // Les mêmes réglages que « npm run dev » : projet de démonstration et adresses des émulateurs.
    env: parseEnv(readFileSync(path.resolve(root, ".env.development"), "utf8")),
    // Le premier appel charge tout le SDK d'administration : large marge pour les machines lentes.
    testTimeout: 120_000,
    hookTimeout: 120_000,
  },
});
