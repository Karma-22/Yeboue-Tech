# Retranscription — « Yéboué Tech : entre génie et autosabotage »

**Karma :** Imaginez qu'on vous donne la mission de construire un gratte-ciel ultra moderne. Genre on installe la fibre optique à tous les étages, des ascenseurs magnétiques de dernière génération, des panneaux solaires intelligents.

**Camilla :** Ouais le truc parfait quoi.

**Karma :** Voilà, l'ingénierie est parfaite, c'est vraiment un chef d'œuvre. Puis, le jour de l'inauguration, on se rend compte d'un détail qui glace le sang. Personne n'a pensé à acheter le terrain sur lequel le bâtiment est construit. Ou la catastrophe. À tout moment, le vrai propriétaire débarque et il ferme les portes à clés. Exactement ça. Et aujourd'hui, on fait une plongée en profondeur dans un dossier qui illustre parfaitement cette situation. Une situation hyper courante, en fait, ce décalage entre la perfection technique interne et puis la validation.

**Camilla :** Validation stratégique sur le marché.

**Karma :** Décortiquons tout ça. Aujourd'hui, on a sur la table une pile de documents vraiment passionnante. On a accès à des dépôts GitHub bruts, des fichiers de configuration, des maquettes et des notes de développement d'un projet qui s'appelle Yeboitech. Yeboitech, c'est un logiciel SaaS, un service par abonnement ciblé pour le marché ivoirien. C'est bien ça ? Exactement. L'idée, c'est une plateforme pour créer des menus par QR code pour les restaurants, les maquis, les hôtels locaux. Et ce qu'il faut dans cette analyse, c'est qu'on regarde le travail d'un développeur. développeur qui bosse totalement en solo. C'est ça qui est fascinant. On a vraiment accès à son cerveau, en direct, via ses fichiers markdown comme architecture.md ou projet sas.md. Et franchement, en lisant ça, ça oscille en permanence entre le coup de génie absolu et l'autosabotage le plus total. C'est le grand écart permanent. Et c'est exactement ce qu'on va débattre aujourd'hui. Ces sources nous offrent une étude de cas parfaite de l'aveuglement du constructeur. Ouais, on va confronter des décisions d'architecture incroyables à des failles monumentales qui pourraient pourrait tuer le projet avant même son lancement. On commence par les fondations techniques du coup ? Allez. Dans le document d'architecture, au début, je dois avouer que j'étais complètement bluffé. Il a fait le choix d'une base de code unique en ex.js, couplée à Firebase de Google. Alors Firebase, attention, pour un développeur indépendant, c'est souvent un champ de mine. Grave. Surtout au niveau du modèle économique de leur base de données, Firestore. Parce que la facturation, elle se fait à la lecture, non ? Oui. Et c'est un tueur silencieux de start-up, ça.

**Camilla :** ça. Dans une base classique, tu paies ton serveur tous les mois, point barre. Mais avec Firebase, tu paies une micro fraction de centime à chaque fois qu'un document est lu.

**Karma :** Mettons, un restaurant crée un menu avec 50 plats différents.

**Camilla :** Voilà, et un client ouvre ce menu sur son smartphone. L'application va aller lire 50 documents distincts.

**Karma :** Ah ouais. Et si ce resto a genre 300 clients dans la journée, qui ouvre le menu deux ou trois fois pour choisir un dessert ou une boisson ? On tape vite dans les dizaines de milliers de requêtes par jour, pour un seul établissement. C'est énorme. Et si Yebutec signe 100 restaurants, la facture à la fin du mois passe de quelques centimes à des milliers d'euros. C'est la faillite par le succès en fait. C'est le pire scénario. Mais, et c'est là que le gars est fort, il a prévu une parade technique de dingue dans son document.

**Camilla :** Oui, la mise en cache agressive côté serveur.

**Karma :** Pour vulgariser, c'est un peu comme si, au lieu de cuisiner le plat à chaque commande, le serveur prenait une photo très haute définition du menu entier et ne distribuait que des copies de cette photo au client.

**Camilla :** C'est une excellente analogie. En gros, quand le gérant met à jour le prix de son poulet braisé, le serveur de Yeboe Tech interroge Firebase une fois.

**Karma :** une seule fois. Une seule fois, oui. Il génère la page complète, il la stocke en mémoire, et après qu'il y ait 10 ou 10 000 clients qui scannent le QR code le soir même, ça coûte zéro en base de données. Zéro. Franchement, pour un dev en solo, penser à cette optimisation dès la conception, c'est du travail d'orfèvre. C'est brillant. On est face à quelqu'un qui maîtrise parfaitement les coûts cloud. Mais. Mais. Le fameux mais. C'est là qu'on en revient à notre gratte-ciel sans terrain. J'ai hâte de t'entendre là-dessus. J'ai pluché le dans la section des tâches urgentes, et là, au milieu des notes super pointues, je tombe sur une ligne. Je cite : "nom de domaine pas encore acheté, à acheter avant d'imprimer le premier QR". Oh là là ! J'ai dû relire trois fois. Le mec construit une forteresse d'optimisation serveur, mais l'adresse web, le .com ou le .ci, il l'a même pas rés

**Camilla :** C'est la vulnérabilité absolue en fait. Et les conséquences sont terrifiantes si on rappelle ce qu'est vraiment un QR code

**Karma :** Bah oui, c'est juste une URL des ciné,

**Camilla :** Exactement. Les gens pensent souvent que c'est magique, connecté au clair. Non, c'est juste du texte traduit en petit carré. Une fois que tu l'imprimes, c'est gravé dans le marbre. Ça pointe vers une adresse très précise, genre yebouetek.com

**Karma :** Donc, imaginons, il démarre, il va voir des restos. Il leur montre l'appli sur une adresse temporaire. Les restos adorent, ils génèrent leur QR code. Le gérant du resto, super motivé, il investit dans de magnifiques chevalets en plexiglas gravés au laser, tu vois, pour chaque table. Et là, un concurrent, ou même juste un robot qui achète des noms de domaine en masse, voit que le nom Yebouetek commence à faire du bruit. Et paf, il achète le domaine pour 10 euros.

**Camilla :** Et c'est la mort instantanée du réseau physique. Parce que si le domaine change de main, tous ces beaux chevalets en plexiglas, dans tous les restaurants du pays, ça devient des bouts de plastique inutiles.

**Karma :** C'est fini. La connexion est rompue. Les clients scannent et tombent sur des pubs chelous. Ou sur le site d'un concurrent direct. Ce produit n'existe que pour relier la table physique au numérique. Oubliez de sécuriser le nom de domaine. C'est vraiment un déséquilibre dingue entre l'intelligence logicielle et le bon sens basique. C'est le paradoxe classique du dev qui a trop le nez dans son code. Et d'ailleurs, ce manque de cohérence, on le retrouve à un autre niveau. Très visuel cette fois. Ah oui, l'interface. On passe au design. Voilà. Dans les sources, il y a un manifeste de chartes graphiques hyper sérieux qui s'appelle l'encre et la braise.

**Camilla :** L'encre et la braise, ça fait très poétique, presque littéraire

**Karma :** C'est super solennel. Le document donne des règles ultra strictes. Il y a trois couleurs. L'encre, un bleu nuit très sombre. La braise, un orange pétant pour les boutons. Et l'ivoire pour les fonds.

**Camilla :** D'accord, très minimaliste.

**Karma :** Et surtout écoute bien Le texte interdit formellement les dégradés, les effets 3D, les halos lumineux ou tout effet de style généré par UNIA. En gros, il veut une image de marque hyper professionnelle.

**Camilla :** très rassurante pour du B2B. C'est malin, on veut séduire des gérants de resto, pas

**Karma :** On est d'accord Alors garde bien cette image de maturité en tête, parce qu'après j'ai ouvert le code source de sa page d'accueil actuelle, le fameux fichier index.html.

**Camilla :** Et j'imagine que c'est pas du tout l'

**Karma :** C'est le choc thermique. Le code est bourré de balises, avec des commentaires en majuscule du style « animation gaming ». Non, sérieusement ? Si. Il y a des classes CSS qui s'appellent « neon text » et des blocs entiers de JavaScript faits juste pour créer des effets glitchs. Tu sais, les tremblements d'images façon VHS rétro-futuriste. C'est complètement schizophrène. D'un côté, tu as un manifeste pour le minimalisme absolu, et de l'autre, un code qui crache des néons virtuels de partout. C'est comme si un grand chef étoilé avait laissé une immense enseigne clignotante, kebab ouvert 24h sur 24 au-dessus de son restaurant gastronomique par erreur. C'est exactement ça. En fait, en ingénierie logicielle, ça s'explique très facilement. Ah ouais ? Tu penses que c'est dû à quoi ? C'est du recyclage pur et dur. Un développeur solo, il n'a pas le temps, donc il a sûrement repris la base d'un de ses anciens projets perso, peut-être un portfolio ou un site de e-sport, pour démarrer Yebouetec. Ah logique. Et il n'a pas nettoyé. Voilà. Il a rédigé l'encre et la braise pour sa nouvelle vision, mais les fondations de son ancien code sont encore pleines de néons. Mais le problème, c'est que ce vieux code toxique, mais il est toujours en production. C'est vraiment symptomatique d'un produit qui est en pleine crise des entités et qui cherche encore ce qu'il veut être. Et ce manque de retenue, c'est un énorme signal d'alarme. S'il n'arrive pas à jeter du vieux code inutile sur sa page d'accueil, ça va se faire.

**Camilla :** Ça va se répercuter sur les vraies fonctionnalités. La complexité appelle toujours la complexité.

**Karma :** Écoute, ta transition est parfaite. Parce que ça nous amène au cœur du réacteur, les modèles de menus proposés au restaurant.

**Camilla :** Ah oui, le document templates.md.

**Karma :** Et là, franchement, chapeau bas pour la stratégie. C'est une masterclass d'hyperlocalisation. Yebouetek ne fait pas dans les grilles blanches et lisses qu'on voit sur les apps occidentales

**Camilla :** On s'assure que l'hyperlocalisation, c'est un avantage concurrentiel massif face aux géants mondiaux. Ils

**Karma :** les noms sont géniaux. Tu as le modèle Gbaka. Sur l'écran, le menu ressemble à la carrosserie d'un minibus local. Et écoute bien, quand tu fais défiler la page vers le bas, il y a des roues dessinées qui se mettent à tourner de plus en plus vite.

**Camilla :** C'est super ludique, j'adore

**Karma :** T'as aussi le garba. Là, les plats sont sur des assiettes en inox et des algorithmes génèrent carrément de la vapeur animée au-dessus du plat du jour

**Camilla :** Wow, ok.

**Karma :** Et c'est pas fini, t'as la titrologie, façon une de journaux d'Abidjan, et le pagne, avec des motifs wax qui bougent et un fil de couture virtuelle qui serpente autour des photos.

**Camilla :** Émotionnellement parlant, pour un gérant de maquis local, c'est imbattable. Il va s'identifier direct. Mais, et je mets ma casquette d'architecte logiciel, quand on me parle de roues dynamiques, de vapeur générée par algorithme et de fil de couture,

**Karma :** Tu transpires.

**Camilla :** Je fais des cauchemars de maintenance, ouais.

**Karma :** Que disent les sources sur la quantité de ces modèles ? Actuellement, il a 12 modèles terminés. Et combien sont prévus dans le cahier des charges au final ? 80. Il a prévu 80 templates de complexes. C'est un désastre en devenir. C'est vraiment la définition.

**Camilla :** la définition de la mise à l'échelle prématurée couplée à l'ego du développeur. Il doit utiliser des bibliothèques d'animation très lourdes pour

**Karma :** Oui, le doc mentionne que ça tourne sur GSAP et Framer Motion. Ah ben oui, évidemment. GSAP, pour schématiser, pour ceux qui nous écoutent, c'est un peu comme faire du montage vidéo image par image, mais taper directement dans le code. C'est ultra précis, mais c'est d'une rigidité folle. Et maintenir ça sur 10 modèles, c'est déjà chaud. Mais en maintenir 80, c'est du suicide pur et simple. Imaginons que Yebouetec lance le produit. Un mois après.

**Camilla :** Un mois après, une nouvelle loi oblige d'afficher des icônes d'allergène, genre "contient de l'arachide".

**Karma :** Dans un sas normal, tu modifies ta base, t'ajoutes l'icône sur le modèle principal et boum, c'est ré

**Camilla :** Sauf que là, il n'y a pas de modèle de base. Il va devoir ouvrir le code du modèle Gbaka et calculer pour que l'icône Arachid ne bloque pas la roue qui tourne. Ensuite, il ouvre le Garba et il ajuste pour que la vapeur n'efface pas l'ic

**Karma :** Au l'enfer

**Camilla :** Et ça, il doit le répéter 80 fois. C'est 80 bases de code distinctes remplies de trucs ultra sensibles qui pètent à la mo...

**Karma :** à la moindre virgule déplacée. Et c'est là que l'avantage concurrentiel se transforme en prison. Le mec s'enferme dans un labyrinthe de ouf. C'est l'archétype du développeur qui code pour son propre plaisir, en fait. Complètement. Coder de la vapeur animée, c'est intellectuellement super stimulant. Mais ça valide pas du tout le modèle économique. Oui. Pendant qu'il code à 3h du mat son 74e modèle, il y a toujours zéro client qui paye pour le service. Et c'est vraiment ça la différence entre un hobby et une entreprise viable. Ce qui nous amène d'ailleurs au vrai test de survie. Le moment. Le moment où le client sort son porte-monnaie. Le paiement. Le nerf de la guerre. L'intérêt d'un SaaS, par définition, c'est la scalabilité. Un système bien fait encaisse 100 paiements mensuels aussi facilement qu'un seul pendant que tu dors. Comment ça se passe chez Yebouetek ? Écoute, c'est là que toute cette belle architecture s'effondre lamentablement. Le flux d'intégration est décrit dans les sources. Quand le resto termine ses 14 jours d'essai, il voit un écran de paiement. Jusque là, normal. Très bien, classique. Sauf que la page lui demande de faire un transfert d avec Wave ou Orange Money de 10 000 ou 25 000 francs CFA sur le numéro de téléphone personnel du développeur. Attends, sur son numéro perso ? Oui, et le client doit taper le code de référence de son SMS dans un petit champ texte sur le site.

**Camilla :** Non mais, côté serveur, il se passe quoi pour valider le compte ?

**Karma :** Rien. Le serveur, c'est le développeur. C'est lui qui reçoit le SMS sur son téléphone. Il doit ensuite se connecter manuellement à son interface d'administration, chercher le nom du resto, vérifier le montant et cliquer sur « valider l'abonnement » pour débloquer le mois. Oh là là, c'est l'anti-pattern absolu ! C'est contraire à l'essence même de l'informatique. À quoi ça sert de faire un serveur sur

**Camilla :** Si le goulot d'étranglement de l'entreprise, c'est le temps

**Karma :** Exactement ce que je me suis dit. Surtout que le doc précise que s'il n'y a pas de renouvellement, le menu est coupé au bout de 5 jours. Imagine, le restaurateur réalise que son menu est expiré en plein service, à 21h un samedi.

**Camilla :** Il fait son transfert wave en panique

**Karma :** Mais si le développeur est au resto ou en train de dormir, le menu reste bloqué toute la soirée ? Le gérant du maquis va péter un câble et jeter Yébouetec à la poubelle dès le lendemain matin. C'est garanti. La scalabilité du projet, elle est artificiellement plafonnée à zéro. S'il a 200 clients, il va passer ses journées à croiser des SMS avec son tableau de bord. Il n'aura plus le temps de réparer les roues de ses gab

**Camilla :** L'entreprise va imploser tout simplement. Alors est-ce qu'il a au moins prévu d'automatiser ça ?

**Karma :** Alors pour être juste, oui, il y a une lueur d'espoir. Il mentionne une solution tierce qui s'appelle Genius Pay pour faire ça via une API. Mais c'est repoussé. Il dit qu'il est sur liste d'attente et qu'il y a des soucis de compte marchand à régler d'abord.

**Camilla :** C'est un risque énorme de repousser ça. Parce que cette automatisation via ce qu'on appelle un webhook, c'est vital.

**Karma :** Un webbook, c'est comme un beeper d'urgence, c'est ça ? Voilà. Au lieu que l'humain lit ses SMS, le système mobile envoie un signal serveur à serveur, à la seconde où l'argent arrive. Le menu est réactivé instantanément, à 3h du matin s'il le faut. Se lancer sans ça aujourd'hui, même sur un marché naissant, c'est suicidaire. Les concurrents offrent déjà des expériences sans friction. Ça lui donne une vue d'ensemble vraiment saisissante. D'un côté, on a une Opticloud géniale, qui casse les coûts de base de données, et une compréhension culturelle hyper fine avec ses menus locaux.

**Camilla :** et de l'autre des angles

**Karma :** angles morts massifs. L'oubli du nom de domaine, qui peut détruire tout le matériel physique, la crise d'identité visuelle, le délire des 80 modèles à maintenir et ce processus de paiement manuel qui garantit l'asphyxie. C'est le syndrome parfait de l'ingénieur qui oublie qu'il construit une entreprise, pas juste du code. Du coup, c'est quoi la grande leçon à retenir pour ceux qui conçoivent de la tech ? La grande leçon, c'est que la fonctionnalité la plus difficile à développer, c'est la retenue. Savoir dire non. Savoir faire la différence entre le truc qui flatte ton égo, comme coder de la vapeur en 3D, et les fondations ennuyeuses mais vitales qui feront survivre ton produit dans le monde réel. La retenue, ouais. C'est super bien dit. Et ça me mène à une dernière réflexion, un peu plus provocatrice, pour clore le débat. On a beaucoup parlé du risque pour le développeur, mais pensons au restaurateur. L'éc

**Camilla :** C'est vrai, c'est eux qui prennent le

**Karma :** Si on y réfléchit bien, ces petites entreprises locales confient l'entièreté de leur identité numérique, l'accès même à leurs produits, à un système ultra fragile. S'ils n'ont pas la propriété du nom de domaine qui pointe vers leur propre menu, ils ne possèdent absolument rien de leur présence digitale. Ah oui, c'est une forme de dépossession numérique totale. Exactement. Ils paient pour un outil qui peut s'évaporer du jour au lendemain à cause d'un oubli de 10 euros chez un registrar. C'est un enjeu de s'ouvrir. souveraineté des données pour ces petits commerces qui est fascinant et un peu effrayant. C'est une excellente piste de réflexion à creuser en effet. Sur ce, on espère que le créateur de Yebwatech saura corriger le tir parce que le potentiel est juste énorme. Notre décryptage touche à sa fin. On se retrouve très vite pour décortiquer ce qui fait ou défait la technologie qui nous entoure. A bientôt.