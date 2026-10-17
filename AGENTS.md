# Yéboué Tech — règles du projet

Le plan de construction est `../ARCHITECTURE.md`. Le lire avant de coder, le suivre à la lettre, et le modifier **avant** le code quand une divergence s'impose. Les décisions et leurs raisons sont dans `../PROJET-SAAS.md`.

- **Langues** : code en anglais (fichiers, variables, collections), interface et commentaires en français.
- **Firestore** : seul `src/lib/db` lit et écrit la base. Toute écriture passe par le serveur ; le navigateur n'envoie jamais de prix.
- **Règles métier** dans `src/lib`, pas dans les pages : droits, état de l'abonnement, cycle de commande, totaux.
- **Composants** : ceux d'un espace (`marketing`, `dashboard`, `public`) ne s'importent pas dans un autre ; le commun vit dans `src/components/ui`.
- **Charte** : n'utiliser que les couleurs et styles de `src/app/globals.css`. La braise (`accent`) sert à l'action, jamais au petit texte (`accent-text` pour cela) ; le cyan (`signal`) est réservé au scan et au direct. Voir `/charte` en développement.
- **Site vitrine en deux langues** : aucun texte en dur dans les composants de `src/components/marketing` ; tout va dans `src/i18n/dictionaries/fr.ts` et `en.ts`, qui doivent garder la même forme (un test le vérifie).
- **Mode sombre** : ne jamais supposer que la page est claire. Utiliser les jetons (`bg-surface`, `text-fg`…), `data-theme="dark"` pour un bloc sombre, `data-theme="contrast"` pour l'inverse de la page.
- **Téléphone d'abord** : cibles tactiles de 44 px au minimum, texte de 16 px dans les champs.
- **Prix et limites des offres** : uniquement dans `src/config/plans.ts`.
- **Nouvelle page à la racine du site** : ajouter son nom dans `src/config/reserved-slugs.ts` (un test le vérifie).
- **Modèles de page** : la feuille de route des quatre-vingts modèles est `../TEMPLATES.md`. Un modèle ne lit jamais la base : il reçoit `TemplateData` et dessine. Sa couleur vient des variables `--brand`, `--on-brand`, `--brand-text`, `--brand-text-dark`, `--brand-soft`, `--brand-deep`, `--brand-relief`, `--brand-alt`, `--brand-alt-2` (`src/lib/utils/color.ts`), jamais d'une couleur de marque en dur. Le panier, la fiche d'un article et la rangée des catégories sont communs (`src/components/public`). Après une retouche, refaire sa vignette dans `public/modeles`.
- **Un nouveau modèle** (n° 11 et suivants) tient dans son dossier `src/templates/<id>/` : `index.tsx` (le dessin), `style.ts` (sa feuille de style, envoyée avec lui par `TemplateStyle` : chaque règle commence par la classe du modèle, comme `.gbk-…`), `motion.tsx` (son animation, par `useTemplateMotion`). Sa police se télécharge avec `node scripts/font.mjs "Nom" 700` dans `public/fonts`. Il s'inscrit dans `src/config/templates.ts`, `src/templates/registry.ts`, `src/templates/showcases.ts` (sa maison d'aperçu) et les deux dictionnaires. Chaque modèle a sa mise en page, sa police et son animation à lui : ne pas décliner un modèle existant.
- **Ce qu'un modèle doit supporter** : logo ou non, couverture ou non, étiquette de table, lien de langue, articles avec et sans photo, sans prix (`note`), épuisés, noms longs, n'importe quelle couleur (claire ou sombre), téléphone et grand écran. `ItemTrigger` et `QuickAdd` sont voisins, jamais l'un dans l'autre.
- **Constantes et composants client** : une page du serveur ne peut pas lire une constante exportée par un fichier « use client » (elle reçoit une référence vide). Les textes et réglages partagés vivent dans un fichier à part, comme `src/components/public/shell-labels.ts`.
- **Après chaque modification d'un établissement** : vider le cache de sa page avec `updateTag(pageTag(slug))`, puis `refresh()` pour le tableau de bord. Les actions de `src/app/app/[estId]/actions.ts` le font par `publish()`.
- **Graphiques** : suivre le skill `dataviz` (couleur vérifiée par son script, survol, clavier, tableau des chiffres). Le composant existant est `src/components/dashboard/bar-chart.tsx`, sa couleur est le jeton `chart`.
- **Animations des pages d'établissement** : rien n'est caché par le CSS ; GSAP est chargé après l'affichage (`src/templates/kit/motion.tsx`), à partir d'attributs `data-reveal`, `data-parallax`, `data-draw` et du `setup` propre au modèle. Le haut de page s'anime en CSS (remplissage `backwards`, pour que GSAP puisse reprendre la main). Un élément qui attend son entrée est transparent, jamais `visibility: hidden` : il reste atteignable au clavier. Si la personne a demandé moins d'animations, rien ne bouge et tout est visible.
- Avant de rendre la main : `npm run lint`, `npm test`, `npm run build` ; et `npm run test:emulators` dès que Firebase ou ses règles de sécurité sont touchés.
- La machine de développement est lente (8 Go de RAM) : ne pas lancer en même temps le serveur, les émulateurs et les tests.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
