# Yéboué Tech — règles du projet

Le plan de construction est `../ARCHITECTURE.md`. Le lire avant de coder, le suivre à la lettre, et le modifier **avant** le code quand une divergence s'impose. Les décisions et leurs raisons sont dans `../PROJET-SAAS.md`.

- **Langues** : code en anglais (fichiers, variables, collections), interface et commentaires en français.
- **Firestore** : seul `src/lib/db` lit et écrit la base. Toute écriture passe par le serveur ; le navigateur n'envoie jamais de prix.
- **Règles métier** dans `src/lib`, pas dans les pages : droits, état de l'abonnement, cycle de commande, totaux.
- **Composants** : ceux d'un espace (`marketing`, `dashboard`, `public`) ne s'importent pas dans un autre ; le commun vit dans `src/components/ui`.
- **Charte** : n'utiliser que les couleurs et styles de `src/app/globals.css`. La braise (`accent`) sert à l'action, jamais au petit texte (`accent-text` pour cela) ; le cyan (`signal`) est réservé au scan et au direct. Voir `/charte` en développement.
- **Téléphone d'abord** : cibles tactiles de 44 px au minimum, texte de 16 px dans les champs.
- **Prix et limites des offres** : uniquement dans `src/config/plans.ts`.
- **Nouvelle page à la racine du site** : ajouter son nom dans `src/config/reserved-slugs.ts` (un test le vérifie).
- Avant de rendre la main : `npm run lint`, `npm test`, `npm run build` ; et `npm run test:emulators` dès que Firebase ou ses règles de sécurité sont touchés.
- La machine de développement est lente (8 Go de RAM) : ne pas lancer en même temps le serveur, les émulateurs et les tests.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
