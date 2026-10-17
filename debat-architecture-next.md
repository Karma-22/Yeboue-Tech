# Débat : architecture technique d'une plateforme SaaS (Yéboué Tech)

Intervenants : **Karma** (voix grave) et **Camilla** (voix aiguë).
Durée de l'enregistrement : environ 14 min 24 s.
Source : L_architecture_Next.m4a

> Transcription automatique corrigée. Les passages marqués [?] sont incertains (mot mal reconnu ou deviné d'après le contexte). Voir les notes de fiabilité en fin de document.

---

**Camilla :** Bienvenue dans D-Ebade [?]. Aujourd'hui, notre échange intellectuel et l'exploration de nos perspectives divergentes se portent sur l'architecture technique sous-jacente d'une plateforme SaaS. Imaginez un instant que vous construisez un grand édifice. Pour des raisons d'économie et de rapidité stupéfiante, vous décidez de faire reposer toute la structure, les appartements de luxe, les bureaux, les fondations et même la machinerie des ascenseurs, sur un seul et unique pilier central en béton [?].

**Karma :** C'est une excellente allégorie.

**Camilla :** N'est-ce pas ? La question centrale aujourd'hui, c'est de savoir si vous avez inventé une nouvelle forme d'efficacité architecturale minimaliste, ou si vous venez de construire un colossal château de cartes prêt à s'effondrer à la première bourrasque.

**Karma :** Et si on transpose cette image au monde du logiciel, on touche exactement l'essence de notre analyse croisée d'aujourd'hui. Nous allons décortiquer l'architecture du site dans son ensemble, d'un projet vraiment fascinant, Yéboué Tech.

**Camilla :** Exactement. Pour mettre un peu de contexte, il s'agit d'une plateforme SaaS ivoirienne de menus par QR code. Le principe fonctionnel est simple et franchement redoutablement efficace. Un gérant de maquis, de restaurant ou d'hôtel s'inscrit, il numérise sa carte, génère des QR codes pour ses tables et...

**Karma :** ...et ses clients commandent directement depuis leur [?] smartphone, c'est ça ? Sans jamais installer d'application.

**Camilla :** Voilà. Ça, c'est le produit fini.

**Karma :** Mais sous le capot, l'architecture qui a été choisie par ce développeur solo pour soutenir tout ça, ça pose de sérieuses questions.

**Camilla :** Et c'est exactement là que nos visions s'entrechoquent. Moi, je défends cette architecture unifiée. On part d'une seule application Next.js et d'une seule base de données Firebase pour absolument tous les établissements. Pour moi, je suis convaincue que c'est un modèle d'efficacité élégant, qui est parfaitement optimisé par le cache. C'est un triomphe du pragmatisme d'ingénierie.

**Karma :** Et moi je soutiens la thèse inverse, sans surprise. À mes yeux, ce modèle sacrifie la robustesse à long terme. En fait, en contournant les limites d'un outil inadapté par pure commodité de développement, on a construit une structure fragile qui repose sur des compromis techniques ultra-risqués face aux limites du multi-locataire, le fameux multi-tenant.

**Camilla :** Et mais rentrons directement dans la mécanique. Quand on examine le fonctionnement du routage dynamique de Yéboué Tech, c'est d'une fluidité remarquable. Le visiteur qui arrive sur le site vitrine à la racine, le gérant sur /app, le super-administrateur sur /admin et le client à table qui scanne l'adresse /slug, genre chez Ali, ben tout... tous ces utilisateurs naviguent sur la même application unique. Il n'y a pas un site déployé par restaurant. Le système extrait cet identifiant depuis l'adresse web, il interroge un registre central pour retrouver l'ID du restaurant et il construit la page à la volée. C'est l'essence même du principe DRY, Don't Repeat Yourself [?], poussé à sa perfection opérationnelle.

**Karma :** Ok, mais si vous avez déjà conçu des architectures d'entreprise, vous savez que réunir l'administration système et l'accès public des clients finaux dans le même répertoire de déploiement, c'est un pari extrêmement audacieux. Pour ne pas dire téméraire.

**Camilla :** C'est calculé.

**Karma :** Peut-être, mais le vrai problème ne commence pas à l'interface, il commence à la racine. La base de données. Dans la documentation même du projet, le document « projet tiré SAS » [?], on trouve un aveu qui m'a littéralement fait bondir. L'architecte explique qu'au départ, il préconisait l'usage de PostgreSQL.

**Camilla :** Qui est une base relationnelle.

**Karma :** Voilà, une base relationnelle robuste, ce qui est idéal pour ce type de besoin.

**Camilla :** Et il a changé d'avis pour Firebase.

**Karma :** Oui mais regardez la justification. Il écrit noir sur blanc l'avoir fait uniquement parce qu'il maîtrise Firebase et qu'il développe seul. C'est tout. Il a sciemment mis de côté l'outil structurellement le plus adapté, au profit de celui qui lui offrait le plus de confort immédiat.

**Camilla :** Bah, le confort pour un développeur solo...

**Karma :** Alors réfléchissons juste à la nature de la donnée d'un restaurant. Vous avez des établissements qui ont des catégories, qui contiennent des articles, avec des prix, liés à des tables, elles-mêmes liées à des commandes. C'est la définition même d'une donnée relationnelle. Choisir une base de données orientée documents comme Firestore, où l'on doit imbriquer tout cela dans des collections complexes, c'est déjà discutable, mais le faire dans un contexte multi-locataire, c'est là que le fameux pilier central commence à se fissurer sérieusement. Regrouper tous les établissements, les restaurants, les hôtels, les maquis, dans un même arbre Firestore, ça centralise les risques de fuite de données entre clients.

**Camilla :** Je ne suis pas convaincu(e) par ce raisonnement car je ne dirais pas que le pilier se fissure. Je dirais qu'il est renforcé par le code métier. Vous attaquez ce choix en parlant de confort, mais dans la vie d'une startup, le confort d'un développeur solo, c'est littéralement la survie du projet.

**Karma :** Oui enfin...

**Camilla :** Non mais le meilleur choix technique sur le papier ne vaut strictement rien s'il t'empêche de lancer le produit. Avec Firebase, la synchronisation en temps réel pour l'arrivée des commandes en cuisine, elle était native.

**Karma :** C'est vrai. Le temps réel de Firebase est magique, je l'accorde. Mais parlons de la sécurité de ces données. Le chemin principal dans la base, c'est Establishments/l'identifiant. Ça veut dire que dans le même arbre NoSQL, t'as les commandes confidentielles de l'hôtel de luxe et les menus du petit maquis du coin de la rue.

**Camilla :** Oui mais... [chevauchement, peu audible]

**Karma :** Avec PostgreSQL, on aurait pu isoler la donnée. On aurait pu créer des schémas séparés par client, ou au strict minimum utiliser le Row Level Security, le RLS, qui garantit au niveau même du moteur SQL qu'une requête ne peut mathématiquement pas lire les données d'un autre client. Ici, on confie toute cette ségrégation vitale au code de l'application.

**Camilla :** Mais attends, étudions concrètement la façon dont cette ségrégation est orchestrée, parce que c'est très loin d'être amateur. L'architecture a établi ce que j'appellerais une forteresse à porte unique. La documentation est formelle là-dessus. Aucun composant visuel, aucune page du navigateur ne parle jamais directement à la base de données. Il y a une règle stricte. Seul le fichier lib/db parle à Firestore [?].

**Karma :** C'est une bonne pratique de centralisation de l'accès [?], certes.

**Camilla :** C'est bien plus qu'une bonne pratique. C'est un sas de haute sécurité. Regarde la mécanique interne. Quand une demande arrive, disons un gérant qui veut modifier un prix, la requête frappe à cette porte unique. Avant même que Firestore ne soit sollicité, le serveur Node.js déclenche une validation impitoyable avec la librairie Zod.

**Karma :** Hum.

**Camilla :** Comment ça marche ? Zod vérifie la forme mathématique et le type des données reçues. Si on attend un prix en format numérique et qu'un attaquant envoie une chaîne de caractères ou un script malveillant, paf ! Zod coupe la connexion instantanément.

**Karma :** Oui, le typage strict [?].

**Camilla :** Ensuite, on vérifie le jeton de session. Ensuite, on vérifie que l'utilisateur appartient bien à l'établissement ciblé. Ensuite, on vérifie si son rôle lui permet de modifier un prix. Ce n'est qu'après tout ce parcours du combattant que la base de données est modifiée. Est-ce que cette rigueur architecturale côté serveur ne vaut pas autant qu'une stricte séparation des bases ?

**Karma :** Je l'aborde d'une manière différente. Vous décrivez un très beau filtre applicatif, c'est indéniable, mais vous esquivez la réalité du risque humain. Confier la ségrégation des données au code métier plutôt qu'à la structure de la base, c'est jouer à la roulette russe logicielle.

**Camilla :** Roulette russe, c'est un peu fort [?].

**Karma :** Ah non, mes développeurs sont humains [?]. Imaginez qu'à la suite d'une nuit blanche [?], ce développeur solo ajoute une nouvelle fonction de statistiques dans ce fameux lib/db et oublie juste une fois de filtrer explicitement par l'identifiant de l'établissement. Que se passe-t-il ?

**Camilla :** Le test est chaud [?].

**Karma :** S'il a écrit le test. Sinon, la requête s'exécute, Firestore obéit aveuglément, et soudain, le maquis a accès aux chiffres d'affaires de tous les autres restaurants de la plateforme. Dans une architecture pérenne, la base de données, c'est le dernier rempart absolu. Ici, on a retiré ce rempart pour aller plus vite.

**Camilla :** Sauf que cette vitesse, elle permet des prouesses techniques qui seraient un cauchemar dans une architecture hyper fragmentée. Prenez la gestion du cycle de vie des abonnements. C'est l'un des aspects les plus ingénieux de ce système.

**Karma :** Vous parlez de l'absence de tâches...

**Camilla :** Exactement. Habituellement, pour gérer des abonnements avec des statuts, genre période de grâce, actif ou suspendu, on met en place des cron jobs, des tâches de fond planifiées qui tournent chaque nuit à minuit, balaient toute la base de données, vérifient qui n'a pas payé et mettent à jour une colonne statut. C'est lourd, ça échoue souvent silencieusement et ça consomme des ressources inutiles. Yéboué Tech a tout bonnement supprimé ce besoin.

**Karma :** Je dois admettre que la mécanique mathématique derrière ça est très intéressante.

**Camilla :** Elle est brillante. L'abonnement n'a pas de statut stocké en base de données. Il n'a qu'une date d'expiration. Quand un client scanne un menu, à cet instant précis, à la volée, le système compare le timestamp actuel avec la date d'expiration en base. Si c'est dépassé de moins de 7 jours, hop ! Statut « en grâce ». On affiche le menu. Ça élimine toute une classe de bugs d'états désynchronisés. Mais bon, cela nous amène logiquement au point qui soulève le plus de passion dans cette doc, la stratégie de cache.

**Karma :** Ah, la stratégie de cache. Le fameux pansement technique de ce projet.

**Camilla :** Un pansement ? C'est un coup de génie ! C'est le bouclier tactique qui permet à l'entreprise d'exister. Explorons le problème. Si 400 clients scannent des menus avant de [?] dans un maquis, que chaque menu a 50 plats, et qu'on lit Firestore à chaque fois...

**Karma :** La facture cloud détruit la rentabilité de la startup. Parce que Firebase facture au nombre de documents lus. C'est leur modèle économique, tout simplement.

**Camilla :** Précisément. L'architecte a donc mis en place une logique de cache ultra agressive, grâce au rendu statique incrémental de Next.js, le fameux ISR. La première fois qu'un client scanne le menu de la journée, le serveur lit Firestore, compile les données, génère la page HTML et surtout, il la stocke dans le CDN. La page pèse alors moins de 150 Ko. Pour les 399 clients suivants de la soirée, la requête ne touche plus jamais le serveur Node.js ni Firebase. Elle est servie quasi instantanément. Vider le cache uniquement lors de la modification du menu par le gérant, ça garantit aux clients une page toujours à jour, tout en contournant l'alerte de budget Firebase.

**Karma :** C'est un argument convaincant sur le papier, mais avez-vous considéré l'hérésie conceptuelle de la chose ? Concevoir une architecture entière autour du contournement du modèle économique de son propre fournisseur cloud, c'est fou ! Firebase brille par la synchronisation en temps réel, c'est sa raison d'être. L'utiliser comme un simple stockage statique qu'on n'ose pas lire directement, c'est un aveu d'échec de la pile technologique initiale.

**Camilla :** La fondation n'est pas mauvaise, elle est hybride. Le temps réel est utilisé pour les commandes en cuisine et le cache statique pour la lecture du menu public. C'est [?] le meilleur des deux mondes.

**Karma :** Je suis désolé, mais je n'y crois pas. Laissez-moi vous dire pourquoi. Le problème de ce monde hybride, c'est que la survie financière de l'entreprise est mortellement couplée à un mécanisme de cache applicatif. Si, suite à une mise à jour, la logique d'invalidation du cache échoue, c'est binaire. Soit le cache reste bloqué, les clients commandent des plats en rupture de stock, bonjour les dégâts en salle. Soit le cache saute complètement, toutes les requêtes transpercent le bouclier, frappent Firestore de plein fouet et la flambée de [?] trafic ruine le développeur en quelques heures.

**Camilla :** Sauf que les quotas stricts de l'API protègent contre ça. Et cette approche monolithique dont vous soulignez tant les risques, c'est précisément ce qui rend la maintenance de ces quatre-vingts modèles de page de menu possible pour une seule personne.

**Karma :** Nous y voilà, l'application unique, le monolithe.

**Camilla :** Et c'est une merveille de factorisation. Le produit a des designs drastiquement différents. Du modèle Palace pour les grands hôtels, au design Baka [?] pour les maquis. Et pourtant, le site vitrine, le tableau de bord et les menus partagent les mêmes composants. Si le développeur découvre un bug dans le calcul de la TVA, il corrige une ligne de code [?], il déploie et instantanément les 80 modèles sont corrigés. Diviser cela en microservices aurait été une charge de travail inhumaine. C'est l'essence même du DRY.

**Karma :** Mais cette mutualisation idyllique, elle masque un cauchemar opérationnel. Le fameux single point of failure, le point de défaillance unique. Une erreur fatale lors d'une mise à jour de l'administration, sur /admin par exemple, pourrait potentiellement faire tomber l'ensemble des menus publics de tous les restaurants en plein service.

**Camilla :** Parce que tout tourne sur le même processus ?

**Karma :** Exactement. Ils partagent le même environnement [?], le même event loop de Node.js. Vous mettez à jour la vue des paiements, il y a une fuite de mémoire, le serveur plante. L'outil interne crashe, OK. Mais soudainement, le client à table au restaurant, qui n'a rien à voir avec l'administration, scanne son QR code et reçoit une erreur 502. Le service entier, à l'échelle du pays [?], s'effondre. Une séparation en microservices aurait confiné l'échec. Ç'aurait été une preuve de maturité.

**Camilla :** Mais la maturité pour un développeur solo, c'est d'abord de ne pas s'enliser sous le fardeau cognitif de l'infrastructure. Le risque de faire tomber le serveur existe, oui, mais il est réduit par les tests automatisés. Et surtout, le développeur a intelligemment déporté l'effort de calcul hors du serveur central, vers les périphériques [?].

**Karma :** Vous parlez de l'optimisation des images ?

**Camilla :** La gestion des photos des menus. Quand un restaurateur ajoute une photo de 5 Mo depuis son téléphone, dans une architecture classique, le serveur s'épuiserait à la redimensionner, ce qui saturerait l'event loop dont vous parlez. Chez Yéboué Tech, le navigateur du téléphone intercepte la photo. Il utilise un canvas HTML5 local, redimensionne l'image, l'encode en WebP ultra compressé, et n'envoie au serveur que deux petits fichiers de quelques kilo-octets. Le serveur ne fait que passe-plat. C'est brillant pour rendre un monolithe viable sans faire exploser la mémoire.

**Karma :** Je vous l'accorde, l'astuce de l'encodage WebP côté client est très élégante. C'est une excellente décentralisation. Mais bon, ça ne résout pas la vulnérabilité structurelle du système en cas de crash du noyau applicatif. C'est un très bel aménagement à l'intérieur d'un bâtiment dont les fondations restent incertaines.

**Camilla :** Moi, il est temps de mettre nos analyses en perspective, je pense. De mon point de vue, le projet Yéboué Tech reste une leçon magistrale de pragmatisme. C'est la preuve qu'un développeur solo réussit à utiliser une architecture monolithique, couplée au cache statique de Next.js, pour concevoir un système ultra rapide de moins de 150 Ko. C'est économique, cohérent, et ça contourne intelligemment les contraintes de Firebase en maximisant les outils qu'il maîtrise.

**Karma :** Et de mon côté, je maintiens que ce pragmatisme apparent privilégie le confort immédiat du développeur au détriment de principes d'ingénierie pérenne. Il a généré un système très couplé, où la pérennité financière repose sur une rustine applicative, le fameux cache. Ça rend la plateforme vulnérable aux spécificités de facturation de Firebase, là où PostgreSQL aurait offert la vraie compartimentation dont un SaaS multi-locataire a besoin.

**Camilla :** S'il y a bien un point où nos analyses convergent, par contre, c'est sur la vélocité. Le délai de mise sur le marché, le time to market, garanti par ce modèle, est juste imbattable.

**Karma :** C'est indéniable. L'objectif était de lancer vite, le pari est tenu. Et je salue aussi les garde-fous posés, comme l'interdiction au navigateur d'accéder directement au storage. Ça témoigne d'une véritable réflexion sur la sécurité au périmètre [?].

**Camilla :** Et bien nous conclurons notre exploration d'aujourd'hui en vous laissant le soin, chers auditeurs, de tirer vos propres conclusions sur ce compromis délicat entre vélocité de développement et perfection architecturale. Il y a encore beaucoup à analyser dans ce projet, c'est sûr.

**Karma :** Ok, oui.

**Camilla :** Merci de nous avoir accompagnés dans ce débat et à très bientôt. [attribution incertaine]

---

## Notes de fiabilité

- La transcription a été produite par reconnaissance vocale automatique (modèle Whisper « small »), puis relue et corrigée à partir de deux passes de transcription. Ce n'est pas une transcription humaine mot à mot garantie.
- **Termes techniques corrigés** quand l'erreur était évidente : SaaS, Yéboué Tech, PostgreSQL, Row Level Security, NoSQL, multi-locataire / multi-tenant, routage, statut, cache, pansement, 150 Ko, 5 Mo, WebP, canvas, microservices, garde-fous, crash, DRY (Don't Repeat Yourself).
- **Marqués [?]** : passages dont le sens est deviné d'après le contexte (par exemple « pilier central en béton », « nuit blanche », « prouesses techniques », « Baka », « avant de [?] dans un maquis », « sécurité au périmètre »). Le titre de l'émission (« D-Ebade ») est mal reconnu.
- **Attribution Karma / Camilla** : faite automatiquement par hauteur de voix et empreinte vocale. Les très courtes interjections (« Hum », « Oui enfin... », « Exactement », « Oui, le typage strict ») et les chevauchements de voix peuvent être mal attribués ou manquer.
- Les hésitations, les répétitions et les mots de remplissage de l'enregistrement ne sont pas tous restitués.