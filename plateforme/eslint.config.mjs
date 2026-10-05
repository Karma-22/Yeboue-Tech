import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/*
 * Les règles de rangement d'ARCHITECTURE.md §14, vérifiées automatiquement.
 * Une seule règle « no-restricted-imports » s'applique par fichier (la dernière
 * l'emporte) : chaque bloc reprend donc les interdits communs.
 */
const firestoreOnlyInDb = {
  paths: [
    {
      name: "@/lib/firebase/admin",
      importNames: ["adminDb"],
      message: "Seul src/lib/db lit et écrit Firestore (ARCHITECTURE.md §14).",
    },
    {
      name: "@/lib/firebase/client-firestore",
      message: "Seul src/lib/db lit et écrit Firestore (ARCHITECTURE.md §14).",
    },
  ],
  patterns: [
    {
      group: ["firebase/firestore", "firebase/firestore/*", "firebase-admin/firestore"],
      message: "Seul src/lib/db lit et écrit Firestore (ARCHITECTURE.md §14).",
    },
  ],
};

/** Interdit à un espace d'importer les composants des autres espaces. */
function componentsOf(space) {
  const others = ["marketing", "dashboard", "public"].filter((name) => name !== space);
  return {
    files: [`src/components/${space}/**`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: firestoreOnlyInDb.paths,
          patterns: [
            ...firestoreOnlyInDb.patterns,
            {
              group: others.map((name) => `@/components/${name}/**`),
              message:
                "Les composants d'un espace ne s'importent pas dans un autre : passer par src/components/ui (ARCHITECTURE.md §14).",
            },
          ],
        },
      ],
    },
  };
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/db/**", "src/lib/firebase/**"],
    rules: {
      "no-restricted-imports": ["error", firestoreOnlyInDb],
    },
  },
  componentsOf("marketing"),
  componentsOf("dashboard"),
  componentsOf("public"),
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    ".tools/**",
  ]),
]);

export default eslintConfig;
