// Crée l'établissement de démonstration et ses deux comptes, en local.
//
//   npm run demo
//
// À lancer pendant que « npm run emulators » et « npm run dev » tournent. La
// commande peut être relancée : ce qui existe déjà est gardé tel quel.

const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

try {
  const response = await fetch(`${base}/api/dev/seed`, { method: "POST" });
  if (response.status === 404) {
    console.error("\nCette commande ne fonctionne qu'en local, avec les émulateurs Firebase.\n");
    process.exit(1);
  }
  if (!response.ok) {
    console.error(`\nLa création a échoué (erreur ${response.status}). Les émulateurs sont-ils lancés ? (npm run emulators)\n`);
    process.exit(1);
  }
  const result = await response.json();
  console.log(
    [
      "",
      result.message,
      "",
      `  Page du restaurant   ${base}${result.page}`,
      `  Depuis une table     ${base}${result.table ?? `${result.page}/t/3`}`,
      "",
      `  Compte du gérant     ${result.gerant}`,
      `  Compte administrateur  ${result.administrateur}`,
      `  Mot de passe (les deux)  ${result.motDePasse}`,
      "",
      `  Tableau de bord      ${base}/connexion`,
      `  Administration       ${base}/admin  (avec le compte administrateur)`,
      "",
    ].join("\n"),
  );
} catch {
  console.error(`\nLe site ne répond pas à ${base}. Lancez d'abord « npm run dev ».\n`);
  process.exit(1);
}
