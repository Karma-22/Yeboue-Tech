// Lance les émulateurs Firebase (comptes, base de données, stockage).
//
//   node scripts/emulators.mjs
//       Pour le développement : les émulateurs restent ouverts, et leurs
//       données sont gardées dans .emulator-data d'un lancement à l'autre.
//
//   node scripts/emulators.mjs --exec "<commande>"
//       Pour les tests : démarre des émulateurs vides, lance la commande,
//       puis referme tout.
//
// Les émulateurs ont besoin de Java. On prend celui de la machine s'il existe,
// sinon la copie portable rangée dans .tools/jre.

import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PROJECT = "demo-yeboue-tech";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const portableJavaBin = path.join(root, ".tools", "jre", "bin");
const dataDir = ".emulator-data";
const isWindows = process.platform === "win32";

const env = { ...process.env };
// Sous Windows la variable s'appelle « Path » : on retrouve son nom exact.
const pathKey = Object.keys(env).find((key) => key.toLowerCase() === "path") ?? "PATH";

function onPath(command) {
  const finder = isWindows ? "where" : "which";
  return spawnSync(finder, [command], { env, stdio: "ignore" }).status === 0;
}

if (!onPath("java") && existsSync(portableJavaBin)) {
  env[pathKey] = `${portableJavaBin}${path.delimiter}${env[pathKey] ?? ""}`;
}

if (!onPath("java")) {
  console.error(
    [
      "",
      "Java est introuvable : les émulateurs Firebase ne peuvent pas démarrer.",
      "Installez un JDK 21 ou plus récent, par exemple avec :",
      "  winget install EclipseAdoptium.Temurin.21.JDK",
      "puis rouvrez le terminal et relancez la commande.",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

if (!onPath("firebase")) {
  console.error(
    [
      "",
      "La commande « firebase » est introuvable.",
      "Installez-la avec :  npm install -g firebase-tools",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

const execIndex = process.argv.indexOf("--exec");
const execCommand = execIndex === -1 ? undefined : process.argv[execIndex + 1];
if (execIndex !== -1 && !execCommand) {
  console.error("Il manque la commande à lancer après --exec.");
  process.exit(1);
}

const command = execCommand
  ? ["firebase", "emulators:exec", "--project", PROJECT, `"${execCommand}"`]
  : ["firebase", "emulators:start", "--project", PROJECT, "--export-on-exit", dataDir];
if (!execCommand && existsSync(path.join(root, dataDir))) command.push("--import", dataDir);

// Sous Windows, « firebase » est un fichier .cmd : il ne se lance qu'à travers l'interpréteur de commandes.
const child = spawn(command.join(" "), { cwd: root, env, stdio: "inherit", shell: true });

// Ctrl+C arrive aussi aux émulateurs : on les laisse enregistrer leurs données avant de sortir.
process.on("SIGINT", () => {});
child.on("exit", (code) => process.exit(code ?? 0));
