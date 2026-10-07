# Yéboué Tech — les modèles de page

Dix modèles existent déjà. Ce fichier décrit les **70 nouveaux**, soit **80 au total**. C'est la feuille de route : chaque modèle est construit à partir de sa ligne ci-dessous, et son état est noté dans le tableau de la fin.

Sur 1 000 établissements, dix modèles se reconnaissent tout de suite. Avec 80, et une couleur libre pour chacun, deux voisins ont très peu de chances de se ressembler.

---

## Ce qui fait qu'un modèle est vraiment un modèle

Un modèle n'est pas une couleur de plus. Chacun a **son idée**, et trois choses qui ne sont qu'à lui :

1. **Sa mise en page** — comment la carte est rangée à l'écran : liste, grille, cartes à feuilleter, onglets, plan, tableau…
2. **Ses lettres** — une police de titre choisie pour lui, qui donne le ton avant même qu'on lise.
3. **Son mouvement** — une animation signature, celle dont on se souvient.

Deux modèles ne partagent jamais ces trois choses à la fois.

## Ce que tous les modèles partagent

- **La couleur du gérant.** Elle devient l'encre principale du modèle, quel qu'il soit. Le texte posé dessus reste lisible : c'est calculé. Chaque modèle a aussi une couleur conseillée, celle de sa vignette.
- **Le panier, la fiche d'un article, la commande et son suivi.** Ils sont les mêmes partout : le client n'a rien à réapprendre d'un restaurant à l'autre.
- **Les mêmes données.** Changer de modèle ne fait rien perdre : la carte suit.
- **La rapidité.** La carte se lit d'abord, les animations arrivent ensuite. Un modèle n'envoie au téléphone que ses propres styles et sa propre police, pas ceux des 79 autres.
- **Le respect de chacun.** Tout se lit sans animation si le téléphone le demande, tout s'atteint au clavier, et une rupture se voit sans dépendre de la couleur.
- **Sans photo, le modèle reste beau.** Beaucoup de gérants commenceront sans photos.

Outils : React, Tailwind, GSAP et ses extensions (texte qui se découpe, tracés qui se dessinent, formes qui se transforment, glisser avec élan), Motion pour les gestes, composants Radix (ceux de shadcn/ui) pour les onglets, volets et fenêtres.

---

## Les dix modèles déjà faits

| N° | Modèle | Son idée |
|---|---|---|
| 1 | **Braise** | De grandes photos en cartes, sous une couverture généreuse |
| 2 | **Ardoise** | Le tableau noir du maquis, écrit à la craie |
| 3 | **Table d'hôte** | La carte classique sur papier ivoire, tout centré |
| 4 | **Comptoir** | La nuit : halos de couleur, cocktails en hautes cartes qui glissent |
| 5 | **Palace** | Sobre et raffiné, les services en volets numérotés |
| 6 | **Magazine** | Une revue : titre immense, rubriques en chiffres creux |
| 7 | **Épure** | Presque rien : une liste nette, la plus rapide |
| 8 | **Marché** | L'affiche du marché : aplats de couleur, étiquettes de prix |
| 9 | **Carnet** | Le ticket de caisse, qui sort de l'imprimante |
| 10 | **Vitrine** | Les plats en plein écran, à feuilleter comme des « stories » |

---

## A. Abidjan, la rue et le quartier

Pour les maquis, les garbadromes, la cuisine de rue. Des modèles qu'on ne trouve nulle part ailleurs.

### 11. Gbaka
**L'idée :** la carrosserie peinte du minibus, ses bandes, son slogan.
**À l'écran :** un bandeau de carrosserie avec le nom en lettres penchées, un slogan qui défile, la plaque de destination qui liste les catégories. Les photos sont alignées comme les vitres du car.
**Mouvement :** le car passe : la carrosserie glisse de côté quand on fait défiler, les roues tournent.
**Pour :** maquis, cuisine de rue.

### 12. Enseigne
**L'idée :** l'enseigne peinte à la main par le peintre en lettres du quartier.
**À l'écran :** des panneaux de couleur empilés, un par catégorie. Lettres épaisses avec leur ombre portée, prix dans des étoiles, photos dans des médaillons ovales.
**Mouvement :** chaque panneau se peint sous les yeux, d'un coup de pinceau ; les étoiles de prix claquent.
**Pour :** maquis, grillades, petits restaurants.

### 13. Pagne
**L'idée :** le wax. Des motifs dessinés par le code, dans la couleur du lieu.
**À l'écran :** des bandes de motifs (cercles, chevrons, écailles) en tête de chaque catégorie, une lisière imprimée sur le côté, des articles cousus d'un point de couture.
**Mouvement :** le tissu se déroule ; le point de couture se trace autour des cartes.
**Pour :** restaurants de cuisine ivoirienne, traiteurs.

### 14. Garba
**L'idée :** le garbadrome : le bol en inox, la table en plastique, les prix « à 300, à 500 ».
**À l'écran :** les plats dans de grandes assiettes rondes, posées en quinconce, le prix sur une pastille. Fond clair, lettres rondes et grasses.
**Mouvement :** les assiettes arrivent en tournant et se posent ; un filet de vapeur monte du plat du jour.
**Pour :** garbadromes, cantines, cuisine du midi.

### 15. Guirlande
**L'idée :** le marché de nuit, sous sa guirlande d'ampoules.
**À l'écran :** un ciel sombre, une guirlande tendue en haut, des étals à auvent rayé, un par catégorie.
**Mouvement :** les ampoules s'allument une à une et se balancent ; les auvents se déplient.
**Pour :** allocodromes, maquis du soir, grillades.

### 16. Écolier
**L'idée :** le cahier d'écolier, ses lignes, sa marge rouge.
**À l'écran :** une page quadrillée, la carte écrite au stylo bleu, les prix entourés au stylo rouge comme une note. Les catégories sont des intercalaires sur le bord.
**Mouvement :** l'écriture se trace ligne après ligne ; le stylo rouge entoure les prix.
**Pour :** cantines, snacks près des écoles, petits maquis.

### 17. Stade
**L'idée :** le jour de match.
**À l'écran :** un tableau d'affichage en haut, les lignes du terrain pour séparer les catégories, un numéro de maillot devant chaque article, un bandeau « en direct » qui défile.
**Mouvement :** les chiffres du tableau basculent ; les lignes du terrain se tracent.
**Pour :** maquis et bars qui diffusent les matchs.

### 18. Titrologie
**L'idée :** la une du journal, celle qu'on lit au kiosque.
**À l'écran :** un vrai journal : manchette, date, gros titres pour les plats vedettes, colonnes serrées, petites annonces pour les boissons, photos tramées.
**Mouvement :** l'encre « prend » : les titres passent du flou au net ; un tampon « édition spéciale » tombe sur le plat du jour.
**Pour :** maquis, cafés, restaurants de quartier.

### 19. Kraft
**L'idée :** le papier du boucher et sa balance.
**À l'écran :** une feuille de papier brun, des catégories au pochoir, les prix alignés comme à la pesée. En haut, le cadran d'une balance.
**Mouvement :** l'aiguille de la balance part et se cale ; le papier se déplie.
**Pour :** dibiteries, choukouya, grillades au poids.

### 20. Awalé
**L'idée :** le plateau d'awalé sert de menu.
**À l'écran :** un plateau de bois sculpté ; chaque case est une catégorie, avec autant de graines que d'articles. On touche une case, la catégorie s'ouvre dessous.
**Mouvement :** les graines se sèment de case en case.
**Pour :** maquis, restaurants de cuisine africaine, lieux culturels.

---

## B. Les tables

Pour les restaurants où l'on s'assoit et où l'on prend son temps.

### 21. Grand soir
**L'idée :** la nappe blanche.
**À l'écran :** très blanc, beaucoup d'air, des lettres fines. La carte suit le repas : premier service, deuxième service, douceurs. Chaque plat est centré.
**Mouvement :** l'assiette glisse et se pose à côté du plat qu'on lit, comme servie à table.
**Pour :** gastronomie, restaurants d'hôtel.

### 22. Marbre
**L'idée :** marbre sombre et laiton.
**À l'écran :** un fond de marbre veiné, des filets de laiton, les plats sur des plaques gravées, en lettres capitales.
**Mouvement :** un reflet passe sur le laiton ; le marbre glisse en profondeur.
**Pour :** restaurants haut de gamme, steakhouses, bars d'hôtel.

### 23. Déco
**L'idée :** les années 1930.
**À l'écran :** tout est symétrique : éventails, rayons de soleil, cadres en escalier, bleu nuit et or.
**Mouvement :** les rayons s'ouvrent en éventail ; les plats entrent des deux côtés à la fois.
**Pour :** brasseries, restaurants de caractère, bars à cocktails.

### 24. Herbier
**L'idée :** la planche de botaniste.
**À l'écran :** un papier crème, chaque plat est une « planche » numérotée, sa photo scotchée, ses ingrédients annotés à la main avec de petits traits.
**Mouvement :** les feuilles poussent dans la marge ; les étiquettes s'épinglent.
**Pour :** cuisine végétale, tables de jardin, salons de thé.

### 25. Le Fil
**L'idée :** un fil relie tous les plats, du premier au dernier.
**À l'écran :** un fil de la couleur du lieu serpente du haut en bas de la page et passe par chaque photo ronde, à gauche puis à droite.
**Mouvement :** le fil se tire à mesure qu'on descend.
**Pour :** menus dégustation, tables de chef, cartes courtes.

### 26. Bistrot
**L'idée :** le bistrot : miroir, lettres dorées, sol en damier.
**À l'écran :** un grand miroir où les plats du jour sont peints en lettres d'or, la carte sur deux colonnes, une frise de damier.
**Mouvement :** les lettres dorées scintillent ; le damier défile sous la page.
**Pour :** bistrots, brasseries, restaurants français.

### 27. Galerie
**L'idée :** chaque plat est une œuvre accrochée.
**À l'écran :** un mur blanc, des cadres, un cartel sous chaque plat (titre, « matière », prix). On parcourt les salles de gauche à droite.
**Mouvement :** on défile vers le bas, la salle avance de côté ; un éclairage suit le cadre qu'on regarde.
**Pour :** restaurants à belles photos, lieux d'art.

### 28. Primeur
**L'idée :** l'étal du primeur et ses cageots.
**À l'écran :** un cageot par catégorie, les articles sur de petites pancartes plantées de travers, lettres au pochoir.
**Mouvement :** les pancartes se plantent une à une en tremblant ; les lattes du cageot s'assemblent.
**Pour :** cuisine de marché, saladeries, épiceries-restaurants.

### 29. Tison
**L'idée :** le feu de bois.
**À l'écran :** noir charbon, des braises qui montent derrière le nom, des photos aux bords brûlés, des prix couleur de chaleur.
**Mouvement :** les braises s'élèvent ; le titre ondule dans l'air chaud.
**Pour :** grillades, rôtisseries, pizzerias au feu de bois.

### 30. Carte postale
**L'idée :** des cartes postales du restaurant.
**À l'écran :** une pile de cartes. Devant, la photo ; derrière, le timbre, le cachet de la poste et la liste des plats écrite à la main.
**Mouvement :** la carte se retourne quand on la touche ; le cachet s'abat.
**Pour :** lieux touristiques, Grand-Bassam, Assinie, restaurants d'hôtel.

---

## C. Sur le pouce

Pour la restauration rapide, les snacks, la livraison.

### 31. Combo
**L'idée :** le burger en grand.
**À l'écran :** des lettres énormes, des photos qui débordent de leur carte, de la sauce qui coule entre les catégories.
**Mouvement :** la sauce s'étire quand on descend ; les cartes basculent sous le doigt.
**Pour :** burgers, tacos, poulet frit.

### 32. Panneau
**L'idée :** le panneau lumineux au-dessus du comptoir.
**À l'écran :** trois panneaux noirs à points lumineux, un numéro de commande géant, la carte écrite en petites diodes.
**Mouvement :** le texte s'allume diode après diode.
**Pour :** fast-foods, snacks, comptoirs à emporter.

### 33. Bento
**L'idée :** la boîte à compartiments.
**À l'écran :** chaque catégorie est une boîte laquée, découpée en cases de tailles différentes, une photo par case.
**Mouvement :** le couvercle glisse ; les cases se mettent en place.
**Pour :** cuisine asiatique, poké, plats du midi.

### 34. Arcade
**L'idée :** le jeu vidéo d'autrefois.
**À l'écran :** tout en gros pixels : « APPUYEZ POUR COMMENCER », les articles dans des cases d'inventaire, les prix en pièces d'or.
**Mouvement :** l'écran apparaît pixel par pixel ; les pièces tournent ; un curseur clignote.
**Pour :** salles de jeux, fast-foods, lieux jeunes.

### 35. Zellige
**L'idée :** la mosaïque et l'arche.
**À l'écran :** des frises de carreaux géométriques, les photos sous des arches, des lettres aux accents orientaux.
**Mouvement :** les carreaux se retournent en vague ; les arches se lèvent.
**Pour :** chawarmas, cuisine libanaise et marocaine.

### 36. Pressé
**L'idée :** le bar à jus.
**À l'écran :** des formes rondes, des vagues entre les catégories, les prix dans des gouttes. Chaque titre est un verre.
**Mouvement :** le verre se remplit ; des bulles montent.
**Pour :** bars à jus, smoothies, bissap et gnamakoudji.

### 37. Sorbet
**L'idée :** le glacier.
**À l'écran :** rayures pastel de store, cartes à bord festonné, une cerise sur les nouveautés.
**Mouvement :** les boules tombent et rebondissent ; des vermicelles éclatent quand on ajoute au panier.
**Pour :** glaciers, crêperies, desserts.

### 38. Carton
**L'idée :** la boîte à pizza.
**À l'écran :** du carton ondulé imprimé d'une seule encre, celle du lieu. Les pizzas en photos rondes, les prix en parts.
**Mouvement :** le couvercle s'ouvre ; les pizzas tournent lentement.
**Pour :** pizzerias, plats à emporter.

### 39. Stickers
**L'idée :** la planche d'autocollants.
**À l'écran :** chaque article est un autocollant à bord blanc, posé un peu de travers, avec un coin qui se décolle.
**Mouvement :** les autocollants se plaquent d'un coup ; ils brillent comme un hologramme quand on bouge le doigt.
**Pour :** bubble tea, snacks, lieux jeunes.

### 40. Coursier
**L'idée :** le colis qu'on suit.
**À l'écran :** des étiquettes d'expédition, et sur le côté un trajet en pointillés avec ses étapes, une par catégorie.
**Mouvement :** le scooter avance sur le trajet à mesure qu'on descend ; le tampon « livré » tombe.
**Pour :** cuisines de livraison, traiteurs.

---

## D. La nuit

Pour les bars, les lounges, les caves.

### 41. Néon
**L'idée :** les tubes de néon sur un mur de briques.
**À l'écran :** le nom en néon de la couleur du lieu, chaque catégorie est une enseigne lumineuse.
**Mouvement :** les tubes s'allument en grésillant ; ils brillent plus fort sous le doigt.
**Pour :** bars, karaokés, snacks de nuit.

### 42. Vinyle
**L'idée :** le disque et sa pochette.
**À l'écran :** une pochette d'album avec la photo du lieu, un disque qui en sort. La carte est une liste de titres : face A, face B, et le prix à la place de la durée.
**Mouvement :** le disque tourne à la vitesse du défilement ; le bras se pose.
**Pour :** lounges, bars à musique, jazz.

### 43. Rideau
**L'idée :** le cabaret.
**À l'écran :** un rideau de velours, un cadre d'ampoules, le programme de la soirée : acte I, acte II.
**Mouvement :** le rideau s'ouvre ; les ampoules courent autour du cadre ; un projecteur suit la lecture.
**Pour :** cabarets, lounges à spectacle, soirées.

### 44. Étiquette
**L'idée :** le bar caché et ses étiquettes de bouteilles.
**À l'écran :** un judas qui s'ouvre, puis chaque boisson sur une étiquette ornée, à l'ancienne.
**Mouvement :** le judas coulisse ; les ornements se dessinent ; l'or des étiquettes accroche la lumière.
**Pour :** bars à cocktails, bars à whisky.

### 45. Crépuscule
**L'idée :** le toit-terrasse, de l'heure dorée à la nuit.
**À l'écran :** un ciel en dégradé, une ville en ombre, des cartes en verre dépoli qui flottent.
**Mouvement :** le ciel change d'heure à mesure qu'on descend ; les étoiles s'allument.
**Pour :** rooftops, lounges, bars d'hôtel.

### 46. Formule
**L'idée :** le tableau des éléments.
**À l'écran :** chaque cocktail est une tuile avec son symbole en deux lettres et son numéro. Ses ingrédients, lus dans la description, deviennent des étiquettes.
**Mouvement :** le tableau s'assemble rangée par rangée ; les symboles se brouillent puis se fixent.
**Pour :** bars à cocktails, bars à jus créatifs.

### 47. Pulse
**L'idée :** le club.
**À l'écran :** noir, des lignes de texte géantes qui défilent en sens contraires, les articles numérotés en très grand.
**Mouvement :** le texte accélère avec le doigt ; le titre se dédouble en couleurs.
**Pour :** clubs, bars de nuit.

### 48. Radio
**L'idée :** le poste de radio.
**À l'écran :** une grille de haut-parleur, un cadran gradué. On tourne le cadran pour changer de catégorie, comme on cherche une station.
**Mouvement :** l'aiguille glisse avec de l'élan ; les barres du son dansent.
**Pour :** maquis à musique, bars, lounges.

### 49. Cave
**L'idée :** le livre de cave.
**À l'écran :** un casier à bouteilles en tête, puis un registre tenu à la plume : nom, description, prix, en colonnes.
**Mouvement :** les lignes du registre se tirent ; les bouteilles roulent à leur place.
**Pour :** caves à vin, bars à vin, restaurants à belle carte de vins.

### 50. Constellation
**L'idée :** la carte du ciel.
**À l'écran :** chaque catégorie est une constellation, chaque article une étoile. Sous le ciel, la même carte en liste.
**Mouvement :** les étoiles scintillent ; les traits se tirent d'une étoile à l'autre.
**Pour :** rooftops, lounges, bars d'hôtel.

---

## E. Cafés et douceurs

Pour les cafés, les pâtisseries, les salons de thé.

### 51. Grain
**L'idée :** le sachet du torréfacteur.
**À l'écran :** noir mat, une étiquette blanche, des tampons, une trace de tasse.
**Mouvement :** les tampons frappent ; le rond de café se dessine ; la vapeur monte.
**Pour :** cafés, torréfacteurs.

### 52. Cloche
**L'idée :** la vitrine du pâtissier.
**À l'écran :** des pastels, de la dentelle de papier, les gâteaux sur des présentoirs à étages.
**Mouvement :** la cloche de verre se soulève ; un éclat passe sur le glaçage.
**Pour :** pâtisseries, salons de thé.

### 53. Aurore
**L'idée :** la journée, du matin au goûter.
**À l'écran :** un soleil qui suit sa course en haut de la page ; la carte est rangée par moments.
**Mouvement :** le soleil avance et le ciel change à mesure qu'on descend.
**Pour :** brunchs, petits-déjeuners, cafés.

### 54. Porcelaine
**L'idée :** la vaisselle peinte.
**À l'écran :** blanc, des décors fins de la couleur du lieu, les photos dans le creux d'assiettes à bord orné.
**Mouvement :** le bord des assiettes tourne doucement ; un filet de thé se verse d'un titre à l'autre.
**Pour :** salons de thé, pâtisseries fines.

### 55. Fournil
**L'idée :** le four du boulanger.
**À l'écran :** brique sombre, lueur chaude, les pains sur la pelle en bois, l'heure de sortie du four.
**Mouvement :** la lueur du four respire ; un nuage de farine s'envole.
**Pour :** boulangeries, viennoiseries.

### 56. Cacao
**L'idée :** la tablette de chocolat. La Côte d'Ivoire est le premier pays du cacao.
**À l'écran :** une tablette en relief dont chaque carré est une catégorie, dans un papier doré qu'on déchire.
**Mouvement :** le papier s'ouvre ; le carré s'enfonce sous le doigt.
**Pour :** chocolatiers, pâtisseries, cafés.

### 57. Bonbon
**L'idée :** la confiserie et ses bocaux.
**À l'écran :** des rayures de sucre d'orge, un bocal par catégorie, les articles dedans.
**Mouvement :** les bonbons tombent dans le bocal et rebondissent ; le couvercle saute.
**Pour :** confiseries, goûters, lieux pour enfants.

### 58. Rayonnage
**L'idée :** la bibliothèque.
**À l'écran :** des étagères ; chaque article est un livre dont on lit le dos.
**Mouvement :** le livre sort du rayon quand on le touche ; une page se tourne.
**Pour :** cafés-librairies, salons de thé.

### 59. Terminal
**L'idée :** l'écran de l'informaticien.
**À l'écran :** une fenêtre noire, des lettres de la couleur du lieu, la carte tapée comme une commande.
**Mouvement :** le texte se tape tout seul ; le curseur clignote.
**Pour :** cafés de coworking, salles de jeux.

### 60. Instantané
**L'idée :** le tableau de liège et ses photos.
**À l'écran :** les articles sont des photos instantanées, épinglées, avec le nom écrit au feutre dessous.
**Mouvement :** la photo se révèle peu à peu, comme une vraie ; on peut la déplacer du doigt.
**Pour :** cafés, brunchs, restaurants à belles photos.

---

## F. Hôtels et résidences

Pour les services, les guides d'appartement, les lignes sans prix.

### 61. Clef
**L'idée :** le tableau des clefs de la réception.
**À l'écran :** chaque service pend à son crochet sur un porte-clefs ; le numéro de la chambre en grand.
**Mouvement :** les porte-clefs se balancent quand on les touche.
**Pour :** hôtels, résidences.

### 62. Escale
**L'idée :** la carte d'embarquement.
**À l'écran :** une carte par catégorie, avec son talon détachable et ses cases : client, chambre, départ.
**Mouvement :** la carte sort de la fente ; le talon se détache ; un avion suit ses pointillés.
**Pour :** hôtels d'aéroport, résidences de voyageurs.

### 63. Départs
**L'idée :** le tableau à palettes de l'aérogare.
**À l'écran :** un tableau noir, une ligne par service, lettre par lettre.
**Mouvement :** les palettes claquent et tournent jusqu'à la bonne lettre.
**Pour :** hôtels, bars, salles d'attente.

### 64. Classeur
**L'idée :** le guide de la maison.
**À l'écran :** un classeur à anneaux, des intercalaires de couleur, des encadrés « bon à savoir », des passages surlignés.
**Mouvement :** la page se tourne ; le surligneur passe sur ce qui compte.
**Pour :** résidences, appartements meublés.

### 65. Souffle
**L'idée :** le calme du spa.
**À l'écran :** des dégradés doux qui bougent lentement, de grandes lettres légères, beaucoup d'espace.
**Mouvement :** un cercle respire ; une onde part du doigt.
**Pour :** spas, instituts, hôtels de repos.

### 66. Sentier
**L'idée :** le carnet du lodge.
**À l'écran :** des courbes de niveau en fond, une boussole, des fiches de terrain.
**Mouvement :** les courbes dérivent ; l'aiguille de la boussole cherche le nord.
**Pour :** lodges, écolodges, hôtels en nature.

### 67. Lagon
**L'idée :** le bord de la piscine.
**À l'écran :** un carrelage de bassin, des reflets d'eau, les catégories sous des parasols vus du ciel.
**Mouvement :** l'eau miroite ; une onde part du doigt ; les parasols tournent.
**Pour :** hôtels à piscine, clubs de plage.

### 68. Registre
**L'idée :** le grand hôtel d'autrefois.
**À l'écran :** un registre à colonnes, une signature à la plume, des étiquettes de bagages anciennes.
**Mouvement :** la signature s'écrit ; la sonnette de réception tinte quand on commande.
**Pour :** hôtels de charme.

### 69. Annuaire
**L'idée :** trouver en deux secondes.
**À l'écran :** un champ de recherche, des listes groupées, des pastilles d'état : « ouvert 24 h », « inclus ». Net comme une application.
**Mouvement :** la liste se réorganise en douceur pendant qu'on tape.
**Pour :** hôtels d'affaires, grandes cartes de services.

### 70. Plan
**L'idée :** le plan de l'architecte.
**À l'écran :** un fond bleu, des traits blancs. Chaque pièce du plan est une catégorie ; le cartouche porte le nom du lieu.
**Mouvement :** le plan se trace ; les cotes s'étirent.
**Pour :** résidences, appartements, villas.

---

## G. Partis pris

Des modèles d'auteur, pour tous les types de lieux.

### 71. Suisse
**L'idée :** la grille, et rien d'autre.
**À l'écran :** tout est aligné, des chiffres énormes, une seule couleur.
**Mouvement :** la grille se trace ; les chiffres comptent jusqu'à leur valeur.
**Pour :** tous.

### 72. Brut
**L'idée :** le web sans maquillage.
**À l'écran :** bordures noires épaisses, tableaux apparents, titres soulignés. Assumé.
**Mouvement :** tout change d'un coup, sans fondu ; un bandeau défile.
**Pour :** lieux d'art, cafés, concepts.

### 73. Bauhaus
**L'idée :** le cercle, le carré, le triangle.
**À l'écran :** une affiche de formes simples, des photos découpées en ronds et en quarts de rond, des lettres géométriques.
**Mouvement :** les formes s'assemblent en affiche.
**Pour :** tous.

### 74. Riso
**L'idée :** l'impression à deux encres.
**À l'écran :** des photos tramées dans la couleur du lieu, des couleurs un peu décalées, du grain, des repères d'imprimeur.
**Mouvement :** les deux encres se calent l'une sur l'autre.
**Pour :** cafés, concepts, lieux jeunes.

### 75. Collage
**L'idée :** ciseaux et colle.
**À l'écran :** du papier déchiré, du ruban adhésif, un titre en lettres découpées dans des journaux, des photos détourées.
**Mouvement :** les morceaux tombent en place ; un gribouillis souligne les prix.
**Pour :** concepts, bars, street food.

### 76. Vitrail
**L'idée :** le vitrail.
**À l'écran :** des plombs noirs, des verres de couleur. Une rosace sert de menu : un pétale par catégorie.
**Mouvement :** la lumière traverse le verre ; la rosace tourne vers le pétale choisi.
**Pour :** lieux de caractère, restaurants, hôtels.

### 77. Strates
**L'idée :** le papier découpé, en couches.
**À l'écran :** des vagues de papier superposées, avec leurs ombres. Chaque catégorie est une couche plus profonde.
**Mouvement :** les couches glissent à des vitesses différentes.
**Pour :** tous.

### 78. Bulles
**L'idée :** la bande dessinée.
**À l'écran :** une planche de cases ; les descriptions dans des bulles, les prix dans des cartouches jaunes.
**Mouvement :** les cases s'enchaînent dans le sens de la lecture ; les bulles se gonflent.
**Pour :** lieux familiaux, fast-foods, concepts.

### 79. Séance
**L'idée :** le cinéma.
**À l'écran :** une affiche de film en ouverture, puis une pellicule : chaque article est une image du film.
**Mouvement :** le clap claque ; la pellicule avance ; un décompte 3, 2, 1 à l'ouverture.
**Pour :** bars, restaurants à thème, cinémas.

### 80. Atout
**L'idée :** le jeu de cartes.
**À l'écran :** chaque article est une carte ornée. On feuillette la pile du doigt, on retourne une carte pour lire sa description.
**Mouvement :** les cartes sont distribuées à l'ouverture ; elles suivent le doigt.
**Pour :** bars, lounges, concepts.

---

## Avancement

Les modèles se construisent par lots de cinq. Un modèle est « fait » quand il a été regardé sur téléphone et sur ordinateur, avec et sans photos, avec une couleur claire et une couleur sombre, et que sa vignette est dans la galerie.

| Lot | Modèles | État |
|---|---|---|
| — | 1 à 10 | Faits |
| 1 | 11 Gbaka · 12 Enseigne · 13 Pagne · 14 Garba · 15 Guirlande | Faits |
| 2 | 16 Écolier · 17 Stade · 18 Titrologie · 19 Kraft · 20 Awalé | À faire |
| 3 | 21 Grand soir · 22 Marbre · 23 Déco · 24 Herbier · 25 Le Fil | À faire |
| 4 | 26 Bistrot · 27 Galerie · 28 Primeur · 29 Tison · 30 Carte postale | À faire |
| 5 | 31 Combo · 32 Panneau · 33 Bento · 34 Arcade · 35 Zellige | À faire |
| 6 | 36 Pressé · 37 Sorbet · 38 Carton · 39 Stickers · 40 Coursier | À faire |
| 7 | 41 Néon · 42 Vinyle · 43 Rideau · 44 Étiquette · 45 Crépuscule | À faire |
| 8 | 46 Formule · 47 Pulse · 48 Radio · 49 Cave · 50 Constellation | À faire |
| 9 | 51 Grain · 52 Cloche · 53 Aurore · 54 Porcelaine · 55 Fournil | À faire |
| 10 | 56 Cacao · 57 Bonbon · 58 Rayonnage · 59 Terminal · 60 Instantané | À faire |
| 11 | 61 Clef · 62 Escale · 63 Départs · 64 Classeur · 65 Souffle | À faire |
| 12 | 66 Sentier · 67 Lagon · 68 Registre · 69 Annuaire · 70 Plan | À faire |
| 13 | 71 Suisse · 72 Brut · 73 Bauhaus · 74 Riso · 75 Collage | À faire |
| 14 | 76 Vitrail · 77 Strates · 78 Bulles · 79 Séance · 80 Atout | À faire |
