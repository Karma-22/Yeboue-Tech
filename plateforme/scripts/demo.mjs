// Crée l'établissement de démonstration et ses deux comptes, en local.
//
//   npm run demo
//
// À lancer pendant que « npm run emulators » et « npm run dev » tournent. La
// commande peut être relancée : ce qui existe déjà est gardé tel quel.

import http from "node:http";

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Appelle le site sans limite de temps : sur une machine lente, la première
 * préparation d'une page peut prendre plusieurs minutes.
 */
function post(url) {
  return new Promise((resolve, reject) => {
    const request = http.request(url, { method: "POST" }, (response) => {
      let body = "";
      response.setEncoding("utf8");
      response.on("data", (chunk) => (body += chunk));
      response.on("end", () => resolve({ status: response.statusCode ?? 0, body }));
    });
    request.on("error", reject);
    request.end();
  });
}

console.log("\nCréation de l'établissement de démonstration…");
console.log("La première fois, le site prépare cette page : comptez quelques minutes sur une machine lente.\n");

let response;
try {
  response = await post(`${base}/api/dev/seed`);
} catch {
  console.error(`Le site ne répond pas à ${base}. Lancez d'abord « npm run dev », dans une autre fenêtre.\n`);
  process.exit(1);
}

if (response.status === 404) {
  console.error("Cette commande ne fonctionne qu'en local, avec les émulateurs Firebase.\n");
  process.exit(1);
}
if (response.status !== 200) {
  console.error(`La création a échoué (erreur ${response.status}). Les émulateurs sont-ils lancés ? (npm run emulators)\n`);
  process.exit(1);
}

const result = JSON.parse(response.body);
console.log(
  [
    result.message,
    "",
    `  Page du restaurant       ${base}${result.page}`,
    `  Depuis une table         ${base}${result.table ?? `${result.page}/t/3`}`,
    "",
    `  Compte du gérant         ${result.gerant}`,
    `  Compte administrateur    ${result.administrateur}`,
    `  Mot de passe (les deux)  ${result.motDePasse}`,
    "",
    `  Tableau de bord          ${base}/connexion`,
    `  Administration           ${base}/admin  (avec le compte administrateur)`,
    "",
  ].join("\n"),
);
