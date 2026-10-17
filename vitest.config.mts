import path from "node:path";
import { configDefaults, defineConfig } from "vitest/config";

// Tests rapides, sans rien à lancer à côté. Ceux qui ont besoin des émulateurs
// Firebase sont dans vitest.emulators.config.mts.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    exclude: [...configDefaults.exclude, "src/**/*.emulator.test.ts"],
  },
});
