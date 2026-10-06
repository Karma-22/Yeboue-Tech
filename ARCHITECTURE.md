# Yéboué Tech — architecture complète

Ce document est le plan de construction. Le code doit le respecter ; toute divergence passe d'abord par une modification de ce fichier.
Le pourquoi des choix est dans [PROJET-SAAS.md](PROJET-SAAS.md), les explications dans [REPONSES.md](REPONSES.md).

Le code vit dans le dossier [plateforme/](plateforme/). L'ancien site (`index.html`, `css/`, `js/`) reste à la racine comme référence pour l'animation du téléphone.

**Avancement : voir le tableau de la section 16.**

Convention : **le code est écrit en anglais** (noms de fichiers, de variables, de collections), **l'interface est en français**. Un lexique figure en fin de document.

---

## 1. Vue d'ensemble

```
                         ┌─────────────────────────────────────┐
                         │      Une seule application Next.js   │
                         │                                     │
 Visiteur ──────────────▶│  Site vitrine          /            │
 Gérant et équipe ──────▶│  Tableau de bord       /app/...     │
 Client du restaurant ──▶│  Page d'établissement  /{slug}      │
 Toi (Yéboué Tech) ─────▶│  Administration        /admin/...   │
                         └───────────────┬─────────────────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
          Firebase Auth             Firestore             Firebase Storage
            (comptes)          (toutes les données)          (photos)
```

Une seule base de code, un seul hébergement, une seule base de données. Chaque établissement est un ensemble de documents dans Firestore, jamais un site séparé.

---

## 2. Les cinq types de personnes

| Qui | Compte ? | Ce qu'il peut faire |
|---|---|---|
| **Visiteur** | Non | Lire le site vitrine, voir la démonstration, s'inscrire |
| **Client du restaurant** | Non | Voir une page d'établissement, commander, suivre sa commande, laisser un avis |
| **Propriétaire** | Oui | Tout sur ses établissements, y compris l'abonnement et l'équipe |
| **Membre de l'équipe** | Oui | Selon son rôle : gérant, serveur ou cuisine |
| **Super-administrateur** (toi) | Oui | Tout, sur tous les établissements |

### Rôles dans un établissement

| Action | Propriétaire | Gérant | Serveur | Cuisine |
|---|:-:|:-:|:-:|:-:|
| Voir et traiter les commandes | ✓ | ✓ | ✓ | ✓ |
| Marquer un plat en rupture | ✓ | ✓ | ✓ | ✓ |
| Modifier le menu | ✓ | ✓ | | |
| Modifier la page (modèle, couleur, horaires) | ✓ | ✓ | | |
| Gérer les tables et les QR | ✓ | ✓ | | |
| Voir les statistiques | ✓ | ✓ | | |
| Inviter ou retirer un membre | ✓ | | | |
| Payer, changer d'offre | ✓ | | | |
| Supprimer l'établissement | ✓ | | | |

Un compte peut appartenir à plusieurs établissements, avec un rôle différent dans chacun.

---

## 3. Les comptes

### 3.1 Le compte personnel
Un compte représente **une personne**, pas un restaurant.

- Connexion : **e-mail + mot de passe**, ou **Google**.
- Le numéro de téléphone est demandé à l'inscription comme simple information (pour WhatsApp), sans vérification par SMS : la vérification par SMS est payante chez Firebase. Elle pourra être ajoutée plus tard.
- Contenu du profil : prénom, nom, téléphone, e-mail, photo facultative, langue.
- Pages : inscription, vérification de l'e-mail, connexion, mot de passe oublié, profil, changement de mot de passe, suppression du compte.

### 3.1 bis La vérification de l'e-mail par code
Après l'inscription par e-mail, le compte n'est utilisable qu'une fois l'adresse confirmée par un **code à 6 chiffres**.

1. Le serveur tire un code au hasard, en enregistre **l'empreinte** (jamais le code lui-même) dans `emailCodes/{userId}`, avec une validité de 10 minutes.
2. Il envoie le code par e-mail, dans un message HTML aux couleurs de la marque.
3. Le gérant arrive sur `/verification` et saisit le code dans six cases.
4. Le serveur compare. Code juste : l'adresse est marquée comme vérifiée, le code est supprimé, le gérant passe à la création de son établissement. Code faux : message d'erreur, et blocage après 5 essais.
5. Un bouton « Renvoyer le code » est disponible après 60 secondes, avec un nombre limité d'envois par heure.

Firebase ne sait envoyer qu'un lien de vérification, pas un code : le code et l'e-mail sont donc gérés par notre serveur, avec un service d'envoi d'e-mails (Resend ou équivalent, **à choisir à l'étape 1a**). Ce service exige un nom de domaine vérifié pour écrire à de vrais destinataires ; en développement, le code est simplement affiché dans la console.

Une inscription par Google saute cette étape : Google a déjà vérifié l'adresse.

**La page `/verification`** est soignée :
- six cases ; le curseur avance seul, la touche Retour recule, un code collé remplit tout d'un coup ;
- chaque chiffre saisi anime sa case ;
- code faux : les cases tremblent et se vident ;
- code juste : les cases se valident l'une après l'autre, puis le symbole de la marque s'anime avant la redirection ;
- le clavier numérique s'ouvre directement sur téléphone, et le code reçu est proposé en saisie automatique quand le téléphone le permet.

**L'e-mail** : un modèle HTML provisoire aux couleurs de la charte est construit à l'étape 1a. Il sera remplacé par la maquette définitive que tu fourniras une fois le site terminé. Tous les e-mails de la plateforme (code, invitation, rappel d'échéance) partagent le même gabarit.

### 3.2 Le compte super-administrateur
- C'est un compte personnel ordinaire qui porte une marque spéciale (`superAdmin`) posée **à la main, par un script**, jamais depuis l'interface.
- Cette marque est inscrite dans le jeton de connexion (« custom claim » Firebase) et vérifiée côté serveur à chaque requête vers `/admin`.
- Aucune page ne permet de se l'attribuer.

### 3.3 La session
1. Le navigateur se connecte auprès de Firebase Auth et reçoit un jeton.
2. Il l'envoie au serveur, qui crée un **cookie de session** sécurisé (`httpOnly`), valable 14 jours.
3. À chaque page de `/app` et `/admin`, le serveur lit ce cookie et vérifie l'identité **et** les droits.
4. Sans cookie valide : redirection vers la connexion.

---

## 4. Carte des adresses

### Site vitrine (public)
| Adresse | Contenu |
|---|---|
| `/` | Accueil, animation du téléphone |
| `/solutions/{type}` | Une page par type d'établissement, avec son propre « comment ça marche » : `restaurants`, `maquis`, `bars-lounges`, `hotels`, `residences` |
| `/en`, `/en/solutions/{type}` | Les mêmes pages en anglais |
| `/tarifs` | Offres |
| `/fonctionnement` | Comment ça marche |
| `/demo` | Lien vers l'établissement de démonstration |
| `/contact` | Formulaire, WhatsApp |
| `/mentions-legales`, `/confidentialite`, `/cgv` | Pages légales |

L'en-tête propose le changement de langue, le mode clair ou sombre, et un menu qui monte du bas de l'écran sur téléphone.

Pour l'instant, la page d'accueil réunit tout : ses sections se rejoignent par les ancres `#pour-qui`, `#fonctionnement`, `#tarifs` et `#questions`. Les pages séparées viennent à l'étape 2b.

### Comptes
| Adresse | Contenu |
|---|---|
| `/inscription` | Création du compte |
| `/verification` | Saisie du code à 6 chiffres reçu par e-mail |
| `/connexion` | Connexion |
| `/mot-de-passe-oublie` | Réinitialisation |
| `/invitation/{code}` | Accepter une invitation dans une équipe |

### Tableau de bord (connexion obligatoire)
| Adresse | Contenu |
|---|---|
| `/app` | Liste de mes établissements, ou redirection s'il n'y en a qu'un |
| `/app/nouveau` | Création guidée d'un établissement |
| `/app/compte` | Mon profil |
| `/app/{id}` | Accueil : état de l'abonnement, chiffres du jour, raccourcis |
| `/app/{id}/menu` | Catégories et articles |
| `/app/{id}/commandes` | Écran de commandes en direct |
| `/app/{id}/tables` | Zones, tables, QR Codes |
| `/app/{id}/apparence` | Modèle, couleur, logo, couverture |
| `/app/{id}/informations` | Nom, adresse, horaires, contacts |
| `/app/{id}/statistiques` | Chiffres |
| `/app/{id}/equipe` | Membres et invitations |
| `/app/{id}/abonnement` | Offre, échéance, historique des paiements |

### Administration (super-administrateur)
| Adresse | Contenu |
|---|---|
| `/admin` | Vue d'ensemble : inscrits, essais en cours, échéances proches, revenus |
| `/admin/etablissements` | Liste, recherche, filtres |
| `/admin/etablissements/{id}` | Fiche : activer une période, changer d'offre, suspendre, ouvrir le tableau de bord du gérant |
| `/admin/paiements` | Enregistrer et consulter les paiements |
| `/admin/comptes` | Comptes utilisateurs |
| `/admin/journal` | Historique de toutes les actions d'administration |

### Pages d'établissement (public)
| Adresse | Contenu |
|---|---|
| `/{slug}` | Page de l'établissement |
| `/{slug}/t/{numero}` | La même, rattachée à une table |
| `/{slug}/commande/{id}` | Suivi d'une commande |

### Page interne
| Adresse | Contenu |
|---|---|
| `/charte` | La charte d'interface : couleurs, polices, logo, composants. Visible en développement seulement. |

**Adresses réservées.** Un établissement ne peut pas choisir un identifiant qui existe déjà comme page : `app`, `admin`, `api`, `tarifs`, `connexion`, `inscription`, `demo`, `contact`, etc. La liste est tenue dans un seul fichier et vérifiée à la création. Un test s'assure que chaque dossier de page de `src/app` y figure.

---

## 5. Les données (Firestore)

```
users/{userId}
establishments/{estId}
    members/{userId}
    categories/{categoryId}
    items/{itemId}
    zones/{zoneId}
    tables/{tableId}
    orders/{orderId}
    reviews/{reviewId}
    stats/{yyyy-mm-dd}
slugs/{slug}
invitations/{code}
emailCodes/{userId}
payments/{paymentId}
adminLogs/{logId}
```

### `emailCodes/{userId}`
`codeHash`, `expiresAt`, `attempts`, `lastSentAt`, `sentCount`. Supprimé dès que le code est validé.

### `users/{userId}`
| Champ | Rôle |
|---|---|
| `firstName`, `lastName`, `phone`, `email`, `photoUrl` | Profil |
| `locale` | Langue de l'interface |
| `establishmentIds` | Liste des établissements dont il est membre (pour un affichage rapide) |
| `createdAt` | Date de création |

### `establishments/{estId}`
| Champ | Rôle |
|---|---|
| `name`, `slug`, `type` | Nom, identifiant d'adresse, type (`restaurant`, `maquis`, `bar`, `hotel`, `residence`) |
| `ownerId` | Propriétaire |
| `description`, `address`, `district`, `city` | Présentation |
| `phone`, `whatsapp` | Contacts |
| `hours` | Horaires par jour |
| `logoUrl`, `coverUrl` | Images |
| `template`, `accentColor` | Modèle et couleur |
| `languages` | Langues actives (`fr`, `en`) |
| `published` | Page en ligne ou non |
| `subscription` | Voir section 8 |
| `createdAt`, `updatedAt` | Dates |

### `members/{userId}`
`role` (`owner`, `manager`, `waiter`, `kitchen`), `addedAt`, `addedBy`.

### `categories/{categoryId}`
`name` (`{fr, en}`), `position`, `visible`.

### `items/{itemId}`
| Champ | Rôle |
|---|---|
| `categoryId` | Catégorie |
| `name`, `description` | Textes, par langue |
| `price` | Prix en FCFA, nombre entier |
| `photo` | Deux adresses : vignette et grande image |
| `available` | Faux = en rupture |
| `position` | Ordre d'affichage |
| `tags` | Par exemple « épicé », « végétarien » |
| `schedule` | Facultatif : jours et heures d'affichage (plat du jour, promotion) |

### `zones/{zoneId}` et `tables/{tableId}`
Zone : `name`, `position`. Table : `zoneId`, `number`, `label`. Pour un hôtel, la « table » est une chambre.

### `orders/{orderId}`
| Champ | Rôle |
|---|---|
| `tableId`, `tableLabel` | Origine |
| `lines` | Liste : article, nom **copié**, prix **copié**, quantité, remarque |
| `total` | Calculé par le serveur |
| `status` | Voir section 9 |
| `note` | Remarque du client |
| `createdAt`, `acceptedAt`, `readyAt`, `servedAt` | Horodatages |

Le nom et le prix sont copiés dans la commande : si le gérant change un prix le lendemain, les anciennes commandes restent exactes.

### `stats/{yyyy-mm-dd}`
Un document par jour : `scans`, `orders`, `revenue`, `scansByHour`, `scansByTable`, `itemViews`, `itemOrders`. Mis à jour par incrément, jamais recalculé.

### `slugs/{slug}`
`establishmentId`. Sert à garantir qu'un identifiant n'est attribué qu'une fois et à retrouver l'établissement depuis l'adresse. Quand un établissement change d'identifiant, l'ancien reste en place avec un champ `redirectTo`.

### `invitations/{code}`
`establishmentId`, `role`, `email`, `expiresAt`, `usedAt`.

### `payments/{paymentId}`
`establishmentId`, `amount`, `plan`, `months`, `method` (`wave`, `orange`, `mtn`, `moov`, `cash`, `geniuspay`), `reference`, `recordedBy`, `createdAt`.

### `adminLogs/{logId}`
`adminId`, `action`, `targetId`, `details`, `createdAt`.

---

## 6. Les parcours, étape par étape

### 6.1 Inscription et mise en ligne
1. `/inscription` : prénom, nom, téléphone, e-mail, mot de passe (ou Google).
2. Création du compte Firebase Auth, du document `users`, du cookie de session.
3. Envoi du code, puis `/verification` (voir 3.1 bis). Tant que l'adresse n'est pas vérifiée, toute page de `/app` renvoie ici.
4. Redirection vers `/app/nouveau`, un assistant en quatre écrans :
   1. **L'établissement** : nom, type, quartier, WhatsApp. L'identifiant d'adresse est proposé automatiquement et sa disponibilité vérifiée en direct.
   2. **L'apparence** : modèle, couleur, logo, couverture.
   3. **Le menu** : une première catégorie et quelques plats. Un bouton propose de partir d'un menu d'exemple à modifier.
   4. **La publication** : aperçu, puis « Mettre en ligne ».
5. À la validation, **en une seule opération indivisible** : création de l'établissement, du membre `owner`, de la réservation dans `slugs`, et démarrage de l'essai (14 jours, offre complète).
6. Arrivée sur `/app/{id}` avec le QR prêt à télécharger.

L'assistant enregistre à chaque écran : si le gérant ferme la page, il reprend où il s'était arrêté.

### 6.2 Modifier le menu
1. Le gérant modifie un article dans `/app/{id}/menu`.
2. Le serveur vérifie son rôle, valide les données, enregistre.
3. Le serveur **vide le cache** de la page de cet établissement.
4. Au scan suivant, la page est reconstruite avec les nouvelles données.

La rupture de stock suit le même chemin, avec un bouton accessible en un geste.

### 6.3 Ajouter une photo
1. Le gérant choisit une photo sur son téléphone.
2. Le navigateur la **réduit et la convertit** en deux fichiers WebP : une vignette (400 px) et une grande (1 200 px).
3. Les deux sont envoyés dans Firebase Storage, sous `establishments/{estId}/items/{itemId}/`.
4. Leurs adresses sont enregistrées dans l'article.

La réduction côté navigateur évite d'envoyer 5 Mo sur une connexion lente et dispense de tout traitement payant côté serveur.

### 6.4 Tables et QR Codes
1. Dans `/app/{id}/tables`, le gérant crée des zones et indique un nombre de tables par zone.
2. La plateforme crée les documents `tables`.
3. Les QR ne sont **pas stockés** : ils sont dessinés à la demande à partir de l'adresse.
4. Téléchargements proposés : QR général (SVG, PNG), affiche A5 avec logo, planche PDF de toutes les tables avec étiquettes.

### 6.5 Le client consulte et commande
1. Scan de `/{slug}/t/12`.
2. Le serveur trouve l'établissement par `slugs`, vérifie qu'il est publié et que son abonnement le permet, et renvoie la page depuis le cache.
3. Un court signal part vers le serveur pour compter le scan (table, heure).
4. Le client remplit son panier ; celui-ci vit dans son navigateur.
5. À la validation, le navigateur envoie **uniquement les identifiants des articles et les quantités**.
6. Le serveur relit les prix dans la base, vérifie la disponibilité, calcule le total, crée la commande, met à jour les statistiques.
7. Le client est envoyé sur `/{slug}/commande/{id}` et voit l'état évoluer en direct.

**Le navigateur n'envoie jamais de prix** : il pourrait les falsifier.

### 6.6 Le personnel traite la commande
1. `/app/{id}/commandes` écoute en direct les commandes du jour.
2. Nouvelle commande : carte en tête de liste et sonnerie. Un bouton « Activer le son » est affiché à l'ouverture, car les navigateurs interdisent le son sans geste préalable.
3. Le personnel fait avancer la commande d'un geste.
4. Chaque changement est horodaté.

### 6.7 Commande à emporter par WhatsApp
Aucune commande n'est enregistrée. Le panier est transformé en texte, et le client est envoyé vers `wa.me/{numéro}` avec le message prérempli. Seul un compteur de statistiques est incrémenté.

### 6.8 Inviter un membre de l'équipe
1. Le propriétaire saisit un e-mail et un rôle dans `/app/{id}/equipe`.
2. Création d'une invitation valable 7 jours ; le lien `/invitation/{code}` est à partager par WhatsApp ou par e-mail.
3. L'invité crée son compte ou se connecte, puis rejoint l'équipe.

### 6.9 Payer et renouveler (phase manuelle)
1. `/app/{id}/abonnement` affiche l'offre, l'échéance, les prix et les instructions : numéro Wave / Orange Money et référence à indiquer.
2. Le gérant paie et touche « J'ai payé », ce qui t'alerte.
3. Dans `/admin/paiements`, tu enregistres le paiement : établissement, offre, durée, montant, référence.
4. Le serveur prolonge la période, crée le document `payments` et une ligne dans `adminLogs`.

### 6.10 Ton travail quotidien dans l'administration
- Voir les essais qui se terminent et les abonnements qui expirent dans les 5 jours, avec un bouton qui ouvre WhatsApp sur un message de rappel prérempli.
- Enregistrer les paiements.
- Suspendre ou réactiver un établissement.
- Ouvrir le tableau de bord d'un gérant pour l'aider, chaque ouverture étant inscrite au journal.

---

## 7. Les offres

Les offres sont décrites dans **un seul fichier de configuration**. Changer un prix ou une limite ne demande de toucher à rien d'autre.

| | Menu | Menu + Commande |
|---|:-:|:-:|
| Prix par mois | 10 000 F | 25 000 F |
| Page, modèle, couleur | ✓ | ✓ |
| Articles et photos illimités | ✓ | ✓ |
| QR général | ✓ | ✓ |
| Commande à emporter par WhatsApp | ✓ | ✓ |
| Statistiques de scans | ✓ | ✓ |
| QR par table | | ✓ |
| Commande sur place et écran de commandes | | ✓ |
| Avis et fidélité | | ✓ |
| Statistiques de ventes | | ✓ |
| Membres de l'équipe | 2 | 10 |

Durées : 1, 3, 6 ou 12 mois, avec remise croissante **(taux à fixer)**.

Partout dans le code, une seule fonction répond à la question « cet établissement a-t-il droit à cette fonction ? ». Aucune page ne teste elle-même le nom de l'offre.

---

## 8. Le cycle de l'abonnement

Champ `subscription` de l'établissement : `plan`, `trialEndsAt`, `periodEndsAt`, `suspended`.

L'état n'est **pas stocké** : il est calculé à partir des dates à chaque lecture. Aucune tâche programmée n'est donc nécessaire, et l'état ne peut pas être faux.

```
 Inscription
     │
     ▼
 ┌────────┐  paiement   ┌────────┐
 │ ESSAI  │────────────▶│ ACTIF  │◀──────────────┐
 │ 14 j   │             └───┬────┘               │
 └───┬────┘                 │ échéance dépassée  │ paiement
     │ fin de l'essai       ▼                    │
     │                  ┌────────┐               │
     └─────────────────▶│ GRÂCE  │───────────────┤
                        │  5 j   │               │
                        └───┬────┘               │
                            ▼                    │
                        ┌────────┐               │
                        │ LIMITÉ │───────────────┤
                        │  30 j  │               │
                        └───┬────┘               │
                            ▼                    │
                        ┌────────────┐           │
                        │ HORS LIGNE │───────────┘
                        └────────────┘
```

| État | Page de l'établissement | Tableau de bord |
|---|---|---|
| **Essai** | Complète | Complet, avec le nombre de jours restants |
| **Actif** | Selon l'offre | Selon l'offre |
| **Grâce** | Inchangée | Bandeau « Abonnement expiré, renouvelez » |
| **Limité** | Menu visible, commande désactivée | Lecture seule, sauf la page Abonnement |
| **Hors ligne** | Message « Menu momentanément indisponible » | Lecture seule, sauf la page Abonnement |
| **Suspendu** (décision manuelle) | Comme hors ligne | Message invitant à te contacter |

Les données ne sont jamais supprimées automatiquement. Un paiement remet tout en marche immédiatement.

---

## 9. Le cycle d'une commande

```
 NOUVELLE ──▶ ACCEPTÉE ──▶ PRÊTE ──▶ SERVIE
     │            │
     ▼            ▼
  REFUSÉE      ANNULÉE
```

| État (`status`) | Qui le déclenche | Ce que voit le client |
|---|---|---|
| `new` | Le client valide | « Commande envoyée » |
| `accepted` | Le personnel | « En préparation » |
| `ready` | Le personnel | « Prête » |
| `served` | Le personnel | « Bon appétit » |
| `rejected` | Le personnel, avec un motif | « Commande refusée » et le motif |
| `cancelled` | Le personnel | « Commande annulée » |

On n'avance que dans le sens des flèches ; le serveur refuse tout autre changement.

---

## 10. Les modèles de page

- Chaque modèle est un composant React rangé dans un dossier, inscrit dans un registre.
- **Tous reçoivent exactement les mêmes données** (établissement, catégories, articles, table). Un modèle ne lit jamais la base lui-même.
- La couleur choisie est transmise comme variable CSS ; le modèle en déduit ses teintes.
- Le panier, la fiche d'un article et le suivi de commande sont des éléments **communs** à tous les modèles : on ne les réécrit pas six fois.
- Ajouter un modèle = ajouter un dossier et une ligne dans le registre.

---

## 11. Rapidité et coût

| Mécanisme | Effet |
|---|---|
| Page d'établissement rendue par le serveur et **mise en cache par établissement** | Mille scans ne coûtent qu'une lecture de la base |
| Cache vidé à chaque modification du menu | Le client voit toujours la bonne version |
| Photos en WebP, deux tailles, chargées quand elles approchent de l'écran | Page utilisable en 3G |
| Aucune animation lourde sur la page d'établissement | GSAP n'est chargé que sur le site vitrine |
| Statistiques par incrément dans un document par jour | Lecture des chiffres en une seule requête |
| Écoute en direct limitée aux commandes du jour | Peu de lectures |
| Alerte de budget Firebase | Aucune mauvaise surprise |

Objectif : moins de 150 Ko hors photos pour la page d'établissement.

---

## 12. Sécurité

### Principe
**Toute écriture passe par le serveur.** Le navigateur ne modifie jamais Firestore directement, à une exception près : l'envoi des photos vers Storage.

### Règles Firestore
| Donnée | Lecture directe par le navigateur | Écriture directe |
|---|---|---|
| `orders` d'un établissement | Membres de cet établissement | Interdite |
| Une commande précise, par son identifiant | Tout le monde (l'identifiant est impossible à deviner) | Interdite |
| Tout le reste | Interdite | Interdite |

Le navigateur n'a besoin d'un accès direct que pour le temps réel des commandes. Tout le reste est lu et écrit par le serveur, qui contrôle les droits.

### Règles Storage
Envoi autorisé seulement aux membres `owner` ou `manager` de l'établissement, uniquement pour des images, avec une taille maximale.

### Contrôles côté serveur, à chaque action
1. La session est-elle valide ?
2. Cette personne est-elle membre de cet établissement ?
3. Son rôle autorise-t-il cette action ?
4. L'offre de l'établissement inclut-elle cette fonction ?
5. Les données reçues sont-elles valides (schémas Zod) ?

### Protection des points ouverts au public
- Création de commande et comptage des scans : limitation du nombre de requêtes par appareil.
- Création de commande : refusée si l'établissement n'a pas l'offre requise, si un article est indisponible ou si le panier est anormalement gros.

### Divers
- Les clés secrètes ne sont jamais envoyées au navigateur.
- Toute action d'administration est inscrite dans `adminLogs`.
- Les mots de passe sont gérés par Firebase Auth, jamais par nous.

---

## 13. Le paiement, prévu pour changer

Tout le paiement passe par un seul module avec deux fonctions : **demander un paiement** et **confirmer un paiement**.

| Phase | Fonctionnement |
|---|---|
| **Maintenant : manuel** | « Demander » affiche les instructions Wave / Orange Money. « Confirmer » est déclenché par toi dans l'administration. |
| **Plus tard : GeniusPay** | « Demander » ouvre la page de paiement GeniusPay. « Confirmer » est déclenché par leur notification automatique, reçue sur `/api/payments/webhook` et vérifiée par signature. |

Dans les deux cas, la suite est identique : création du document `payments` et prolongation de la période. Le reste de l'application ne sait pas quel fournisseur est utilisé.

---

## 14. Organisation du code

```
src/
  app/
    (marketing)/            site vitrine, en français
    en/                     site vitrine, en anglais (mêmes composants, autres textes)
    (auth)/                 inscription, connexion, invitation
    app/                    tableau de bord
      [estId]/
        menu/  commandes/  tables/  apparence/
        informations/  statistiques/  equipe/  abonnement/
    admin/                  administration
    [slug]/                 page d'établissement
      t/[number]/
      commande/[orderId]/
    api/
      orders/               création de commande
      scan/                 comptage des scans
      qr/                   QR en SVG et planches PDF
      payments/webhook/     notifications de paiement (plus tard)
    charte/                 charte d'interface (développement seulement)
    globals.css             la charte : couleurs, rayons, ombres, styles de texte
  assets/
    photos/                 photos d'illustration du site vitrine, et SOURCES.md qui note d'où elles viennent
  components/
    brand/                  le logo, le cadre de visée
    ui/                     boutons, champs, fenêtres (base Radix, restylée)
    marketing/              sections du site vitrine, téléphone dessiné et son animation (GSAP)
    dashboard/              éléments du tableau de bord
    public/                 panier, fiche article, suivi de commande
  templates/                modèles de page + registre
  i18n/                     les langues du site vitrine : textes français et anglais, adresses par langue
  lib/
    firebase/               connexion à Firebase (navigateur et serveur)
    db/                     SEUL endroit qui lit et écrit Firestore
    auth/                   session, droits, rôles, codes de vérification
    email/                  envoi des e-mails et gabarit HTML commun
    billing/                offres, état de l'abonnement, module de paiement
    orders/                 règles du cycle de commande
    qr/                     dessin des QR et des planches
    images/                 réduction et conversion des photos
    validation/             schémas Zod
    utils/                  petits outils : classes CSS, écriture des prix
  config/
    plans.ts                offres, prix, limites
    reserved-slugs.ts       adresses réservées
    site.ts                 nom, domaine, contacts
scripts/
  emulators.mjs             lance Firebase en local
  set-super-admin.ts        attribue la marque super-administrateur
  seed-demo.ts              crée l'établissement de démonstration
firestore.rules
storage.rules
```

### Langues et thèmes
- **Deux langues pour le site vitrine** : le français à la racine, l'anglais sous `/en`. Tous les textes sont dans `src/i18n/dictionaries` ; un test vérifie que les deux langues ont exactement la même forme. Le tableau de bord et l'administration restent en français pour l'instant.
- **Mode clair et mode sombre** : la page est claire par défaut ; le bouton de l'en-tête pose `data-theme="dark"` sur la page et le navigateur retient le choix. Toutes les couleurs passent par les jetons de `globals.css`, donc chaque composant suit sans rien faire.

Trois règles de rangement :
1. **Seul `lib/db` parle à Firestore.** Aucune page, aucun composant.
2. **Les règles métier vivent dans `lib`**, pas dans les pages : état de l'abonnement, droits, transitions de commande, calcul des totaux.
3. **Les composants d'un espace ne sont pas importés dans un autre**, sauf ceux de `components/ui`.

---

## 15. Environnements et qualité

| Environnement | Base de données | Usage |
|---|---|---|
| **Local** | Émulateur Firebase, sur l'ordinateur | Développement, sans coût et sans risque |
| **Production** | Projet Firebase réel | Les vrais établissements |

En local, le projet s'appelle `demo-yeboue-tech` : un identifiant qui commence par `demo-` n'existe pas chez Google et ne peut tourner que sur les émulateurs. Dans l'autre sens, l'application **refuse de démarrer** si on lui demande d'utiliser les émulateurs avec un vrai projet, car ils acceptent n'importe quel jeton de connexion.

- **Tests automatiques** sur les règles qui touchent à l'argent et aux droits : état de l'abonnement, droits par rôle, transitions de commande, calcul des totaux, règles de sécurité Firestore.
- Deux commandes : `npm test` pour les tests rapides, `npm run test:emulators` pour ceux qui ont besoin de Firebase (elle démarre des émulateurs vides, teste, puis les referme).
- **Tests de parcours** sur trois chemins : inscription jusqu'à la mise en ligne, commande d'un client jusqu'à « servie », enregistrement d'un paiement.
- Accessibilité : navigation au clavier, contrastes suffisants, respect du réglage « réduire les animations ».

---

## 16. Ordre de construction

| Étape | Ce qui est construit | Sections concernées |
|---|---|---|
| **0** | Projet, Firebase et émulateur, charte, polices, logo, composants de base | 14, 15 |
| **2a** | Page d'accueil du site vitrine : photos, vidéo, animation du téléphone, tarifs, questions | 4 |
| **1a** | Comptes : inscription, vérification par code, e-mail HTML provisoire, connexion, session, profil | 3 |
| **1b** | Création guidée d'un établissement, identifiant d'adresse | 5, 6.1 |
| **1c** | Éditeur de menu, photos | 6.2, 6.3 |
| **1d** | Page d'établissement, trois modèles, cache | 10, 11 |
| **1e** | QR général à télécharger | 6.4 |
| **2b** | Reste du site vitrine : pages Tarifs, Fonctionnement, Contact, pages légales, établissement de démonstration | 4 |
| **3** | Administration, abonnements, paiements manuels, fin d'essai | 6.9, 6.10, 7, 8 |
| **4** | Tables, QR par table, panier, commande, écran de commandes, WhatsApp | 6.4 à 6.7, 9 |
| **5** | Équipe et rôles, avis, fidélité, statistiques | 2, 6.8 |
| **6** | Hôtel, modèles supplémentaires, GeniusPay, supports imprimés | 13 |

Chaque étape se termine par une version qui fonctionne et que tu peux essayer.

La page d'accueil (2a) passe avant les comptes, à ta demande du 5 octobre 2026 : on fixe d'abord à quoi le site ressemble. Tant que l'inscription n'existe pas, ses boutons « Créer mon menu » ouvrent WhatsApp.

---

## 17. Ajustements du 6 octobre 2026

Décidés pendant la construction du produit complet. Là où ils contredisent une section plus haut, ce sont eux qui font foi.

| Sujet | Ce qui est construit |
|---|---|
| **Modèles de page** | Dix modèles au lieu de trois, chacun avec sa mise en page, sa typographie et ses animations. La couleur choisie par le gérant s'applique à n'importe lequel. Chaque modèle se voit sans compte à l'adresse `/apercu/{modèle}`. |
| **Essai gratuit** | Il ne démarre plus à l'inscription mais à la fin de la création de l'établissement : le gérant choisit son offre et confirme son numéro WhatsApp, sans rien payer. L'essai porte sur l'offre choisie, qu'il peut changer pendant les 14 jours. |
| **Fin d'essai** | L'administration liste les essais qui se terminent, avec un lien WhatsApp vers le gérant. |
| **Connexion** | E-mail et mot de passe. La connexion se fait côté serveur : le navigateur ne charge pas Firebase Auth. La connexion par Google est remise à plus tard. |
| **Mot de passe oublié** | Même principe que la vérification : un code à 6 chiffres par e-mail. |
| **Photos** | Le navigateur réduit la photo, puis l'envoie au serveur, qui vérifie les droits et la range dans Storage. Le navigateur n'écrit donc jamais dans Storage ; les photos sont lisibles par tous. |
| **Planches de QR Codes** | Une page prête à imprimer (ou à enregistrer en PDF depuis le navigateur) au lieu d'un fichier PDF fabriqué par le serveur. |
| **Lignes sans prix** | Un article peut ne pas avoir de prix et porter une mention (« Gratuit », « Inclus ») : c'est ce qui sert aux hôtels et aux résidences. |
| **Boutons « Créer mon menu »** | Ils mènent à `/inscription`. |

## Lexique

| Dans le code | En français |
|---|---|
| `user` | Compte personnel |
| `establishment` | Établissement |
| `member` | Membre de l'équipe |
| `owner`, `manager`, `waiter`, `kitchen` | Propriétaire, gérant, serveur, cuisine |
| `item` | Article (plat, boisson, service) |
| `table` | Emplacement (table ou chambre) |
| `order` | Commande |
| `slug` | Identifiant de l'établissement dans l'adresse (`chez-ali`) |
| `template` | Modèle de page |
| `plan` | Offre |
| `trial` | Essai gratuit |
