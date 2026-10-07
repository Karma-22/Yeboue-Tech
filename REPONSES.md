# Yéboué Tech — questions et réponses

Toutes les réponses aux questions posées pendant le cadrage, pour s'y retrouver.
Le document de référence du projet reste [PROJET-SAAS.md](PROJET-SAAS.md).

---

## A. Le fonctionnement général

### Le SaaS gère tout, ou il sert seulement à faire des devis ?
Il gère tout. Le gérant s'inscrit, saisit ses informations, choisit son modèle, publie, reçoit ses commandes et paie, sans que tu interviennes. Tu ne fabriques pas un site par client.

### Où sont hébergées les pages des restaurants ?
Nulle part séparément. Il existe **une seule application**, hébergée à un seul endroit, et **une base de données** qui contient tous les restaurants.

La page d'un restaurant n'est pas un fichier : elle est fabriquée au moment où quelqu'un la demande, à partir des informations de la base. C'est exactement ce que fait Facebook avec les pages.

### Comment le QR Code sait-il qu'il appartient à M. Ali ?
Parce que c'est écrit dedans.

1. M. Ali nomme son établissement « Chez Ali ». La plateforme lui réserve l'identifiant `chez-ali`, que personne d'autre ne peut prendre.
2. Son QR Code est le dessin de l'adresse `ton-domaine/chez-ali`.
3. Un client scanne : son téléphone ouvre cette adresse.
4. L'application lit `chez-ali`, cherche ce restaurant dans la base, et renvoie sa page avec son menu, son modèle et sa couleur.

Pour un autre restaurant, l'adresse est différente, donc le QR est différent, donc la page est différente.

### Faut-il payer une IA pour créer les pages ?
Non. Les modèles sont programmés une fois pour toutes. Le choix du gérant est enregistré comme deux simples valeurs, par exemple `modèle : braise` et `couleur : orange`. Quand la page s'affiche, elle applique ces valeurs. Cela ne coûte rien.

### L'hébergement est-il compris dans l'abonnement du gérant ?
Oui. Tu paies un seul hébergement pour toute la plateforme. Un restaurant de plus ne te coûte presque rien : quelques lignes dans la base et ses photos.

### Qui modifie le menu après la mise en ligne ?
Le gérant lui-même, depuis son tableau de bord : ajouter un plat, changer une photo, modifier un prix. Le changement est visible immédiatement.

---

## B. Les QR Codes

### Statique ou permanent ?
C'est la même chose. L'image du QR ne change jamais, l'adresse qu'il contient non plus. Seul le contenu de la page change quand le gérant modifie son menu.

### Faut-il payer une autre plateforme pour générer les QR Codes ?
Non. Dessiner un QR Code est un simple calcul, fait par une bibliothèque de code libre et gratuite installée dans notre application. Pas de limite, pas de coût.

### La plateforme peut-elle vraiment générer 70 QR Codes pour un seul restaurant ?
Oui, en moins d'une seconde. Le gérant indique « Étage : 60 tables » et « Rez-de-chaussée : 10 tables ». La plateforme crée 70 adresses (`…/chez-ali/t/1` à `…/t/70`) et fournit un seul PDF à imprimer, chaque QR portant son étiquette. Avec 700 tables, ce serait pareil.

### Que se passe-t-il pour les QR à la fin de l'essai gratuit ?
Rien. Les QR posés pendant l'essai restent valables une fois l'abonnement payé.

### Pourquoi le nom de domaine est-il urgent ?
L'adresse imprimée dans chaque QR contient ton nom de domaine. Il faut donc l'acheter **avant** d'imprimer le premier vrai QR, et ne jamais le perdre : sinon tous les QR déjà posés ne mènent plus nulle part.

---

## C. L'essai gratuit et les offres

### Que contient l'essai de 14 jours ?
Tout : le menu et la commande. Le gérant ajoute lui-même ses photos, pose ses QR, et teste en conditions réelles. À la fin, il choisit l'offre « Menu » ou « Menu + Commande ».

### Et le photographe ?
C'est une option à part, que le gérant peut commander à tout moment, pendant ou après l'essai.

### Quels prix ?
**Décision : Menu à 10 000 F par mois, Menu + Commande à 25 000 F par mois.**

Les concurrents relevés :

| Service | Pays | Prix par mois |
|---|---|---|
| MenuPro | Côte d'Ivoire | 5 000 / 15 000 / 25 000 / 85 000 F, avec nombre de plats limité |
| Scanifood | Sénégal | 14 900 F, commande incluse |
| SamaMenu Pro | Sénégal | À partir de 10 000 F |
| Menu Digital SN | Sénégal | À partir de 10 000 F |
| Services internationaux | — | Environ 8 500 à 18 000 F |

### Que veut dire « 10 accès pour votre équipe » ?
Un accès, c'est un compte pour une personne de l'équipe du restaurant. Au lieu de partager un seul mot de passe, chacun se connecte avec le sien et ne voit que ce qui le concerne :
- le **serveur** voit et traite les commandes ;
- la **cuisine** voit les plats à préparer ;
- le **gérant** modifie le menu, les prix, les photos ;
- le **propriétaire** est le seul à gérer l'abonnement et à inviter ou retirer quelqu'un.

L'offre Menu donne 2 accès (le propriétaire et une autre personne), l'offre Menu + Commande en donne 10. Quand un employé s'en va, le propriétaire retire son accès d'un geste, sans changer de mot de passe pour tout le monde. Le détail des droits est dans ARCHITECTURE.md, section 2.

### Comment se situent ces prix ?
Le Menu est au prix d'entrée des concurrents. L'offre complète est au niveau de l'offre « Pro » du concurrent ivoirien, mais sans limite de plats ni de commandes : c'est l'argument à mettre en avant.

---

## D. Les commandes

### Comment la commande arrive-t-elle en cuisine ?
Un téléphone ou une tablette reste ouvert au comptoir sur la page « Commandes ». Dès qu'un client valide son panier, la commande s'y affiche en une ou deux secondes avec une sonnerie. Le personnel touche « Acceptée », « Prête », « Servie », et le client suit ces étapes sur son téléphone.

### Pourquoi WhatsApp, puisqu'on a une interface ?
WhatsApp ne remplace pas l'interface : le client choisit toujours ses plats sur la page du restaurant. WhatsApp sert seulement à **acheminer la commande jusqu'au gérant**, dans deux cas :
- la commande à emporter ou en livraison, où il faut discuter de l'adresse et de l'heure ;
- le petit établissement qui n'a personne pour surveiller un écran.

---

## E. Les photos

### Le gérant envoie ses photos, ou j'envoie un photographe ?
Les deux. Par défaut, le gérant ajoute ses propres photos, sans frais, pour ne jamais bloquer son inscription. En option payante, le pack photo avec ton photographe partenaire : c'est la formule la plus professionnelle, et tu gardes une marge.

### Et pour le site, sans client ?
Des images de banques libres (Unsplash, Pexels) pour l'établissement de démonstration, présenté comme une démonstration. Les plats ivoiriens y sont rares : une séance photo sera peut-être nécessaire.

---

## F. La technique

### Firebase ou PostgreSQL ?
**Firebase.** J'avais recommandé PostgreSQL ; je change d'avis parce que tu maîtrises Firebase et que tu développes seul. Bien connaître son outil compte plus que choisir l'outil théoriquement parfait.

Firebase convient bien au menu (rangé en dossiers) et à l'écran de commandes en direct. Ses deux défauts sont neutralisés dès le départ :
- **le coût à la lecture** : la page du restaurant est mise en cache, donc mille scans ne coûtent qu'une lecture ;
- **les statistiques** : un petit compteur par restaurant et par jour.

### GSAP ou Motion ?
Les deux, chacun à sa place : GSAP pour les grandes animations du site vitrine (dont le téléphone), Motion pour les petites transitions de l'application. GSAP est gratuit, extensions comprises.

### GeniusPay ?
Bon candidat : pas d'abonnement, 1 % + 100 F par paiement plus les frais de l'opérateur. Avec Wave, cela fait 350 F sur un abonnement de 10 000 F.

Deux choses à leur demander avant de compter dessus :
- leur page d'inscription affiche une liste d'attente : quand le compte sera-t-il réellement ouvert ?
- ils se présentent comme un service d'intégration technique, pas comme un établissement de paiement : faut-il en plus un compte marchand chez Wave ou Orange ?

En attendant, les gérants te paient par Wave ou Orange Money et tu actives leur abonnement à la main.

---

## G. L'identité

### Quel logo ?
« Le repère » : le carré arrondi avec un point au centre que l'on voit aux coins de tout QR Code, et qui ressemble aussi à une assiette vue de dessus. Mieux vaut ne pas le générer avec un outil d'images : je le dessine en SVG, net à toutes les tailles.

### Quelles polices ?
Bricolage Grotesque pour les titres, Hanken Grotesk pour le texte. Gratuites toutes les deux.

### À quoi sert la page « charte » ? Est-ce que le site ressemblera à ça ?
Non. C'est la boîte à outils du site : les couleurs, les polices, les boutons et les champs avec lesquels toutes les pages sont construites. Elle sert à vérifier que tout est cohérent, et elle n'apparaît pas sur le site en ligne. Le site lui-même, c'est la page d'accueil et les suivantes, avec de vraies photos.

### Des cartes avec des icônes, ou avec des images ?
Avec des images. Une carte faite d'une icône et de trois lignes de texte se voit sur tous les sites générés automatiquement. Les cartes du site montrent donc de vraies photos (plats, salles, tables), et les fonctions sont présentées avec une photo et un morceau de l'interface réelle. Les photos viennent de banques d'images libres de droits ; leurs sources sont notées dans le projet.

### Le téléphone animé ?
Il reste une animation du site vitrine, sans rien de cliquable. On améliore son cadre, on remplace les rectangles gris par un vrai menu, et l'animation se joue au fil du défilement. Il n'apparaît ni dans l'inscription ni dans le tableau de bord.

---

## H. Le produit, tel qu'il est construit

Tout ce qui suit existe dans le dossier `plateforme/` et se lance sur votre ordinateur. Rien n'est encore en ligne.

### Comment l'essayer

Deux commandes, dans deux fenêtres de terminal ouvertes dans le dossier `plateforme` :

1. `npm run emulators` — attendez la phrase « All emulators ready ». Si votre ordinateur est trop occupé, la commande réessaie toute seule.
2. `npm run local` — la première fois, le site se construit : comptez une dizaine de minutes. Ensuite il est sur http://localhost:3000, et **chaque page s'ouvre aussitôt**. Les fois suivantes : `npm run local -- --lancer`, sans attente.

Le restaurant d'exemple et ses deux comptes sont déjà enregistrés. (Si un jour ils manquent : `npm run demo` les recrée.)

| Pour voir… | Adresse | Compte |
|---|---|---|
| Le site vitrine | http://localhost:3000 | — |
| Un modèle de page | http://localhost:3000/apercu/braise | — |
| Le restaurant d'exemple, côté client | http://localhost:3000/le-palmier | — |
| Le même, depuis la table 3 (avec la commande) | http://localhost:3000/le-palmier/t/3 | — |
| Le tableau de bord du gérant | http://localhost:3000/connexion | `gerant@demo.test` / `demo-1234` |
| L'administration (vous) | http://localhost:3000/admin | `admin@demo.test` / `demo-1234` |

Pour passer d'un compte à l'autre, déconnectez-vous d'abord (ou ouvrez une fenêtre de navigation privée).

**Pourquoi `npm run local` et pas `npm run dev` ?** Avec `npm run dev`, le site prépare chaque page au moment où vous l'ouvrez : sur votre ordinateur, c'est une à deux minutes d'attente par page. C'est le mode pour modifier le code. Pour regarder et faire essayer, `npm run local` est bien plus agréable. Une fois le site en ligne, ce délai n'existe pas du tout.

### Le parcours d'un gérant

1. Il touche « Créer mon menu » sur le site : il arrive sur l'inscription, plus sur WhatsApp.
2. Il saisit son nom, son numéro, son e-mail, un mot de passe.
3. Il reçoit un code à six chiffres et le tape dans les six cases animées. En local, aucun e-mail ne part : le code est affiché sur la page.
4. Quatre écrans : **son établissement** (nom, type, quartier, WhatsApp), **l'apparence** (un des dix modèles, sa couleur, son logo, sa photo), **sa carte** (il peut partir d'une carte d'exemple), **son offre**.
5. Sur le dernier écran, il choisit son offre et confirme son numéro WhatsApp. **Il ne paie rien** : l'essai de 14 jours démarre, sa page est en ligne, son QR Code est prêt.

### Les dix modèles

| Modèle | Son idée |
|---|---|
| **Braise** | De grandes photos en cartes, sous une couverture généreuse |
| **Ardoise** | Le tableau noir du maquis, écrit à la craie |
| **Table d'hôte** | La carte classique sur papier ivoire |
| **Comptoir** | La nuit : fond sombre, cocktails en grand |
| **Palace** | Sobre et raffiné, les services en volets (hôtels) |
| **Magazine** | Une mise en page de revue, en grands titres |
| **Épure** | Presque rien : une liste nette, très rapide |
| **Marché** | Des aplats de couleur, des étiquettes de prix |
| **Carnet** | Le ticket de caisse, qui sort de l'imprimante |
| **Vitrine** | Les plats en plein écran, à feuilleter comme des « stories » |

Chaque modèle a sa mise en page, ses polices et ses animations. La couleur choisie par le gérant s'applique à n'importe lequel : le texte posé dessus reste lisible, c'est calculé. Sur la page d'aperçu, les pastilles du bandeau changent la couleur, et les flèches passent d'un modèle à l'autre.

### Ce que le gérant peut faire ensuite

- **Carte** : catégories, articles, prix, photos, ordre, rupture d'un geste. Chaque changement est en ligne tout de suite.
- **Tables et QR Codes** : il crée ses zones (« Terrasse », 12 tables) ; un QR Code par table, et une planche à imprimer avec tous les codes.
- **Commandes** : elles arrivent en direct, avec une sonnerie. Accepter, prête, servie. Le client voit l'état changer sur son téléphone.
- **Apparence**, **Informations** (adresse, horaires, carte en anglais), **Statistiques** (scans, ventes, avis), **Équipe** (inviter un serveur par un lien), **Abonnement**.

### Ce que vous faites, vous, dans l'administration

- Voir les inscrits, les essais en cours, ce que vous avez encaissé.
- **À relancer** : la liste des essais qui se terminent dans les cinq jours. Un bouton ouvre WhatsApp sur le numéro du gérant, le message déjà écrit.
- Enregistrer un paiement reçu par Wave ou Orange Money : l'abonnement est prolongé aussitôt.
- Offrir sept jours d'essai de plus, suspendre un établissement, ou ouvrir le tableau de bord d'un gérant pour l'aider.

### Ce qui n'est pas fait

| Quoi | Pourquoi |
|---|---|
| La carte de fidélité | Pas construite. Je l'ai donc retirée de la liste de l'offre à 25 000 F sur le site (il est écrit « Avis des clients après leur commande ») : le site ne promet que ce qui existe. Dites-moi si vous voulez que je la construise. |
| Les pages Tarifs, Fonctionnement et Contact séparées | La page d'accueil réunit déjà ces trois parties. |
| Les pages légales (mentions, conditions de vente) | Elles demandent le nom et le statut de votre entreprise. |
| Le paiement en ligne (GeniusPay) | Il demande un compte marchand. En attendant, le paiement est enregistré à la main. |
| La connexion avec Google | Remise à plus tard : e-mail et mot de passe suffisent pour commencer. |
| L'e-mail définitif | Le gabarit actuel est provisoire, en attendant votre maquette. |

### Ce qu'il me faut de vous pour mettre en ligne

1. **Un nom de domaine.** C'est le plus urgent : son adresse est dessinée dans chaque QR Code. On ne peut imprimer aucun QR Code avant.
2. **L'accès à votre service d'e-mail**, pour que les codes de vérification partent vraiment.
3. **Un projet Firebase** à votre nom (gratuit pour démarrer).
4. **La maquette de l'e-mail**, quand vous l'aurez dessinée.
5. **Vos propres photos** : celles du site viennent de banques d'images.
6. **Une relecture de l'anglais** du site par quelqu'un dont c'est la langue.

---

## Sources des prix

- MenuPro : https://menupro.ci/
- Scanifood : https://scanifood.com/
- SamaMenu Pro : https://www.samamenu.pro/
- Menu Digital SN : https://menudigitalsn.com/
- Services internationaux : https://www.menutiger.com/blog/qr-code-menu-price
- GeniusPay : https://geniuspay.ci/pricing
