# Yéboué Tech — la plateforme

Le SaaS de menus par QR Code : site vitrine, tableau de bord des gérants, pages des établissements et administration, dans une seule application Next.js.

Le plan de construction est dans [../ARCHITECTURE.md](../ARCHITECTURE.md). Le code le suit ; toute divergence passe d'abord par une modification de ce document.

## Démarrer

Il faut Node.js 24 et la commande `firebase` (`npm install -g firebase-tools`).

```bash
npm install
npm run emulators   # terminal 1 : Firebase en local (comptes, base de données, photos)
npm run dev         # terminal 2 : le site, sur http://localhost:3000
```

En développement, tout tourne sur la machine : aucun compte Firebase, aucun coût, aucun risque pour de vraies données. Les réglages sont dans `.env.development`.

| Adresse | Contenu |
|---|---|
| http://localhost:3000 | Le site |
| http://localhost:3000/charte | La charte d'interface : couleurs, polices, logo, composants |
| http://localhost:4000 | La console des émulateurs : comptes créés, données enregistrées |

Les émulateurs ont besoin de Java. S'il n'est pas installé sur la machine, le script utilise la copie portable rangée dans `.tools/jre`.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Lance le site en développement |
| `npm run emulators` | Lance Firebase en local ; les données sont gardées dans `.emulator-data` |
| `npm test` | Lance les tests rapides |
| `npm run test:emulators` | Lance les tests qui parlent à Firebase : démarre des émulateurs vides, teste, referme (les arrêter d'abord s'ils tournent déjà) |
| `npm run lint` | Vérifie le code, dont les règles de rangement de l'architecture |
| `npm run typecheck` | Vérifie les types |
| `npm run build` | Construit la version de production |

## Où trouver quoi

| Dossier | Contenu |
|---|---|
| `src/app` | Les pages |
| `src/app/globals.css` | La charte d'interface : couleurs, rayons, ombres, styles de texte |
| `src/components/ui` | Les composants de base : bouton, champ, étiquette, fenêtre… |
| `src/components/brand` | Le logo |
| `src/config` | Les offres et leurs prix, les adresses réservées, les coordonnées |
| `src/lib/firebase` | La connexion à Firebase, côté navigateur et côté serveur |
| `firestore.rules`, `storage.rules` | Les règles de sécurité de Firebase |

Le code est écrit en anglais, l'interface en français (lexique à la fin d'ARCHITECTURE.md).

## Mise en ligne

Les variables à fournir à l'hébergeur sont décrites dans `.env.example`.
