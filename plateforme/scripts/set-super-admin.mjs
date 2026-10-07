// Donne (ou retire) la marque « super-administrateur » à un compte (ARCHITECTURE.md §3.2).
//
//   node scripts/set-super-admin.mjs vous@exemple.com            en local, sur les émulateurs
//   node scripts/set-super-admin.mjs vous@exemple.com --prod     sur le vrai projet (lit .env.production.local)
//   node scripts/set-super-admin.mjs vous@exemple.com --retirer
//
// Le compte doit déjà exister. Après la commande, déconnectez-vous puis
// reconnectez-vous : la marque est lue à la connexion.

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const args = process.argv.slice(2);
const email = args.find((value) => !value.startsWith("--"));
const production = args.includes("--prod");
const remove = args.includes("--retirer");
if (!email) {
  console.error("\nIndiquez l'adresse e-mail du compte :  node scripts/set-super-admin.mjs vous@exemple.com\n");
  process.exit(1);
}

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, production ? ".env.production.local" : ".env.development");
if (!existsSync(file)) {
  console.error(`\nLe fichier ${path.basename(file)} est introuvable.\n`);
  process.exit(1);
}
Object.assign(process.env, parseEnv(readFileSync(file, "utf8")));

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
if (production) {
  // Jamais les émulateurs par mégarde quand on vise le vrai projet.
  delete process.env.FIREBASE_AUTH_EMULATOR_HOST;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    console.error("\n.env.local doit contenir NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL et FIREBASE_PRIVATE_KEY.\n");
    process.exit(1);
  }
  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
} else {
  if (!projectId?.startsWith("demo-")) {
    console.error("\nEn local, le projet doit être un projet de démonstration (demo-…). Pour le vrai projet, ajoutez --prod.\n");
    process.exit(1);
  }
  initializeApp({ projectId });
}

try {
  const user = await getAuth().getUserByEmail(email);
  await getAuth().setCustomUserClaims(user.uid, { ...user.customClaims, superAdmin: !remove });
  console.log(
    `\n${email} ${remove ? "n'est plus" : "est maintenant"} super-administrateur (${production ? "vrai projet" : "émulateurs"}).\nDéconnectez-vous puis reconnectez-vous pour que cela prenne effet.\n`,
  );
} catch (error) {
  console.error(`\nImpossible : ${error?.message ?? error}\nLe compte existe-t-il ? En local, les émulateurs sont-ils lancés ?\n`);
  process.exit(1);
}
