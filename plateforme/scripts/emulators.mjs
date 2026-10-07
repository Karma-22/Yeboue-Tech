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
/** Le port de la base de données : c'est elle qui met le plus de temps à démarrer. */
const FIRESTORE_PORT = 8080;
/** Le port du chef d'orchestre des émulateurs : s'il répond, les émulateurs tournent vraiment. */
const HUB_PORT = 4400;
const MAX_ATTEMPTS = 3;

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

/**
 * Sur une machine occupée, la base de données met parfois plus d'une minute à
 * démarrer : Firebase abandonne, mais elle, elle finit par s'ouvrir et garde le
 * port. On ferme cette base orpheline avant de réessayer. Windows seulement,
 * et seulement si c'est bien Java qui tient le port.
 */
function closeOrphan() {
  if (!isWindows) return;
  const connections = (spawnSync("netstat", ["-ano", "-p", "TCP"], { encoding: "utf8" }).stdout ?? "").split(/\r?\n/);
  const listening = (port) =>
    connections.find((entry) => entry.includes("LISTENING") && new RegExp(`:${port}\\s`).test(entry));
  // Si le chef d'orchestre des émulateurs répond, ils tournent pour de bon dans une autre fenêtre : on n'y touche pas.
  if (listening(HUB_PORT)) return;
  const pid = listening(FIRESTORE_PORT)?.trim().split(/\s+/).pop();
  if (!pid) return;
  const owner = spawnSync("tasklist", ["/FI", `PID eq ${pid}`, "/FO", "CSV", "/NH"], { encoding: "utf8" }).stdout ?? "";
  if (!/^"javaw?\.exe"/i.test(owner.trim())) return;
  spawnSync("taskkill", ["/PID", pid, "/F"], { stdio: "ignore" });
  console.log("Un émulateur d'un lancement précédent était resté ouvert : il a été fermé.");
}

let interrupted = false;
// Ctrl+C arrive aussi aux émulateurs : on les laisse enregistrer leurs données avant de sortir.
process.on("SIGINT", () => {
  interrupted = true;
});

function start(attempt) {
  closeOrphan();
  const command = execCommand
    ? ["firebase", "emulators:exec", "--project", PROJECT, `"${execCommand}"`]
    : ["firebase", "emulators:start", "--project", PROJECT, "--export-on-exit", dataDir];
  if (!execCommand && existsSync(path.join(root, dataDir))) command.push("--import", dataDir);

  const startedAt = Date.now();
  // Sous Windows, « firebase » est un fichier .cmd : il ne se lance qu'à travers l'interpréteur de commandes.
  const child = spawn(command.join(" "), { cwd: root, env, stdio: "inherit", shell: true });

  child.on("exit", (code) => {
    // Un arrêt dans les premières minutes, sans Ctrl+C : le démarrage a échoué, le plus souvent faute de temps.
    const failedToStart = code !== 0 && !interrupted && !execCommand && Date.now() - startedAt < 4 * 60 * 1000;
    if (failedToStart && attempt < MAX_ATTEMPTS) {
      console.log(
        `\nLes émulateurs n'ont pas démarré à temps : la machine est occupée. Nouvel essai (${attempt + 1} sur ${MAX_ATTEMPTS})…\n`,
      );
      start(attempt + 1);
      return;
    }
    if (failedToStart) {
      console.error(
        "\nLes émulateurs ne démarrent pas. Fermez ce qui occupe la machine (onglets du navigateur, autre terminal), puis relancez.\n",
      );
    }
    process.exit(code ?? 0);
  });
}

start(1);
