# Yéboué Tech — du site vitrine au SaaS

Document de référence du projet. Les explications sous forme de questions-réponses sont dans [REPONSES.md](REPONSES.md), le plan de construction dans [ARCHITECTURE.md](ARCHITECTURE.md), le brief du logo dans [LOGO-PROMPT.md](LOGO-PROMPT.md).
Tout ce qui est marqué **(hypothèse)** est une proposition à confirmer, pas un fait.

---

## 0. Décisions prises

| Sujet | Décision |
|---|---|
| Nom | **Yéboué Tech** pour l'instant, à revoir plus tard |
| Interface | React + Next.js + TypeScript, Tailwind CSS |
| Animations | **GSAP** pour le site vitrine, **Motion** pour l'application |
| Backend | Node.js (TypeScript), dans le même projet Next.js |
| Données | **Firebase** (Firestore, Auth, Storage), voir section 8 |
| Paiement | **GeniusPay** envisagé ; branché plus tard. Activation manuelle des abonnements au début |
| Première cible | Restaurants et maquis ; le moteur sert aussi les hôtels |
| Prix | Menu : 10 000 F par mois. Menu + Commande : 25 000 F par mois |
| Images | Des cartes avec de vraies photos, jamais de simples icônes ; de la vidéo quand elle sert |
| Emplacement du code | Dossier `plateforme/` ; l'ancien site reste à la racine comme référence |
| Types d'établissement | Restaurants, maquis, bars et lounges, hôtels, résidences meublées : une page du site pour chacun |
| Langues du site | Français et anglais |
| Apparence | Mode clair par défaut, mode sombre au choix du visiteur |
| Modèles de page | Plus de trois, avec couleur personnalisable |
| Modifications du menu | Faites par le gérant lui-même |
| Photos | Fournies par le gérant ; photographe partenaire en option payante (contrat géré par toi) |
| Téléphone animé | **Animation décorative du site vitrine uniquement**, non interactive |
| Logo | Refait : piste « le repère », dessiné en SVG |
| Polices | Bricolage Grotesque (titres) + Hanken Grotesk (texte) |
| Style « gaming », chiffres et témoignages actuels | Supprimés |
| Photos de la démonstration | Banques d'images libres |
| Nom de domaine | Pas encore acheté — **à acheter avant d'imprimer le premier QR** |

---

## 1. Ce que fait le SaaS

**Le SaaS s'occupe de tout.** Ce n'est pas un outil à devis derrière lequel tu fabriques un site par client.

Le principe : **une seule plateforme, un seul code, et chaque établissement y a sa propre page**, fabriquée automatiquement à partir de ce que le gérant a saisi. Aucune intelligence artificielle n'intervient : ce sont des modèles programmés une fois, remplis avec les données de chaque établissement.

Le gérant revient sur la plateforme **tous les jours** pour :
- modifier ses plats, ses prix, ses photos ;
- marquer un plat en rupture ;
- recevoir et traiter les commandes ;
- consulter ses chiffres ;
- payer son abonnement.

Ton rôle : faire connaître la plateforme, aider les gérants à démarrer, améliorer le produit. Tu as ton propre espace d'administration.

---

## 2. Les quatre espaces de la plateforme

| Espace | Qui l'utilise | À quoi il sert |
|---|---|---|
| **Site vitrine** | Le gérant qui découvre | Comprendre le produit, créer son compte |
| **Tableau de bord** | Le gérant et son équipe | Gérer le menu, les tables, les commandes, l'abonnement |
| **Page de l'établissement** | Le client du restaurant | Voir le menu, commander |
| **Administration** | Toi | Gérer tous les établissements et les paiements |

---

## 3. Comment ça marche, pas à pas

### 3.1 Le parcours du gérant

1. **Il arrive sur le site vitrine** et clique sur « Créer mon menu ».
2. **Il crée son compte** : nom, prénom, numéro de téléphone, mot de passe. L'essai gratuit de 14 jours démarre, avec **toutes** les fonctions (menu et commande).
3. **Il crée son établissement** : nom, type (restaurant, maquis, bar, hôtel), quartier, horaires, numéro WhatsApp, logo, photo de couverture.
4. **Il choisit un modèle de page et sa couleur.**
5. **Il saisit son menu** : des catégories, puis les plats (nom, description, prix, photo). Il ajoute lui-même ses photos.
6. **Il publie.** Sa page est en ligne à une adresse du type `ton-domaine/chez-ali`. Un bouton « Voir ma page » lui montre le résultat.
7. **Il récupère ses QR Codes** : un QR général, et un par table s'il le souhaite. Le tableau de bord les fournit en image et en planche PDF prête à imprimer.
8. **Les QR arrivent sur les tables** :
   - **en autonomie** : il imprime et pose lui-même ;
   - **clé en main** : il commande les supports, tu les fais imprimer et tu viens les poser.
9. **Avant la fin de l'essai**, il choisit son offre et paie. **Ses QR restent les mêmes** : rien à réimprimer.
10. **À tout moment**, il peut commander le pack photo pour remplacer ses photos par celles d'un professionnel.

### 3.2 Le parcours du client du restaurant

1. Il s'assoit, ouvre l'appareil photo de son téléphone, vise le QR. Aucune application.
2. La page du restaurant s'ouvre : couverture, nom, horaires, catégories.
3. Il parcourt les plats, touche un plat pour voir la photo, la description et le prix.
4. **Offre Menu** : il choisit et appelle le serveur, ou commande à emporter par WhatsApp.
5. **Offre Commande** : il remplit son panier, valide, et suit l'état de sa commande.

### 3.3 La page de l'établissement

- son logo, sa photo de couverture, sa couleur principale ;
- un modèle de mise en page à choisir. **Objectif : six modèles.** Conseil : en sortir trois parfaitement finis au lancement, puis ajouter les autres, car un modèle bâclé abîme l'image de toute la plateforme ;
- ses horaires, son adresse, un bouton d'appel et un bouton WhatsApp ;
- son menu, organisé par catégories.

### 3.4 Où sont hébergées les pages

**Il n'y a pas un site par restaurant.** Il y a une seule application, hébergée à un seul endroit, et une base de données qui contient tous les établissements.

La page de M. Ali n'est pas un fichier rangé quelque part. Elle est **fabriquée à la demande** :

1. Quand M. Ali nomme son établissement « Chez Ali », la plateforme lui attribue un identifiant unique dans l'adresse : `chez-ali`. Si ce nom est déjà pris, elle propose `chez-ali-cocody`.
2. Son QR Code est le dessin de l'adresse `ton-domaine/chez-ali`.
3. Quand un client scanne, son téléphone demande cette adresse à l'application.
4. L'application lit `chez-ali` dans l'adresse, cherche cet établissement dans la base, récupère son menu, son modèle et sa couleur, et envoie la page.

C'est ainsi que chaque QR « sait » à qui il appartient : l'identifiant est écrit dans l'adresse.

**Coût.** Tu paies un seul hébergement pour tout le monde. Un restaurant de plus ne coûte presque rien : quelques lignes dans la base et quelques photos. L'hébergement est donc compris dans l'abonnement du gérant, sans que tu aies quoi que ce soit à lui refacturer.

---

## 4. Le QR Code

### Statique ou permanent
Un QR Code est une adresse web dessinée en carrés. Il ne contient pas le menu.

- **L'image du QR ne change jamais.**
- **L'adresse à l'intérieur ne change jamais.**
- **Le contenu de la page change** quand le gérant modifie son menu.

### Qui fabrique les QR Codes
**La plateforme elle-même, gratuitement et sans limite.** Dessiner un QR Code est un simple calcul, réalisé par une bibliothèque de code libre et gratuite. Aucun service extérieur n'est nécessaire.

Les sites qui font payer les QR Codes vendent en réalité l'hébergement du lien et les statistiques. Ici, c'est notre plateforme qui fait les deux.

### Un QR par table
Exemple : 60 tables à l'étage, 10 au rez-de-chaussée.

1. Le gérant crée deux zones : « Étage » (60 tables) et « Rez-de-chaussée » (10 tables).
2. La plateforme crée 70 adresses : `ton-domaine/chez-ali/t/1` à `…/t/70`.
3. Elle dessine les 70 QR Codes en moins d'une seconde.
4. Le gérant télécharge **un seul PDF** : une planche où chaque QR porte son étiquette (« Étage — Table 12 »).

Que ce soit 70 ou 700 tables, cela ne change rien pour la plateforme.

### Le nom de domaine
L'adresse imprimée dans chaque QR contient ton nom de domaine. **Il doit donc être acheté avant d'imprimer le premier vrai QR, et conservé pour toujours** : si le domaine change ou expire, tous les QR déjà posés cessent de fonctionner.

---

## 5. Les fonctionnalités, par niveau

### Niveau 1 — Le menu vivant (le socle)
- Catégories, plats, photos, descriptions, prix en FCFA.
- **Rupture en un geste**.
- Plat du jour et promotions **programmés**.
- Plusieurs langues (français, anglais).
- QR Codes permanents, téléchargeables.
- Le même lien sert ailleurs : bio Instagram, statut WhatsApp, fiche Google.
- **Commande à emporter par WhatsApp** : le panier devient un message prérempli envoyé au numéro du gérant.

### Niveau 2 — La commande sur place

1. Le client à la table 12 valide son panier sur son téléphone.
2. La commande est enregistrée dans la base de données.
3. Au comptoir ou en cuisine, un téléphone ou une tablette reste ouvert sur la page **« Commandes »** du tableau de bord.
4. La commande y apparaît seule, en une ou deux secondes, avec une sonnerie : « Table 12 — 2 attiéké poisson, 1 bissap ».
5. Le personnel touche **Acceptée**, puis **Prête**, puis **Servie**.
6. Le client voit ces étapes sur son téléphone.

Autres fonctions : appeler le serveur, demander l'addition, payer par mobile money à table (plus tard).

### Niveau 3 — Faire revenir le client
- Avis après le repas, et lien vers la fiche Google proposé à tous.
- Carte de fidélité par numéro de téléphone.
- Messages promotionnels WhatsApp aux clients qui ont donné leur accord.

### Niveau 4 — Piloter l'établissement
- Scans par jour, par heure, par table.
- Plats les plus consultés ; plats très consultés mais peu commandés.
- Chiffre d'affaires passé par la plateforme.

### Version hôtel
Le même moteur : livret d'accueil en chambre, code WiFi, room service, demandes, spa, activités. Un QR par chambre.

### Revenus en plus de l'abonnement
- Supports imprimés (chevalets, autocollants).
- Pack photo.
- Apporteurs d'affaires à la commission.

---

## 6. Les photos

| | Le gérant fournit ses photos | Pack photo avec le photographe partenaire |
|---|---|---|
| Prix | Inclus | Facturé, une fois |
| Qualité | Variable | Professionnelle et homogène |
| Délai | Immédiat | Quelques jours |

- **Par défaut**, le gérant ajoute ses photos depuis son téléphone. La plateforme l'aide : court guide de prise de vue, recadrage automatique, belle présentation pour les plats sans photo.
- **En option**, le pack photo : tu envoies ton photographe partenaire (contrat freelance, géré par toi), tu factures la séance et gardes une marge.
- Le photographe n'est **jamais obligatoire** pour publier.

**Démonstration** : images de banques libres (Unsplash, Pexels). Les plats ivoiriens y sont rares ; au besoin, une séance avec le photographe partenaire. L'établissement de démonstration est toujours présenté comme une démonstration.

---

## 7. Offres et prix

### Ce que font les concurrents (relevé d'octobre 2026)

| Service | Pays | Prix par mois | Ce qui est inclus | Essai |
|---|---|---|---|---|
| **MenuPro** | Côte d'Ivoire | 5 000 F | 15 plats, 100 commandes | 7 jours |
| | | 15 000 F | 25 plats, 200 commandes, mobile money | |
| | | 25 000 F | 80 plats, 1 000 commandes, stock, livraison, statistiques | |
| | | 85 000 F | Multi-sites, QR par chambre d'hôtel | |
| **Scanifood** | Sénégal | 14 900 F | Menu, commande à table et à emporter, paiement, statistiques | 30 jours |
| **SamaMenu Pro** | Sénégal | À partir de 10 000 F | Menu, paiement mobile money, avis Google | — |
| **Menu Digital SN** | Sénégal | À partir de 10 000 F | Menu | — |
| MenuTiger, Orderlina, FineDine | International | 14 à 29 $ (environ 8 500 à 18 000 F) | Menu et commande | — |

Ce qu'on en retient :
- **Le marché se situe entre 10 000 et 25 000 F par mois.**
- **La commande est déjà incluse autour de 15 000 F** chez plusieurs concurrents.
- Le concurrent ivoirien direct, MenuPro, annonce 11 restaurants actifs : le marché est à peine ouvert.
- MenuPro **limite le nombre de plats** (25 plats à 15 000 F). C'est sa faiblesse : un maquis dépasse vite 25 plats avec les boissons.

### Offres retenues

| Offre | Prix | Contenu |
|---|---|---|
| **Essai** | Gratuit, 14 jours | Tout : menu et commande |
| **Menu** | **10 000 F / mois** | Page de l'établissement, plats et photos **illimités**, QR, commande à emporter par WhatsApp, statistiques de base |
| **Menu + Commande** | **25 000 F / mois** | Tout « Menu », plus QR par table, commande sur place, écran de commandes, fidélité, statistiques complètes |
| **Hôtel / Multi-sites** | Sur devis | Plusieurs établissements, QR par chambre |
| **Installation clé en main** | 85 000 F, une fois | Saisie du menu, supports imprimés, pose, formation |
| **Pack photo** | À fixer avec le photographe | Séance professionnelle |

Paiement annuel : 2 mois offerts.

**Position sur le marché.** Le Menu est au prix d'entrée des concurrents ; l'offre complète est au niveau de l'offre « Pro » de MenuPro. L'argument à mettre en avant est l'absence de toute limite de plats et de commandes.

### Facturation
Le mobile money ne se prélève pas automatiquement. L'abonnement fonctionne en **périodes prépayées** (1, 3 ou 12 mois), avec rappel WhatsApp 5 jours avant la fin, puis délai de grâce avant le passage en mode limité. On ne coupe jamais un menu en plein service.

### Paiement : GeniusPay
- Frais affichés : 1 % + 100 F par paiement réussi, plus les frais de l'opérateur. Avec Wave : 2,5 % + 100 F au total, soit **350 F sur un abonnement de 10 000 F**. Orange et MTN reviennent plus cher (environ 4,5 % + 100 F).
- Sans abonnement mensuel ; API, mode test et notifications automatiques fournis.
- **Deux points à vérifier avant de s'engager** : leur page d'inscription affiche actuellement une liste d'attente ; et leurs conditions précisent qu'ils sont un service d'intégration technique, pas un établissement de paiement. Il faut donc leur demander si un compte chez Wave ou un autre opérateur est nécessaire en plus, et quels documents sont exigés.

**En attendant** : le gérant paie par Wave ou Orange Money sur ton numéro, et tu actives son abonnement depuis l'espace d'administration. Le code de paiement est isolé dans un seul module, pour brancher GeniusPay plus tard sans rien casser.

### Démarrer sans aucun client
- **La preuve, c'est la démonstration** : un vrai menu consultable.
- **Programme « établissements pilotes »** **(hypothèse)** : les 5 à 10 premiers restaurants équipés gratuitement pendant 3 mois, contre un témoignage réel, des photos et leurs retours.

---

## 8. Technique

### Pile validée
| Besoin | Choix | Rôle |
|---|---|---|
| Interface | **React + Next.js + TypeScript** | Vitrine, tableau de bord et pages des établissements dans un seul projet |
| Style | **Tailwind CSS** | Charte définie une fois |
| Animations du site vitrine | **GSAP** + ScrollTrigger | Séquences liées au défilement, animation du téléphone |
| Animations de l'application | **Motion** | Transitions des menus, fenêtres, listes |
| Composants de base | **Radix / shadcn/ui**, restylés | Accessibilité déjà faite |
| Backend | **Node.js** dans Next.js | Un seul langage |
| Base de données | **Firestore** | Menus, commandes, abonnements |
| Comptes | **Firebase Auth** | Connexion par téléphone ou e-mail |
| Photos | **Firebase Storage** | Stockage et diffusion |
| QR Codes | Bibliothèque libre, sortie SVG et PDF | Génération illimitée |

GSAP et Motion ne se marchent pas dessus : GSAP pour les grandes animations du site vitrine, Motion pour les petites transitions de l'application. GSAP est gratuit, extensions comprises.

### Pourquoi Firebase, finalement

J'avais recommandé PostgreSQL. **Je change d'avis**, pour une raison qui pèse plus que les autres : **tu maîtrises Firebase et tu es seul à développer.** Un outil que l'on connaît bien donne un produit plus fiable et plus vite terminé qu'un outil théoriquement meilleur que l'on découvre.

Firebase convient d'ailleurs bien à plusieurs parties du produit :
- un menu est naturellement rangé en « dossiers » (établissement → catégories → plats), ce qui est la forme de Firestore ;
- l'écran de commandes en direct est exactement ce que Firestore fait le mieux ;
- comptes et stockage des photos sont fournis.

Ses deux faiblesses, et comment on les neutralise dès le départ :

| Faiblesse | Parade |
|---|---|
| **Facturation à la lecture** : chaque scan pourrait lire des dizaines de documents | La page de l'établissement est **mise en cache** par Next.js : mille scans ne coûtent qu'une lecture, jusqu'à la prochaine modification du menu |
| **Statistiques malaisées** | Un petit document de compteurs par établissement et par jour, mis à jour à chaque scan et à chaque commande |

Deux précautions :
- tout accès à la base passe par **un seul dossier de code**, pour pouvoir changer de base un jour sans réécrire l'application ;
- une **alerte de budget** est réglée dans Firebase dès le premier jour.

À vérifier au démarrage : le stockage des photos demande aujourd'hui le forfait « à l'usage » de Firebase, qui reste gratuit sous un certain volume mais exige d'enregistrer une carte bancaire.

### Hébergement
Une seule application à héberger (voir 3.4). Deux candidats : **Vercel**, fait par les créateurs de Next.js, ou **Firebase App Hosting**, pour tout garder chez Firebase. Pendant le développement, les deux sont gratuits. Pour un usage commercial, compter de l'ordre de 20 $ par mois chez Vercel **(à vérifier au lancement)**. Le choix se fera à l'étape 2.

### Règles non négociables
- **Page de l'établissement ultra-légère** : rendue côté serveur, mise en cache, moins de 150 Ko hors photos, utilisable en 3G.
- **Adresse permanente** par établissement et par table.
- **Cloisonnement strict** : règles de sécurité Firestore, un gérant ne voit jamais les données d'un autre.
- **Tableau de bord pensé pour le téléphone d'abord.**
- **Rôles** : propriétaire, gérant, serveur, cuisine.

### Organisation des données (première esquisse)
```
utilisateurs/{id}
adresses/{chez-ali}              → renvoie vers l'établissement ; garantit l'unicité
etablissements/{id}              nom, type, modèle, couleur, horaires, abonnement
    categories/{id}
    articles/{id}                prix, photo, disponibilité, traductions
    emplacements/{id}            table ou chambre, zone, numéro
    commandes/{id}               emplacement, lignes, état, total
    statistiques/{date}          scans, commandes, chiffre du jour
paiements/{id}
```
« Article » et « emplacement » plutôt que « plat » et « table » : le même moteur sert ainsi un hôtel.

---

## 9. Identité visuelle

### Quelle identité pour ce type de produit
Deux publics, dont aucun n'est un joueur de jeux vidéo : **le gérant**, qui doit se dire « c'est sérieux et simple », et **le client à table**, qui doit avoir faim. Les produits qui réussissent dans la restauration partagent le même trio : **fond clair et chaleureux, typographie soignée, grandes photos de nourriture.**

### La direction : « l'encre et la braise »

| Rôle | Couleur | Usage |
|---|---|---|
| **Ivoire** | ~`#FAF6EF` | Fond principal |
| **Encre** | ~`#14213D` | Texte, sections sombres |
| **Braise** | ~`#F2622E` | **L'action uniquement** (boutons, prix) |
| **Signal** | cyan | **Le scan uniquement** |

### Polices
- **Bricolage Grotesque** pour les titres : du caractère, des formes un peu irrégulières qui ne ressemblent pas aux sites habituels.
- **Hanken Grotesk** pour le texte : très lisible en petit, chiffres bien alignés pour les prix.

Les deux sont gratuites.

### Le logo : « le repère »
Chaque QR Code porte dans ses coins un carré arrondi avec un point au centre. Vu de dessus, c'est aussi **une assiette sur une table**. Un seul signe dit le QR et le repas, il reste lisible à 16 pixels, fonctionne en une couleur, et peut s'animer.

**Conseil : ne pas passer par un générateur d'images.** Il produira une image floue en JPG avec des détails inutiles, c'est-à-dire les défauts du logo actuel. Cette forme est géométrique et simple : je la dessine directement en SVG à l'étape 0, en trois variantes, avec le nom écrit en Bricolage Grotesque.

### À bannir (ce qui donne l'air « fait par une IA »)
- Dégradés violet-bleu, verre dépoli, halos lumineux.
- Une icône devant chaque titre et chaque bouton.
- Grilles de trois cartes identiques, section après section.
- Emojis dans l'interface.
- Tout centré, tout arrondi pareil, tout animé pareil.
- Chiffres et témoignages inventés.

### À rechercher
- Une grille stricte et beaucoup d'espace vide.
- Des mises en page asymétriques.
- Peu d'animations, chacune avec une raison d'exister.
- Des textes écrits comme un gérant parle.

---

## 10. L'animation du téléphone

Le téléphone est **une animation du site vitrine, et rien d'autre**. On ne clique pas dedans, il ne sert ni à l'inscription ni au tableau de bord : le gérant est déjà sur son propre téléphone, les formulaires sont de vrais formulaires.

### Ce qui existe aujourd'hui
| Élément | Ce qu'il fait |
|---|---|
| Téléphone « QR » | Icône QR + 3 badges |
| Trois téléphones « étapes » | Scan (QR qui pulse + ligne cyan), menu (lignes qui glissent), détail |
| Téléphone à trois écrans | Écrans changés par des boutons, fondu |
| Mini téléphone, chevalet QR | Décoratifs |

Limite : l'intérieur des écrans est fait de rectangles gris.

### Ce qu'on améliore
- **L'extérieur** : cadre plus fin et réaliste, reflet discret, ombre douce à la place du halo néon, légère inclinaison qui suit le défilement.
- **L'intérieur** : un vrai menu dessiné, avec de vraies photos et de vrais prix, à la place des rectangles gris.
- **Le mouvement** : avec GSAP, l'animation se joue toute seule au fil du défilement de la page : le QR est cadré, la ligne de scan passe, le menu s'ouvre, un plat s'affiche, la commande part.
- **Une version restaurant et une version hôtel**, comme aujourd'hui.

Les animations respectent le réglage « réduire les animations » du système.

---

## 11. Ordre de construction

| Étape | Contenu | Résultat |
|---|---|---|
| **0. Fondations** | Projet Next.js, Firebase, charte Tailwind, polices, logo en SVG | L'identité existe |
| **1. Produit minimal** | Compte, établissement, choix du modèle et de la couleur, éditeur de menu, page de l'établissement, QR à télécharger | Un gérant peut être en ligne seul |
| **2. Vitrine** | Page d'accueil d'abord (avant l'étape 1, pour fixer l'apparence du site), puis les autres pages et l'établissement de démonstration | On peut présenter le produit |
| **3. Administration et abonnements** | Ton espace, activation manuelle, rappels, fin d'essai | On peut encaisser |
| **4. Commande** | Panier, WhatsApp, QR par table, écran de commandes | Offre « Menu + Commande » |
| **5. Fidélisation et statistiques** | Avis, fidélité, chiffres | Raisons de rester abonné |
| **6. Extensions** | Hôtel, supports imprimés, pack photo, apporteurs, GeniusPay | Nouveaux revenus |

---

## 12. Ce qui reste à trancher

1. **Les taux de remise** pour 3, 6 et 12 mois payés d'avance.
2. **Le nom de domaine** : à choisir et acheter (vérifier la disponibilité de `yebouetech.com` et `yebouetech.ci`).
3. **GeniusPay** : leur poser les deux questions de la section 7.
4. **Le photographe partenaire** : à trouver, tarif à négocier.
5. **Le logo** : choix parmi les trois variantes de l'étape 0.
6. **Le statut de la société** : plus tard.
