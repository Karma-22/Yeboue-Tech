# Yéboué Tech — la plateforme

Le SaaS de menus par QR Code : site vitrine, tableau de bord des gérants, pages des établissements et administration, dans une seule application Next.js.

Le plan de construction est dans [../ARCHITECTURE.md](../ARCHITECTURE.md). Le code le suit ; toute divergence passe d'abord par une modification de ce document.

## Démarrer

Il faut Node.js 24 et la commande `firebase` (`npm install -g firebase-tools`).

```bash
npm install
npm run emulators   # terminal 1 : Firebase en local (comptes, base de données, photos)
npm run dev         # terminal 2 : le site, sur http://localhost:3000
npm run demo        # terminal 3, une seule fois : crée un restaurant de démonstration et deux comptes
```

En développement, tout tourne sur la machine : aucun compte Firebase, aucun coût, aucun risque pour de vraies données. Les réglages sont dans `.env.development`.

Sur une machine lente, attendre que les émulateurs affichent « All emulators ready » avant de lancer le site. Si la machine est trop occupée pour qu'ils démarrent, la commande réessaie d'elle-même, jusqu'à trois fois.

### Sur une machine lente : `npm run local`

Avec `npm run dev`, le site prépare chaque page à sa première ouverture : comptez une à deux minutes d'attente par page, puis plus rien. C'est le bon mode pour modifier le code.

Pour simplement **regarder le site ou le faire essayer**, lancer plutôt `npm run local` à la place de `npm run dev` : le site est construit une fois pour toutes (une dizaine de minutes), puis chaque page s'ouvre aussitôt. Les fois suivantes, `npm run local -- --lancer` le relance sans le reconstruire.

### Ce que crée `npm run demo`

| | |
|---|---|
| Le restaurant « Le Palmier » | http://localhost:3000/le-palmier — et, depuis une table, http://localhost:3000/le-palmier/t/3 |
| Le compte du gérant | `gerant@demo.test` |
| Le compte administrateur | `admin@demo.test` |
| Le mot de passe des deux | `demo-1234` |

Ces comptes n'existent que dans les émulateurs. Les chiffres de la page Statistiques du restaurant de démonstration sont inventés, pour que les graphiques aient quelque chose à montrer.

### Les adresses utiles

| Adresse | Contenu |
|---|---|
| http://localhost:3000 | Le site vitrine |
| http://localhost:3000/inscription | Créer un compte. En local, aucun e-mail ne part : le code à six chiffres s'affiche sur la page |
| http://localhost:3000/connexion | Se connecter, puis arriver sur le tableau de bord (`/app`) |
| http://localhost:3000/admin | L'administration, avec le compte administrateur |
| http://localhost:3000/apercu/braise | Un modèle de page ; les flèches du bandeau passent aux neuf autres, les pastilles changent la couleur |
| http://localhost:3000/charte | La charte d'interface : couleurs, polices, logo, composants |
| http://localhost:4000 | La console des émulateurs : comptes créés, données enregistrées |

Les émulateurs ont besoin de Java. S'il n'est pas installé sur la machine, le script utilise la copie portable rangée dans `.tools/jre`.

## Commandes

| Commande | Rôle |
|---|---|
| `npm run dev` | Lance le site en développement : chaque modification du code se voit tout de suite |
| `npm run local` | Construit le site puis le lance en mode rapide, sur les émulateurs. `-- --lancer` pour ne pas reconstruire |
| `npm run emulators` | Lance Firebase en local ; les données sont gardées dans `.emulator-data` quand on l'arrête avec Ctrl+C |
| `npm run demo` | Crée l'établissement de démonstration et ses comptes (émulateurs et site lancés) |
| `npm run admin -- vous@exemple.com` | Donne à un compte existant l'accès à l'administration. Ajouter `--prod` pour le vrai projet |
| `npm test` | Lance les tests rapides |
| `npm run test:emulators` | Lance les tests qui parlent à Firebase : démarre des émulateurs vides, teste, referme (les arrêter d'abord s'ils tournent déjà) |
| `npm run lint` | Vérifie le code, dont les règles de rangement de l'architecture |
| `npm run typecheck` | Vérifie les types |
| `npm run build` | Construit la version de production |

## Où trouver quoi

| Dossier | Contenu |
|---|---|
| `src/app` | Les pages : `(marketing)` et `en` (site vitrine), `(auth)` (comptes), `app` (tableau de bord), `admin`, `[slug]` (pages des établissements), `apercu` (modèles) |
| `src/app/globals.css` | La charte d'interface : couleurs, rayons, ombres, styles de texte, animations |
| `src/templates` | Les dix modèles de page, un fichier chacun, et les établissements d'exemple |
| `src/components/ui` | Les composants de base : bouton, champ, étiquette, fenêtre… |
| `src/components/public` | Ce que tous les modèles partagent : panier, fiche d'un article, suivi de commande |
| `src/components/dashboard`, `admin`, `marketing` | Les éléments propres à chaque espace |
| `src/config` | Les offres et leurs prix, les modèles, les adresses réservées, les coordonnées |
| `src/lib/db` | Le seul dossier qui lit et écrit la base de données |
| `src/lib/billing`, `auth`, `orders` | Les règles : état de l'abonnement, droits de chaque rôle, cycle d'une commande |
| `src/lib/email` | L'envoi des e-mails et leur gabarit provisoire |
| `firestore.rules`, `storage.rules` | Les règles de sécurité de Firebase |

Le code est écrit en anglais, l'interface en français (lexique à la fin d'ARCHITECTURE.md).

## Changer…

| Quoi | Où |
|---|---|
| Un prix, la durée de l'essai, le nombre d'accès d'une offre | `src/config/plans.ts` |
| Le numéro de téléphone et le WhatsApp de Yéboué Tech | `src/config/site.ts` |
| Un texte du site vitrine | `src/i18n/dictionaries/fr.ts` et `en.ts` |
| Les couleurs proposées aux gérants | `src/config/templates.ts` |
| Le dessin d'un modèle | `src/templates/{modèle}.tsx` |
| Le texte ou l'allure des e-mails | `src/lib/email/send.ts` |

## Mise en ligne

Les variables à fournir à l'hébergeur sont décrites dans `.env.example`. Avant d'imprimer le moindre QR Code, il faut le vrai nom de domaine dans `NEXT_PUBLIC_SITE_URL` : cette adresse est dessinée dans chaque QR Code, et ne doit plus jamais changer.

Une fois le site en ligne et votre compte créé : `npm run admin -- votre@adresse --prod` vous ouvre l'administration.
