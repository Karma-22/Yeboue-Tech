// Lance le site en mode rapide, sur la machine, branché sur les émulateurs.
//
//   npm run local                 construit le site (une dizaine de minutes), puis le lance
//   npm run local -- --lancer     relance le site déjà construit, sans le reconstruire
//
// « npm run dev » prépare chaque page à sa première ouverture : sur une machine
// lente, c'est une à deux minutes d'attente par page. Ici, tout est préparé une
// fois pour toutes, et chaque page s'ouvre aussitôt. À utiliser pour regarder et
// faire essayer le site ; pour modifier le code, garder « npm run dev ».
//
// Les émulateurs doivent tourner dans une autre fenêtre (npm run emulators).

import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Les mêmes réglages que « npm run dev » : le projet factice et les adresses des émulateurs.
const env = { ...process.env, ...parseEnv(readFileSync(path.join(root, ".env.development"), "utf8")) };

function run(command) {
  // Sous Windows, « npx » est un fichier .cmd : il ne se lance qu'à travers l'interpréteur de commandes.
  const result = spawnSync(command, { cwd: root, env, stdio: "inherit", shell: true });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

const startOnly = process.argv.includes("--lancer");
if (startOnly && !existsSync(path.join(root, ".next", "BUILD_ID"))) {
  console.error("\nLe site n'a pas encore été construit. Lancez d'abord « npm run local », sans option.\n");
  process.exit(1);
}

if (!startOnly) {
  console.log("\nConstruction du site : comptez une dizaine de minutes sur une machine lente. C'est à faire une seule fois.\n");
  run("npx next build");
}
console.log("\nLe site est prêt sur http://localhost:3000 — Ctrl+C pour l'arrêter.\n");
run("npx next start");
