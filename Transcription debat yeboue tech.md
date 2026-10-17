# Transcription du débat — « L'architecture sous contrainte de Yéboué Tech »

*Durée : 21 min · Intervenants : **Karma** (voix masculine) et **Camilla** (voix féminine)*

> **Note sur la fiabilité.** Transcription automatique (modèle Whisper small), non relue à l'oreille. Elle suit de très près ce qui est dit, mais quelques mots peuvent être mal reconnus (voir la liste en fin de document). L'attribution des répliques à Karma ou Camilla repose sur l'analyse des voix ; elle est fiable sur les longues prises de parole, moins sur les interjections très courtes (« Exactement. », « Voilà. »), qui peuvent parfois être rattachées à l'autre intervenant. Le nom du produit, mal reconnu par moments, a été harmonisé en « Yéboué Tech ».

---

**Karma :** Bienvenue dans The Debate. Aujourd'hui, on vous propose une analyse croisée, vraiment rigoureuse, des choix architecturaux d'un tout nouveau produit. Et pour poser le décor, imaginez un instant un maquis ou rien.

**Camilla :** Une ambiance classique du vendredi soir, j'imagine.

**Karma :** Exactement. Un vendredi soir bondé. Vous avez disons 60 tables. Les commandes s'enchaînent dans un vacarme infernal, les serveurs courent dans tous les sens, et bien sûr, la connexion 3G du quartier est au mieux qu'appricieuse. C'est moi qu'on puisse dire. Voilà. Et si le système de prise de commande lâche à ce moment très précis, eh bien le restaurant perd purement et simplement la recette de sa soirée. Alors la question c'est, comment est-ce qu'on conçoit un système de menu digital capable de survivre à ce chaos ? surtout quand on est un développeur fonctionnant totalement en solo.

**Camilla :** Et avec un budget d'infrastructures proche du zéro absolu.

**Karma :** C'est ça. Donc aujourd'hui nous décortiquons l'architecture de Yéboué Tech. C'est un SaaS Ivoirien qui permet aux établissements de restauration de générer des menus interactifs via QR-Code. Et je dois dire que c'est un cas d'étude fascinant. Le développeur a pris des décisions radicales. Il utilise Firebase au lieu d'une bonne vieille base de données SQL. Il impose une mise en cache très agressive au risque de désynchroniser les données. Et ils codent carrément en dur des dizaines de modèles d'interface utilisateurs. C'est vraiment un cas qui

**Camilla :** nous pousse dans nos retranchements, je trouve. Parce que ça illustre parfaitement ce qui se passe quand en fait les contraintes

**Karma :** économiques dictent la moindre ligne de code. Exactement. Et la question centrale de notre discussion, c'est de savoir si ce pragmatisme absolu est, en fin de compte, un coût de génie stratégique pour conquérir un marché émergent, ou bien si ça crée inévitablement une dette technique qui va faire imploser le système L'élégance n'est de la nécessité absolue. Ah, l'élégance carrément. Oui, chaque choix technique répond à une réalité financière locale. C'est du sur mesure pour son marché.

**Camilla :** Alors, je reconnais volontiers la fulgurance du lancement. C'est super astuciux pour sortir un produit de terre en quelques mois. Mais je l'aborde sous un angle un peu différent. Je soutiens pour ma part que les fondations mêmes de ce système imposent des vulnérabilités structurelles profondes. En fait, en forçant des données purement relationnelles dans un système NoSQL, et en multipliant les bidous et les contournements pour éviter les coûts, ces choix vont se transformer en un mur infranchissable. Face à la complexité croissant du produit, ça ne tiendra pas.

**Karma :** Je vois tout à fait pourquoi vous pensez cela, mais permettez-moi de vous offrir une perspective différente sur cette prétendue vulnérabilité. Ce que vous vous appelez des contournements.

**Camilla :** Des bidouilles.

**Karma :** Des bidouilles, si vous voulez. Et bien, je les vois comme une parfaite adéquation au marché. C'est-à-dire que pour un développeur solo, le fait de s'enfermer dans l'administration d'un cluster post-gruie SQL, gérer les migrations de schémas complexes, configurer des réplicats, c'est la mort assurée du projet. Bien avant de signer le premier client. Il a choisi Firebase simplement parce qu'utiliser un outil qu'on maîtrise parfaitement, ça permet de livrer un produit fiable et de livrer vite.

**Camilla :** Oui, d'accord pour la vitesse.

**Karma :** Mais le vrai défi, on est d'accord, c'est le modèle de facturation de Firebase puisque ça facture à la lecture du document.

**Camilla :** Et c'est exactement là que le bas blesse. Firebase est pour moi structurellement toxique pour les données d'un restaurant. Enfin, réfléchissez-y deux secondes. L'écosystème d'un restaurant est fondamentalement et ontologiquement relationnel. Vous avez un établissement. Bon, cet établissement, il a des catégories de plats. Ces plats appartiennent à des commandes. Ces commandes sont passées par des clients spécifiques. Et tout ça doit alimenter des statistiques croisées.

**Karma :** Oui, c'est un arbre de données assez classique.

**Camilla :** Exactement. et essayer de faire entrer toute cette hiérarchie complexe dans Firestore, qui est, rappelons-le, une base orientée d'Ocuments. Eh bien, ça relève de la contention architecturelle absolue.

**Karma :** C'est vrai, je vous l'accorde. La modélisation en OSQL exige une gymnastique mentale un peu différente. Faut tout début. Je vous avoue que j'étais perplexe en voyant comment une gérer par exemple l'historique des prix. Ah bah oui, parlons-en. Voilà. S'il n'y a pas de clés étrangères, pas de table de jointures, comment est-ce qu'on garantit qu'une commande, disons, passé le mois dernier, conserve le bon prix ? Et en lisant la spec, j'ai réalisé la parade. Il duplique littéralement la donnée. Au moment exact où la commande est validée, le nom et le prix de l'article sont copiés. Ils sont figés dans le document de la commande elle-même. C'est d'une certaine manière une implementation artisanale du CQRS, non ? On précalcule et on fiche l'État au moment de l'écriture.

**Camilla :** Oh non, c'est une façon très très généreuse de décrire une simple dénormalisation forcée. Vous trouvez ? Je suis désolé, mais je n'y crois pas une seule seconde à cette élig Laissez-moi vous expliquer pourquoi cette duplication manuelle est une vraie bombardement. Regardez comment il est obligé de gérer les statistiques par exemple. Parce qu'il est impossible de faire des requêtes d'agrégation complexe et peu coûteux sur Firebase. Enfin, on peut pas faire un simple select sum sans payer pour la lecture de chaque ligne. On est bien d'accord ?

**Karma :** Oui, c'est la contrainte du modèle tarifaire, tout à fait.

**Camilla :** Donc, qu'est-ce qu'il fait ? Il est contraint de créer des compteurs d'incrément C'est un document unique, par jour, qui compte artificiellement les scans du QR code, les commandes, les revenus. C'est une béquie monumentale.

**Karma :** Attendez, c'est extrêmement efficace pour la lecture. La page de statistique du gérant, elle charge instantanément. Pourquoi ? Parce qu'elle ne lit qu'un seul et unique document.

**Camilla :** Oui, aujourd'hui, oui. Ça marche aujourd'hui. Mais les clients premiums, ceux qui payent, disons, 25 000 francs et F à par mois pour le service, ils ne vont pas se contenter indéfiniment de petits compteurs statiques. Le jour où un gérant voudra croiser ses données de vente sur plusieurs mois, ou bien filtrer par zone de livraison, analyser les tendances par tranches horaires dynamiques. Les fameuses requêtes analytiques lourdes. Voilà. Ce modèle de compteur précalculé va tout simplement s'effondrer. On ne peut pas interroger une donnée qui a déjà été écrasée dans une moyenne quotidienne. La donnée brute, elle est perdue pour l'analyse. Et pour moi, cette fragilité, elle s'étend aussi à sa fameuse stratégie de cache front-end, qui soit-disant, censé sauver son budget Firebase.

**Karma :** Alors, c'est un point très intéressant. Bien que je le formulerai autrement, je ne dirais pas que la stratégie de cache de Next.js sauve le budget. Je dirais plutôt qu'elle l'immunise complètement. L'immunise ? Oui. Vra conceptuellement. Réfléchissez au modus d'un restaurant. Il est statique quoi, 99% du temps. Donc en générant la page côté serveur une seule fois et en la mettant en cache, vous pouvez avoir 1000 scans successifs d'un QR code sur une table. Ça ne coûtera qu'une seule et unique lecture dans la base Firestore. C'est une barrière protectrice incroyable.

**Camilla :** Bon, ça, c'est l'argument théorique. Et sur le papier c'est très beau. Mais avez-vous envisagé la règle métier d'invalidation de ce cache ? C'est-à-dire ? Bah, pour que le client en salle ne commande pas un plat qui est devenu indispensable, le document stipule que le système vide l'intégralité du cache de l'établissement à chaque modification du menu. Oui, c'est la règle de sécurité. Mais pensez au contexte dont on parlait tout à l'heure. Un vendredi soir, l'activité est frénétique Marquer une rupture de stock, ça se fait en un seul clic sur la tablette du gérant. Mais à la seconde précise où ce bouton est pressé, le cache entier est détruit, en plein coup de feu.

**Karma :** Je comprends, tu t'as fait l'inquiétude, oui. C'est le spectre du fameux cache stampede,

**Camilla :** la rue vers le cache. Exactement. Et ce n'est pas juste une petite baisse de performance passagère, hein. Imaginez que le serveur s'apparente au videur d'une boîte de nuit très prisée. Ce videur, il filtre parfaitement les requêtes à l L'invalidation du cash, c'est comme si on remplaçait ce videur en pleine soirée. Pendant les deux secondes où la porte est sans surveillance, en attendant que le nouveau videur s'installe, Tout le monde rendra. Voilà, 500 personnes s'engouffrent en même temps dans le club et submergent le pauvre barman. Et le barman ici, c'est notre base de données Firestore. Chaque client qui scanne le menu à cet instant précis va déclencher une reconstruction complète de la page. Ça va générer des dizaines voire des centaines de requêtes de lecture en parallèle. Le mécanisme qui est censé protéger le budget, il disparaît au moment exact où il est le plus crucial.

**Karma :** C'est une image excellente, le coup du videur. Vraiment. Mais laissez-moi prolonger un peu votre métaphore. Oui, c'est vrai, pendant ces deux secondes, la foule rentre dans le club. Mais posez-vous la question. Qu'est-ce qui coûte le plus cher et qu'est-ce qui s'atture vraiment la bande passante dans un menu digital ? Les images, évidemment.

**Camilla :** Absolument.

**Karma :** Ce n'est pas le texte. Ce ne sont pas les prix des plats. Ce sont les photos. Et ici, notre développeur a pris une décision architecturale qui contourne brillamment ce risque de stampede. Les photos ne sont jamais, au grand jamais, servies par Firestore, ni même par le serveur Next.js.

**Camilla :** Oui bon, elle passe par un CDN externe, c'est plutôt standard aujourd'hui.

**Karma :** Non, c'est bien au-delà du standard. C'est presque du traitement participatif. Quand le gérant ajoute la photo d'un nouveau plat, ils ont depuis son téléphone portable. Ce n'est pas un serveur distance sur AWS qui va s'amuser à compresser l'image. Le développeur utilise l'API Canvas directement dans le navigateur du téléphone du gérant. C'est C'est le processeur du smartphone de l'utilisateur qui compresse l'image en WebP. Qui la redimensionne en 400 et 1200 pixels. Et tout ça avant même de l'envoyer sur le réseau. D'accord. Ensuite, ces images sont hébergées sur Firebase Storage, avec un cache HTTP forcé à un an. Un an. Il externalise littéralement sa puissance de calcul sur les appareils de ses propres clients. Donc, même quand le videur change, comme vous dites, et que le cache HTML saute, les énormes requêtes d'image sont déjà absorbées par les navigateurs des clients en salle. La base de données, elle, reste parfaitement isolée du vrai trafic lourd.

**Camilla :** Bon, je l'admets, c'est un argument convaincant. Confier le redimensionnement d'image au client pour économiser le CPU du back-end, c'est une manœuvre de guérilla logicielle très maline. Je vous l'accorde, mais si vous m'accordez de votre côté, que l'externalisation du calcul vers le client et sa stratégie principale de survie, eh bien, sa stratégie frontaine est totalement contradictoire.

**Karma :** Contradictoire, dans quel sens ?

**Camilla :** Il gagne du temps et des ressources sur le backend pour se créer un véritable enfer de maintenant sur le front-end.

**Karma :** Ah, vous faites référence à la diversité des interfaces proposées au restaurant.

**Camilla :** Je fais référence à l'explosion combinatoire de ces interfaces. Si vous êtes développeur réacte et que vous nous écoutez en ce moment, vous êtes probablement en train de hurler devant votre poste. Le document prévoit de passer de 10 modèles actuels à 80 modèles de pages totalement distincts, 80. Et on ne parle pas juste de changer un fichier CSS ou deux, trois variables de couleur. Non, ce sont des expériences sur mesure. C'est le cas de le dire. Il propose un modèle nommé Gbacca, avec littéralement des roues de mini-bus

**Karma :** ivoirien qui tourne physiquement à l'écran quand on fait défiler la page. Un autre,

**Camilla :** appelé "titrologie", Mais sur le plan de l'ingénierie, c'est purement et simplement suicidaire. Maintenir 80 composants réactes uniques, qui embarquent chacun leur propre librairie d'animation complexe, genre GESAP ou Frammer Motion, avec des hiérarchies d'hommes structurellement différentes. Enfin, le jour où il doit ajouter une fonctionnalité transversale, je ne sais pas, disons, la gestion des options végétaliennes, ou un système de pourbois.

**Karma :** Oui, une nouvelle fonctionnalité globale.

**Camilla :** Voilà. Il va t'a juste modifié un seul fichier centralisé. Il va devoir plonger dans 80 bases de code différentes. Il devra s'assurer que le bouton de pourbois ne casse pas la fameuse animation des roues du Jabaka. Vérifier que le texte s'affiche bien dans les colonnes serrés du modèle de titrologie. C'est une dette technique exponentielle.

**Karma :** Je vois très bien pourquoi vous pensez cela. Et pour être tout à fait honnête, quand j'ai vu ce chiffre de 80 templates, j'ai eu exactement la même réaction initiale que vous. Je me suis dit, ce type court droit à sa perte. Ah, on est d'accord. Attendez, attendez. Et puis, j'ai regardé de beaucoup plus près comment le flux de données était orchestré en interne. N'est-ce pas là la définition même d Ces 80 modèles en fait, ils ne contiennent strictement aucune logique métier. Enfin, ils doivent pourtant bien gérer l'état du panier, la jouer des articles, ce genre de choses, non ? Justement, non. Ce sont de purs composants de présentation. Ce qu'on appelle dans le jargon des composants d'hommes ou composants bêtes. ils se contentent de recevoir des données déjà préformatées. Toute la logique complexe, c'est-à-dire le moteur du panier d'achat, le calcul des taxes et des taux taux, la fiche détaillée de l'article et surtout, surtout, le module de suivi de commande en temps réel, eh bien tout ça est extrait dans ce qu'il appelle des pièces communes.

**Camilla :** D'accord, des composants partagés. Voilà.

**Karma :** Ces briques logiques sont codées une seule et unique fois. Le modèle à Wallet ou le modèle Baka ne sont au final que des coquilles vides visuelles qui importent ces pièces communes. Donc, le fait d'ajouter un 81e modèle ne crée en réalité aucune dette sur la logique fondamentale du logiciel. C'est simplement un nouvel habillage de

**Camilla :** Un habillage qui interagit quand même avec des éléments partagés dans le navigateur. Si vous modifiez le composant partagé du panier, disons pour inclurer un chant texte permettant de laisser des notes pour le chef, vous allez forcément modifier la largeur ou le comportement de ce composant. Et soudainement, cette nouvelle largeur fait exploser la mise en page CSS de 45 de vos 80 modèles soigneusement animés.

**Karma :** L'isolation n'est jamais, jamais parfaite dans le Dome.

**Camilla :** C'est à risque, il n'y a rien en web, je vous l'accorde. Mais bon, laissons la présentation de côté un instant, si vous voulez bien. Et attaquons-nous au véritable...

**Karma :** C'est amusant que vous abordiez l'État, parce que c'est très précisément là que j'ai trouvé une de ses solutions les plus élégantes. En étudiant sa gestion des abonnements mensuels des gérants, je me demandais où tourner ces cron jobs. Ah oui, l'étage planifié. Vous savez, l'approche hyper classique. Vous avez un abonnement qui expire ce soir à minuit, donc vous devez faire tourner une tâche planifiée sur un serveur. Ce script va scanner toute la base de données, trouver les abonnements expirés, échanger activement leur statut de "actif vers limité" ou "periode de grâce".

**Camilla :** Oui, avec toutes les joies habituelles que ça implique. Gérer les fuseaux horaires, gérer les panne silencieuses du script de minuit, coder des tentatives de relance automatique. Un très très grand classique de la dette opérationnelle, en effet.

**Karma :** Eh bien, la beauté de la chose, c'est qu'il n'y a aucun cron job. Absolument aucun. J'ai été bluffé de réaliser que l'état de l'abonnement n'est physiquement stocké nulle part en base. il applique un principe très strict d'OTA dérivé, le derived state, directement au niveau de l'API. À chaque fois qu'un gérant se connecte ou qu'un client scane un menu, le serveur fait un truc très simple. Il compare la date de fin d'abonnement, qui est une donnée fixe, avec la date actuelle. L'état expiré est calculé à la volée, en une milliseconde. C'est une réduction drastique de la surface d'erreur. L'état ne peut littéralement pas se désynchroniser. puisqu'il n'existe même pas en tant que donné persisté.

**Camilla :** Bon, c'est un argument convaincant. Mais avez-vous envisagé un instant comment ce purisme du calcul à la volée se fracasse contre la réalité brutale du service en salle ? Comment ça ? Je vous accorde que l'état dérivé fonctionne à merveille pour vérifier la validité d'un abonnement mensuel très très propre. Mais le cœur de la proposition de valeur de Yélo Café, ce qui justifie que le client paie son abonnement le plus cher. c'est la gestion des commandes en temps réel. Une commande, elle passe de nouvelles à accepter, puis en préparation, jusqu'à être servie. Là, on n'est plus du tout dans le petit calcul de date à la volée. On est dans de la persistance d'états lourdes.

**Karma :** Bien sûr, l'état de la commande doit être partagé, en direct, entre le client à sa table et le cuisinier derrière ses fourneaux.

**Camilla :** Oui. Et comment est-ce qu'il partage cet état ? Le document nous dit que le personnel en cuisine utilise une tablette qui écoute la base de données Firestore en direct via des websockets. Et c'est là que le modèle du développeur solo devient, pour moi, très dangereux. Pourquoi dangereux ? Maintenir un flux websocket ouvert, de façon continue, c'est extrêmement gourmand. Multipliez ça par des centaines d'établissements. Des établissements qui laissent une tablette allumer toute la journée. Posées dans une cuisine surchauffée. Connectées à un réseau 3G africain qui flutue en permanence. Vous vous retrouvez avec des milliers de connexions persistantes qui s'ouvrent, se ferment, tombent en time out, de façon complètement silencieuse, et qui tentent de se reconnecter en rafale.

**Karma :** Oui, mais Firebase gère cette reconnection nativement de manière très robuste.

**Camilla :** Je suis désolé mais je n'y crois pas une seule seconde. Toute personne qui a déjà déployé des websockets sur des réseaux mobiles instables, c'est pertinemment que la librairie cliente finit toujours par avoir des trous. Si on compare ça à un système à synchrone beaucoup plus résilient, comme des webhooks, ou même un simple rafraîchissement à HTTP régulier et le fameux polling, il choisit délibérément la technologie la plus complexe à maintenir au niveau réseau. Si la connexion WebSocket lâche et que la tablette ne s'en rend pas compte, le client sale voit sa commande valider sur son écran, il a peut-être même déjà payé, mais l'écran de la cuisine, lui, reste dramatiquement vide. C'est une rupture de confiance catastrophique pour le restaurateur.

**Karma :** Je ne suis pas totalement convaincu par ce raisonnement car vous omettez la dimension temporelle du besoin. Dans un fast-food ou un maki bondé à bidjan, l'instantanéité, ce n'est pas un luxe. C'est un pré-requis absolu. Le cuisinier, il a littéralement les mains dans la Il ne peut pas s'essuyer les mains pour cliquer sur un bout et un polling HTTP toutes les 30 secondes, c'est 30 secondes de trop quand vous avez 10 personnes qui font l'accueil au comptoir. La commande doit déclencher un signal sonore à la milliseconde exacte où elle est validée. Et Firebase a été conçu historiquement, spécifiquement, pour ce type de synchronisation d'états en temps réel. Hum. De plus, n'oublions pas la mise en cache locale de Firebase, qui permet au gérant de continuer à consulter l'état des commandes, même pendant une micro coupure internet de quelques secondes, et de resynchroniser tout

**Camilla :** ça de façon totalement transparente dès que le réseau revient. L'intention de l'instantanité est louable, je vous l'accorde bien volontiers, mais je maintiens que l'infrastructure réseau requise pour soutenir des websockets fiables à l'échelle d'un pays entier, avec une énorme disparité de couverture internet, c'est un point

**Karma :** de défaillance majeure pour un SaaS Bitubi critique comme... Mais si on prend un peu de recul sur l'ensemble de notre discussion, je crois que tous ces choix, qu'il s'agisse des WebSockets, des modèles isolés, de l'externalisation de la compression d'image ou de ces fameux statistiques précalculés, dessinent pour moi une architecture d'une rare lucidité entreprenutriale. Le développeur, il ne vend pas son logiciel à des multinationales. Il cible des abonnements comprés entre 10 000 et 25 000 Français FA. À ce prix-là, il ne peut absolument pas se permettre d'absorber 500 euros de serveurs AWS par mois. Donc l'utilisation de Firebase, couplée à Next.js, et cette idée brillante d'utiliser des QR codes statiques qui embarquent des URL paramétrés plutôt que des systèmes de redirection coûteux, tout ça permet de maintenir les coûts d'infrastructures marginaux quasi nuls. Pour moi, c'est le triomphe absolu de la viabilité

**Camilla :** économique sur le purisme académique. Je l'aborde comme toujours sous un angle différent. Pour moi, ce système, c'est un formidable prototype de validation de marché, mais qui est déguisé en produit fini. Le pragmatisme, oui, c'est une philosophie d'architecture parfaitement défendable, bien sûr, mais elle a un prix. Et ce prix, tôt ou tard, s'appelle la dette technique. La fameuse dette. Oui, la fameuse dette. Les contournements que nous avons mis en lumière aujourd'hui, la rigidité d'une base de données no-esql incapable de faire des requêtes croisées nativement, le risque d'effondrement du cache pendant les heures de pointe, le cloisonnement des 80 interfaces, Tout ça va forcer ce développeur solo à une refonte complète et douloureuse de son back-end, le jour où son produit connaîtra un véritable succès à l'échelle nationale. En résumé, il a bâti une excellente cabane de survie, mais certainement pas les fondations d'un grade-ciel.

**Karma :** Et peut-être que la cabane de survie est très exactement ce qu'il lui faut aujourd'hui, pour traverser la forêt obscure des premi C'est au final le privilège exclusif des produits qui y trouvent leur marché. On gagne le droit de payer sa dette technique plus tard.

**Camilla :** C'est indéniable. C'est toujours la réalité du terrain qui finit par dicter la structure du code.

**Karma :** Je suis bien d'accord. Exactement. Et le pire, c'est que nous n'avons même pas eu le temps d'explorer certains des décisions les

**Camilla :** plus fascinantes de ce

**Karma :** document. Oui, il y en a d'autres. Je pense notamment à l'intégration à synchro une dépêment mobile via Ginnus-P. ou ce mécanisme de secours extrêmement ingénieux qui transforme un panier numérique complexe en un simple message texte formaté envoyé directement sur le WhatsApp du restaurateur si le système principal défaille. Ça c'est brillant. Des approches hybrides qui très franchement mériteraient une émission entière à elle seule. Mais bon, nous laisserons le soin à nos auditeurs de trancher par eux-mêmes sur la viabilité à long terme des fondations de Yéboué Tech.

**Camilla :** En tout cas, ce fut un échange vraiment passionnant sur les compromis inhérents à l'ingénierie. Tout à fait.

**Karma :** En fin de compte, qu'il s'agisse de bases de données relationnelles puristes ou de documents no-SQL hautement optimisés, la seule véritable métrique de succès pour ces maquilles et ces restaurants se résume à une question vertigineusement simple. Est-ce que la commande traverse ? Merci de nous avoir rejoint pour ce numéro de The Debate et continué à questionner les architectures qui vous entourent.

---

## Passages probablement mal reconnus (à vérifier à l'écoute)

Mots que je soupçonne d'être des erreurs de reconnaissance, laissés tels quels dans le texte ci-dessus :

- « qu'appricieuse. C'est moi qu'on puisse dire » → probablement « capricieuse. C'est le moins qu'on puisse dire »
- « post-gruie SQL » → probablement « PostgreSQL »
- « OSQL », « no-esql » → probablement « NoSQL »
- « base orientée d'Ocuments » → probablement « base orientée documents »
- « le bas blesse » → « le bât blesse » ; « béquie » → « béquille » ; « un coût de génie » → « un coup de génie »
- « 25 000 francs et F à » → probablement « 25 000 francs CFA » ; « Français FA » → « francs CFA »
- « Yélo Café » (début de la discussion sur le temps réel) → probablement « Yéboué Tech »
- « Gbacca », « Jabaka », « titrologie », « Ginnus-P » : noms propres de modèles ou d'outils difficiles à identifier sans l'audio
- « maquis ou rien » (introduction) : formulation à confirmer