// Télécharge une police de Google Fonts dans public/fonts, pour un modèle de page.
//
//   node scripts/font.mjs "Kanit" 800i 600i          deux graisses, en italique
//   node scripts/font.mjs "Yellowtail"               la graisse normale (400)
//   node scripts/font.mjs "Fraunces" var vari        la police variable, droite et italique
//
// Seule la tranche « latin » est gardée : elle couvre le français et l'anglais,
// et pèse quelques dizaines de kilo-octets. Les polices de Google Fonts sont
// libres (licence OFL ou Apache) : on peut les héberger soi-même.
// Chaque fichier ajouté est noté dans public/fonts/SOURCES.md.

import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [family, ...specs] = process.argv.slice(2);
if (!family) {
  console.error('\nIndiquez la police :  node scripts/font.mjs "Kanit" 800i 600i\n');
  process.exit(1);
}
const wanted = specs.length > 0 ? specs : ["400"];

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const directory = path.join(root, "public", "fonts");
mkdirSync(directory, { recursive: true });
const sources = path.join(directory, "SOURCES.md");
if (!existsSync(sources)) {
  writeFileSync(
    sources,
    "# Polices des modèles de page\n\nElles viennent de Google Fonts et sont libres (licences OFL ou Apache) : usage commercial permis, hébergement sur notre propre site permis. Seule la tranche « latin » de chaque police est gardée.\n\n| Fichier | Police | Source |\n|---|---|---|\n",
  );
}

const slug = family.toLowerCase().replace(/[^a-z0-9]+/g, "-");
// Un navigateur récent : c'est à lui que Google sert le format le plus léger (woff2).
const AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

for (const spec of wanted) {
  const italic = spec.endsWith("i");
  const variable = spec.startsWith("var");
  const weight = variable ? "100..900" : spec.replace(/i$/, "");
  const axis = `ital,wght@${italic ? 1 : 0},${weight}`;
  const query = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, "+")}:${axis}&display=swap`;

  let sheet = await fetch(query, { headers: { "User-Agent": AGENT } });
  // Toutes les polices variables n'ont pas la plage 100 à 900 : on demande alors celle qu'elles ont.
  if (!sheet.ok && variable) {
    for (const range of ["200..900", "300..900", "400..900", "100..800", "200..800", "300..800", "400..800", "300..700", "400..700"]) {
      sheet = await fetch(query.replace("100..900", range), { headers: { "User-Agent": AGENT } });
      if (sheet.ok) break;
    }
  }
  if (!sheet.ok) {
    console.error(`\n« ${family} » en ${spec} : Google Fonts répond ${sheet.status}. Le nom ou la graisse n'existe pas.\n`);
    process.exit(1);
  }

  const text = await sheet.text();
  // La plupart des polices sont servies par tranches d'alphabet ; quelques-unes en un seul fichier.
  const whole = text.includes("/* fallback */") || !/\/\* [a-z-]+ \*\//.test(text);
  const block = whole ? text : text.split("/* latin */")[1];
  const url = block?.match(/url\((https:[^)]+\.woff2)\)/)?.[1];
  const range = block?.match(/font-weight:\s*([^;]+);/)?.[1].trim() ?? weight;
  if (!url) {
    console.error(`\n« ${family} » en ${spec} : pas de tranche latine dans la réponse de Google Fonts.\n`);
    process.exitCode = 1;
    break;
  }

  const file = `${slug}-${variable ? "var" : weight}${italic ? "-italic" : ""}.woff2`;
  const bytes = Buffer.from(await (await fetch(url)).arrayBuffer());
  writeFileSync(path.join(directory, file), bytes);
  appendFileSync(sources, `| \`${file}\` | ${family}, ${italic ? "italique, " : ""}graisse ${range} | https://fonts.google.com/specimen/${encodeURIComponent(family).replace(/%20/g, "+")} |\n`);
  console.log(
    `${file}  ${Math.round(bytes.length / 1024)} Ko  →  { family: "${family}", file: "${file}"${range === "400" ? "" : `, weight: "${range}"`}${italic ? ', style: "italic"' : ""} }`,
  );
}
