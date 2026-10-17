import type { Dictionary } from "../types";
import { withFrenchSpaces } from "../typography";

/*
 * Les textes français du site vitrine. Ils sont écrits avec des espaces
 * ordinaires : les espaces insécables sont posées automatiquement à l'export.
 */
const texts: Dictionary = {
  meta: {
    title: "Le menu et les services de votre établissement, par QR Code",
    description:
      "Restaurants, maquis, bars, hôtels et résidences : mettez votre carte et vos services en ligne, posez un QR Code, et changez vos prix vous-même depuis votre téléphone.",
  },

  nav: {
    audiences: "Pour qui",
    how: "Comment ça marche",
    pricing: "Tarifs",
    faq: "Questions",
    templates: "Modèles",
    login: "Connexion",
    cta: "Créer mon menu",
    openMenu: "Ouvrir le menu",
    menuTitle: "Menu",
    solutions: "Votre établissement",
    language: "Langue",
    switchTo: "English",
    toDark: "Passer en mode sombre",
    toLight: "Passer en mode clair",
    theme: "Apparence",
  },

  hero: {
    rotating: [
      { eyebrow: "Pour les restaurants et les maquis", lead: "Votre menu" },
      { eyebrow: "Pour les bars et les lounges", lead: "Votre carte" },
      { eyebrow: "Pour les hôtels", lead: "Vos services" },
      { eyebrow: "Pour les résidences", lead: "Votre guide" },
    ],
    titleRest: "en ligne en 15 minutes.",
    text: "Un QR Code sur la table, au bar ou dans la chambre : vos clients voient vos plats, vos boissons et vos services, avec vos photos et vos prix du jour. Vous changez tout vous-même, depuis votre téléphone, sans jamais réimprimer.",
    primary: "Créer mon menu",
    secondary: "Voir comment ça marche",
    assurances: "Essai gratuit de 14 jours · Sans engagement · Aucune application à installer",
    photoAlt: "Deux clients attablés regardent un menu sur un téléphone",
  },

  audiences: {
    eyebrow: "Pour qui",
    title: "Du maquis de quartier à l'hôtel.",
    intro: "Le même outil pour toutes les maisons. Vous y mettez votre nom, vos couleurs, vos plats ou vos services.",
    more: "Voir comment ça marche",
  },

  story: {
    eyebrow: "Comment ça marche",
    title: "Du scan à la cuisine, en quatre gestes.",
    intro: "Un exemple : un soir dans un maquis. Voici ce que vit le client, et ce que vous voyez de votre côté.",
    others: "Vous tenez un autre établissement ? Voyez comment ça marche chez vous :",
  },

  features: {
    eyebrow: "Ce qui change pour vous",
    title: "Moins de papier, moins d'allers-retours.",
    items: [
      {
        title: "Vous changez un prix en dix secondes.",
        text: "Un plat en rupture, un nouveau tarif, le plat du jour : vous le faites vous-même, depuis votre téléphone. Vos clients le voient au scan suivant.",
        points: [
          "Plats, services et photos illimités",
          "Un plat en rupture se retire d'un seul geste",
          "Plat du jour et promotions affichés aux heures choisies",
        ],
        alt: "Une gérante en tablier, assise à une table de son restaurant, au téléphone",
      },
      {
        title: "Vous imprimez une fois, pour toujours.",
        text: "Le QR Code mène à une adresse qui ne change jamais. Vous modifiez votre carte autant que vous voulez : rien à réimprimer, rien à recoller.",
        points: [
          "Un QR Code pour la maison, ou un par table et par chambre",
          "Des affiches et des planches prêtes à imprimer",
          "Le même lien pour Instagram, WhatsApp et votre fiche Google",
        ],
        alt: "Un petit chevalet avec un QR Code posé sur une table de restaurant",
      },
      {
        title: "La commande arrive au comptoir, sans crier.",
        text: "Le client commande depuis sa table ou sa chambre. La commande s'affiche aussitôt chez vous, avec une sonnerie et le numéro de la table. Vous l'acceptez d'un geste.",
        points: [
          "Un écran de commandes sur n'importe quel téléphone ou tablette",
          "Le client suit sa commande : acceptée, prête, servie",
          "Appel du serveur et demande de l'addition depuis la table",
        ],
        alt: "Un chef fait flamber une poêle dans une cuisine ouverte",
      },
      {
        title: "À emporter ? La commande part sur WhatsApp.",
        text: "Le client remplit son panier sur votre page et vous l'envoie sur WhatsApp, déjà rédigé. Vous réglez l'heure et la livraison avec lui, comme d'habitude.",
        points: [
          "Rien de nouveau à apprendre pour votre équipe",
          "Le total est calculé, les plats sont listés",
          "Compris dans les deux offres",
        ],
        alt: "Une cliente assise à une table de café consulte son téléphone",
      },
    ],
    crumbs: {
      dish: "Poisson braisé",
      price: "Prix",
      available: "Disponible aujourd'hui",
      address: "L'adresse de votre page",
      never: "Ne change jamais",
      message: "Message prêt à envoyer",
      hello: "Bonjour, je souhaite commander :",
      messageLines: ["1 × Poisson braisé", "2 × Bissap maison"],
      total: "Total :",
    },
  },

  video: {
    title: "Pendant le service, vous n'avez pas une minute.",
    text: "Alors tout se règle d'un geste, entre deux assiettes : un prix, une rupture, une commande à accepter.",
  },

  pricing: {
    eyebrow: "Tarifs",
    title: "Deux offres, sans surprise.",
    intro: "Pas de limite sur le nombre de plats, de photos ou de commandes. Pas de commission sur vos ventes.",
    perMonth: "par mois",
    stamp: "Essai gratuit · 14 jours",
    trial: "Essai gratuit de {days} jours avec toutes les fonctions. Sans engagement : vous arrêtez quand vous voulez.",
    includedLead: "Tout ce qu'il y a dans Menu, et en plus :",
    seats: "{count} accès pour votre équipe, chacun avec son rôle",
    cta: "Commencer l'essai gratuit",
    plans: {
      menu: {
        summary: "Votre carte en ligne, toujours à jour.",
        points: [
          "Votre page, à votre nom et à vos couleurs",
          "Plats, services et photos illimités",
          "Un QR Code qui ne change jamais",
          "Menu en français et en anglais",
          "Commande à emporter par WhatsApp",
          "Nombre de scans, jour par jour",
        ],
      },
      menu_orders: {
        summary: "La carte, et les commandes qui arrivent au comptoir.",
        points: [
          "Un QR Code par table ou par chambre",
          "Commande depuis la table",
          "Écran de commandes en direct au comptoir",
          "Avis des clients après leur commande",
          "Vos ventes, plat par plat",
        ],
      },
    },
    servicesEyebrow: "Un coup de main",
    servicesTitle: "Vous préférez qu'on s'en occupe ?",
    services: [
      {
        name: "Installation clé en main",
        text: "Nous saisissons votre menu, imprimons et posons vos QR Codes, et formons votre équipe. Vous n'avez rien à faire.",
        alt: "Un homme souriant, debout dans la salle claire d'un restaurant",
      },
      {
        name: "Séance photo de vos plats",
        text: "Un photographe partenaire vient chez vous et repart avec de quoi donner faim : vos plats, votre salle, votre équipe.",
        alt: "Un photographe, appareil en main, derrière une table dressée",
      },
    ],
    once: "une fois",
    onQuote: "Sur devis",
  },

  faq: {
    eyebrow: "Questions",
    title: "Ce qu'on nous demande souvent.",
    items: [
      {
        question: "Mes clients doivent-ils installer une application ?",
        answer:
          "Non. Ils ouvrent l'appareil photo de leur téléphone, visent le QR Code, et votre page s'affiche dans leur navigateur. Rien à télécharger, aucun compte à créer.",
      },
      {
        question: "Faut-il réimprimer le QR Code quand je change un prix ?",
        answer:
          "Jamais. Le QR Code mène toujours à la même adresse ; c'est le contenu de la page qui change. Vous imprimez une fois, vous modifiez autant que vous voulez.",
      },
      {
        question: "À quoi servent les accès pour mon équipe ?",
        answer:
          "Chaque personne de votre équipe se connecte avec son propre compte et ne voit que ce qui la concerne. Le serveur traite les commandes, la cuisine voit les plats à préparer, le gérant modifie le menu, et vous seul gérez l'abonnement. Personne ne partage de mot de passe, et vous retirez un accès d'un geste quand quelqu'un s'en va.",
      },
      {
        question: "Je ne suis pas à l'aise avec l'informatique. Est-ce pour moi ?",
        answer:
          "Oui. Tout se fait depuis un téléphone, comme écrire un message. Et si vous préférez ne rien faire vous-même, l'installation clé en main s'occupe de tout : saisie du menu, impression et pose des QR Codes, formation de votre équipe.",
      },
      {
        question: "Qui prend les photos ?",
        answer:
          "Vous, avec votre téléphone : un petit guide vous montre comment les réussir, et la page reste belle même sans photo. Si vous voulez mieux, un photographe partenaire peut venir chez vous.",
      },
      {
        question: "Comment se paie l'abonnement ?",
        answer:
          "Par Wave ou Orange Money, pour un mois ou plusieurs mois d'avance. Vous recevez un rappel avant l'échéance, et votre page n'est jamais coupée en plein service.",
      },
      {
        question: "Que se passe-t-il à la fin des 14 jours d'essai ?",
        answer:
          "Vous choisissez l'offre qui vous convient. Vos QR Codes restent les mêmes : ceux que vous avez posés pendant l'essai continuent de fonctionner.",
      },
    ],
  },

  cta: {
    title: "Votre carte en ligne dès ce soir.",
    text: "Quinze minutes pour créer votre page, un QR Code à poser, et 14 jours pour essayer gratuitement.",
    primary: "Créer mon menu",
    call: "Appeler le",
  },

  footer: {
    about:
      "La carte et les services en ligne des restaurants, maquis, bars, hôtels et résidences de Côte d'Ivoire. Un QR Code, et tout est toujours à jour.",
    product: "Le produit",
    contact: "Nous joindre",
    whatsapp: "Écrire sur WhatsApp",
    country: "Côte d'Ivoire",
    made: "Fait à Abidjan.",
    credits: "Photos et vidéo d'illustration : Pexels et Unsplash.",
    whatsappMessage: "Bonjour, j'ai une question sur Yéboué Tech.",
  },

  templates: {
    eyebrow: "Dix modèles",
    title: "Votre carte, dans le style de votre maison.",
    intro:
      "Du tableau noir du maquis à la carte d'hôtel : dix mises en page, chacune à vos couleurs. Vous en changez quand vous voulez, votre carte suit.",
    see: "Essayer ce modèle",
    descriptions: {
      braise: "De grandes photos en cartes, sous une couverture généreuse.",
      ardoise: "Le tableau noir du maquis, écrit à la craie.",
      "table-dhote": "La carte classique, sur papier ivoire.",
      comptoir: "L'ambiance de la nuit, les cocktails en grand.",
      palace: "Sobre et raffiné, les services en volets.",
      magazine: "Une mise en page de revue, en grands titres.",
      epure: "Presque rien : une liste nette, très rapide.",
      marche: "Des aplats de couleur, des étiquettes de prix.",
      carnet: "Le ticket de caisse, qui sort de l'imprimante.",
      vitrine: "Les plats en plein écran, à feuilleter.",
      gbaka: "La carrosserie peinte du minibus, ses bandes et son slogan.",
      enseigne: "L'enseigne peinte à la main, les prix en étoile.",
      pagne: "Le wax : des motifs à votre couleur, des cartes cousues.",
      garba: "De grandes assiettes rondes sur la toile cirée.",
      guirlande: "Le marché de nuit, sous sa guirlande d'ampoules.",
      ecolier: "Le cahier d'écolier, les prix entourés au stylo rouge.",
      stade: "Le jour de match : tableau à volets et numéros de maillot.",
    },
  },
  solutionPage: {
    storyEyebrow: "Comment ça marche",
    benefitsEyebrow: "Ce que vous y gagnez",
    othersTitle: "Vous tenez un autre établissement ?",
    pricingLink: "Voir les tarifs",
  },


  solutions: {
    restaurants: {
      name: "Restaurants",
      card: "Une carte toujours juste, en français et en anglais.",
      cardAlt: "Une équipe en tablier sert des clients au comptoir d'un restaurant",
      eyebrow: "Pour les restaurants",
      title: "Votre carte, toujours juste, sur chaque table.",
      intro: "Vos clients lisent la carte, choisissent et commandent depuis leur table. Vous changez un plat ou un prix en dix secondes, sans rien réimprimer.",
      heroAlt: "Une équipe en tablier sert des clients au comptoir d'un restaurant",
      storyTitle: "De la table à la cuisine, en quatre gestes.",
      storyIntro: "Ce que vit un client qui s'assoit chez vous, et ce que voient la salle et la cuisine.",
      steps: [
        {
          title: "Le client scanne à sa table",
          text: "Il ouvre l'appareil photo de son téléphone et vise le QR Code. Aucune application à installer, aucun compte à créer.",
        },
        {
          title: "Votre carte s'ouvre",
          text: "Entrées, plats, desserts, boissons, avec vos photos. En français, ou en anglais pour vos clients de passage.",
        },
        {
          title: "Il choisit sans attendre",
          text: "Une grande photo, une description claire, le prix. Il compose sa commande pendant que vos serveurs s'occupent des autres tables.",
        },
        {
          title: "La salle et la cuisine reçoivent la commande",
          text: "Elle s'affiche aussitôt, avec le numéro de la table. Plus de commande mal notée : c'est le client qui l'a écrite.",
        },
      ],
      screens: {
        scan: { hint: "Visez le QR Code de la table" },
        list: {
          title: "Le Palmier",
          subtitle: "Restaurant · Plateau · Ouvert jusqu'à 23 h",
          tabs: ["Plats", "Grillades", "Boissons"],
          items: [
            { name: "Riz gras, alloco", detail: "Riz à la tomate, banane frite", price: 4000 },
            { name: "Foutou, sauce graine", detail: "Au poisson fumé", price: 4500 },
            { name: "Brochettes de poulet", detail: "Marinées, au charbon", price: 5000 },
            { name: "Bissap maison", detail: "Le verre", price: 1000 },
          ],
          action: "Voir mon panier",
          amount: 5000,
        },
        detail: {
          title: "Riz gras, alloco",
          text: "Riz parfumé à la tomate, alloco doré et sauce de la maison. Servi avec du poulet ou du poisson, au choix.",
          price: 4000,
          action: "Ajouter au panier",
        },
        confirm: {
          title: "Commande envoyée",
          subtitle: "Table 7 · Le Palmier",
          lines: [
            { label: "1 × Riz gras, alloco", amount: 4000 },
            { label: "1 × Bissap maison", amount: 1000 },
          ],
          totalLabel: "Total",
          total: 5000,
          stages: ["Envoyée", "En préparation", "Prête"],
          live: "Suivi en direct",
        },
        ticket: {
          title: "Table 7",
          when: "À l'instant",
          badge: "Nouvelle",
          lines: ["1 × Riz gras, alloco", "1 × Bissap maison"],
          refuse: "Refuser",
          accept: "Accepter",
        },
      },
      benefitsTitle: "Une salle qui tourne mieux.",
      benefits: [
        {
          title: "Une carte en deux langues",
          text: "Vos clients étrangers lisent la carte en anglais, sans que vous imprimiez une deuxième version.",
        },
        {
          title: "Moins d'attente, plus de couverts",
          text: "La commande part pendant que le serveur est ailleurs. L'appel du serveur et la demande de l'addition se font aussi depuis la table.",
        },
        {
          title: "La carte que vous voulez, ce soir",
          text: "Un plat du jour, une suggestion du chef, une rupture : la carte suit votre cuisine, pas l'imprimeur.",
        },
      ],
    },

    maquis: {
      name: "Maquis",
      card: "Le poisson du jour au prix du jour, affiché en dix secondes.",
      cardAlt: "Des poissons en train de griller sur un barbecue",
      eyebrow: "Pour les maquis",
      title: "Le poisson du jour, au prix du jour.",
      intro: "Ce matin la carpe a changé de prix, ce soir il n'y a plus de poulet : votre carte le dit toute seule. Vos clients commandent sur place ou à emporter.",
      heroAlt: "Des poissons en train de griller sur un barbecue",
      storyTitle: "Du scan à la braise, en quatre gestes.",
      storyIntro: "Un soir chez vous : ce que vit le client, et ce que vous voyez de votre côté.",
      steps: [
        {
          title: "Le client scanne",
          text: "Il ouvre l'appareil photo de son téléphone et vise le QR Code posé sur la table. Aucune application à installer, aucun compte à créer.",
        },
        {
          title: "Votre menu s'ouvre",
          text: "Vos plats, vos photos, vos prix du jour. La page est légère : elle s'ouvre vite, même quand le réseau est faible.",
        },
        {
          title: "Il choisit",
          text: "Une grande photo, une description claire, le prix. Il ajoute le plat à son panier sans attendre qu'on vienne à sa table.",
        },
        {
          title: "La commande arrive au comptoir",
          text: "Elle s'affiche aussitôt sur votre téléphone ou votre tablette, avec le numéro de la table. Le client suit sa commande jusqu'à ce qu'elle soit prête.",
        },
      ],
      screens: {
        scan: { hint: "Visez le QR Code de la table" },
        list: {
          title: "Chez Tantie",
          subtitle: "Maquis · Cocody · Ouvert jusqu'à 23 h",
          tabs: ["Grillades", "Plats", "Boissons"],
          items: [
            { name: "Poisson braisé", detail: "Carpe, oignons, piment", price: 4500 },
            { name: "Brochettes de poulet", detail: "Servies avec du riz gras", price: 3500 },
            { name: "Alloco", detail: "Banane plantain frite", price: 1000 },
            { name: "Bissap maison", detail: "Le verre", price: 500 },
          ],
          action: "Voir mon panier",
          amount: 4500,
        },
        detail: {
          title: "Brochettes de poulet",
          text: "Poulet mariné, poivrons et oignons, grillés au charbon. Servies avec du riz gras et la sauce de la maison.",
          price: 3500,
          action: "Ajouter au panier",
        },
        confirm: {
          title: "Commande envoyée",
          subtitle: "Table 12 · Chez Tantie",
          lines: [
            { label: "1 × Brochettes de poulet", amount: 3500 },
            { label: "1 × Alloco", amount: 1000 },
          ],
          totalLabel: "Total",
          total: 4500,
          stages: ["Envoyée", "En préparation", "Prête"],
          live: "Suivi en direct",
        },
        ticket: {
          title: "Table 12",
          when: "À l'instant",
          badge: "Nouvelle",
          lines: ["1 × Brochettes de poulet", "1 × Alloco"],
          refuse: "Refuser",
          accept: "Accepter",
        },
      },
      benefitsTitle: "Votre ardoise, en mieux.",
      benefits: [
        {
          title: "Le prix du jour, en dix secondes",
          text: "Vous changez le prix du poisson le matin, depuis votre téléphone. Le soir, tout le monde voit le bon.",
        },
        {
          title: "Plus de « il n'y en a plus »",
          text: "Un plat est fini ? Vous le retirez d'un geste, et il n'apparaît plus sur la carte jusqu'à demain.",
        },
        {
          title: "À emporter, par WhatsApp",
          text: "Le client prépare sa commande sur votre page et vous l'envoie sur WhatsApp, déjà rédigée, total compris.",
        },
      ],
    },

    "bars-lounges": {
      name: "Bars et lounges",
      card: "Vos cocktails en photo, vos soirées à l'affiche.",
      cardAlt: "Le comptoir éclairé d'un bar",
      eyebrow: "Pour les bars et les lounges",
      title: "Vos cocktails en photo, la commande sans lever la main.",
      intro: "Dans la musique, on ne s'entend pas. Vos clients lisent la carte, commandent leur tournée depuis leur table, et le bar reçoit tout par écrit.",
      heroAlt: "Un barman prépare une rangée de cocktails colorés",
      storyTitle: "De la table au bar, en quatre gestes.",
      storyIntro: "Une soirée chez vous : ce que vit le client, et ce que voit le bar.",
      steps: [
        {
          title: "Le client scanne, sans quitter sa place",
          text: "Le QR Code est sur la table haute ou sur le comptoir. Il le vise avec son téléphone : aucune application à installer.",
        },
        {
          title: "Votre carte s'ouvre",
          text: "Cocktails, bières, bouteilles, de quoi grignoter. Chaque cocktail a sa photo et sa recette, et la formule de la soirée s'affiche aux heures que vous avez choisies.",
        },
        {
          title: "Il commande sa tournée",
          text: "Deux cocktails, une planche à partager : il compose sa commande sans attendre qu'un serveur passe.",
        },
        {
          title: "Le bar reçoit la commande",
          text: "Elle arrive par écrit, avec le numéro de la table. Plus de commande criée par-dessus la musique, plus d'oubli.",
        },
      ],
      screens: {
        scan: { hint: "Visez le QR Code de la table" },
        list: {
          title: "Le Baobab Lounge",
          subtitle: "Bar · Zone 4 · Ouvert jusqu'à 3 h",
          tabs: ["Cocktails", "Bières", "À partager"],
          items: [
            { name: "Mojito passion", detail: "Menthe, citron vert, passion", price: 5000 },
            { name: "Bissap spritz", detail: "Bissap, gingembre, bulles", price: 4500 },
            { name: "Planteur maison", detail: "Jus de fruits frais", price: 5000 },
            { name: "Alloco à partager", detail: "Avec la sauce piment", price: 2500 },
          ],
          action: "Voir ma commande",
          amount: 9500,
        },
        detail: {
          title: "Bissap spritz",
          text: "Bissap maison, gingembre frais, citron vert et eau pétillante. Servi très frais, avec ou sans alcool.",
          price: 4500,
          action: "Ajouter à la commande",
        },
        confirm: {
          title: "Commande envoyée",
          subtitle: "Table haute 4 · Le Baobab",
          lines: [
            { label: "1 × Mojito passion", amount: 5000 },
            { label: "1 × Bissap spritz", amount: 4500 },
          ],
          totalLabel: "Total",
          total: 9500,
          stages: ["Envoyée", "En préparation", "Servie"],
          live: "Suivi en direct",
        },
        ticket: {
          title: "Table haute 4",
          when: "À l'instant",
          badge: "Nouvelle",
          lines: ["1 × Mojito passion", "1 × Bissap spritz"],
          refuse: "Refuser",
          accept: "Accepter",
        },
      },
      benefitsTitle: "Un bar qui sert plus vite.",
      benefits: [
        {
          title: "Une carte qui donne soif",
          text: "Un cocktail en photo se commande plus qu'un nom sur une liste. Vous ajoutez la création de la semaine en une minute.",
        },
        {
          title: "La formule de la soirée, à l'heure",
          text: "Vous réglez les heures une fois : la promotion s'affiche et disparaît toute seule.",
        },
        {
          title: "Moins de monde devant le comptoir",
          text: "Les commandes arrivent par écrit, table par table. Vos barmans préparent au lieu de noter.",
        },
      ],
    },

    hotels: {
      name: "Hôtels",
      card: "La carte et les services de la maison, dans chaque chambre.",
      cardAlt: "Un employé prépare le lit d'une chambre d'hôtel",
      eyebrow: "Pour les hôtels",
      title: "Tout votre hôtel, dans le téléphone du client.",
      intro: "Le code Wi-Fi, l'heure du petit-déjeuner, la carte du room service, une serviette en plus : le client trouve tout en scannant le QR Code de sa chambre.",
      heroAlt: "Un petit-déjeuner servi en chambre sur une table dressée",
      storyTitle: "De la chambre à la réception, en quatre gestes.",
      storyIntro: "Ce que vit un client dans sa chambre, et ce que voit la réception.",
      steps: [
        {
          title: "Le client scanne dans sa chambre",
          text: "Un QR Code l'attend sur le bureau ou la table de chevet. Il le vise avec son téléphone : aucune application à installer.",
        },
        {
          title: "Tout l'hôtel s'ouvre",
          text: "Le Wi-Fi, les horaires, le restaurant, le room service, les numéros utiles. En français ou en anglais : fini le classeur plastifié.",
        },
        {
          title: "Il commande ou demande un service",
          text: "Un petit-déjeuner en chambre, une serviette en plus, un départ tardif : il choisit et valide, sans décrocher le téléphone.",
        },
        {
          title: "La réception reçoit la demande",
          text: "Elle s'affiche aussitôt, avec le numéro de la chambre. Le client voit que sa demande est prise en charge.",
        },
      ],
      screens: {
        scan: { hint: "Visez le QR Code de la chambre" },
        list: {
          title: "Hôtel La Lagune",
          subtitle: "Chambre 204 · Bienvenue",
          tabs: ["Services", "Restaurant", "Infos"],
          items: [
            { name: "Wi-Fi", detail: "Réseau et code d'accès", note: "Gratuit" },
            { name: "Petit-déjeuner en chambre", detail: "De 6 h 30 à 10 h 30", price: 7500 },
            { name: "Room service", detail: "La carte, jusqu'à 23 h" },
            { name: "Ménage et serviettes", detail: "Sur simple demande", note: "Inclus" },
          ],
          action: "Appeler la réception",
        },
        detail: {
          title: "Petit-déjeuner en chambre",
          text: "Viennoiseries, fruits frais, œufs au choix, café ou thé. Servi dans votre chambre à l'heure que vous choisissez.",
          price: 7500,
          action: "Commander",
        },
        confirm: {
          title: "Demande envoyée",
          subtitle: "Chambre 204 · Hôtel La Lagune",
          lines: [{ label: "1 × Petit-déjeuner en chambre", amount: 7500 }, { label: "Servi à 7 h 30" }],
          totalLabel: "Ajouté à votre note",
          total: 7500,
          stages: ["Reçue", "En préparation", "En route"],
          live: "Suivi en direct",
        },
        ticket: {
          title: "Chambre 204",
          when: "À l'instant",
          badge: "Nouvelle",
          lines: ["1 × Petit-déjeuner en chambre", "Servi à 7 h 30"],
          refuse: "Refuser",
          accept: "Accepter",
        },
      },
      benefitsTitle: "Une réception plus tranquille.",
      benefits: [
        {
          title: "Fini le classeur dans la chambre",
          text: "Un tarif change, un horaire bouge : vous le modifiez une fois, toutes les chambres sont à jour.",
        },
        {
          title: "Le room service sans téléphone",
          text: "Le client commande par écrit. La réception n'a plus à noter, et la cuisine reçoit une commande claire.",
        },
        {
          title: "En anglais pour vos clients étrangers",
          text: "La même page se lit en français ou en anglais : le client choisit d'un geste.",
        },
      ],
    },

    residences: {
      name: "Résidences",
      card: "Le guide du logement et vos services, à portée de téléphone.",
      cardAlt: "Le salon lumineux d'un appartement meublé",
      eyebrow: "Pour les résidences meublées",
      title: "Le guide de l'appartement, et vos services en plus.",
      intro: "Le code Wi-Fi, la climatisation, les règles de la maison, le ménage à la demande : votre locataire trouve tout seul, et vous recevez moins d'appels.",
      heroAlt: "Le salon lumineux d'un appartement meublé",
      storyTitle: "De l'arrivée à la demande, en quatre gestes.",
      storyIntro: "Ce que vit un locataire qui s'installe, et ce que vous recevez.",
      steps: [
        {
          title: "Le locataire scanne en arrivant",
          text: "Le QR Code est à l'entrée ou sur la table du salon. Vous pouvez aussi lui envoyer le lien par WhatsApp avant son arrivée.",
        },
        {
          title: "Le guide du logement s'ouvre",
          text: "Le Wi-Fi, la climatisation, le chauffe-eau, les règles de la maison, vos contacts. Tout ce qu'on vous demande d'habitude au téléphone.",
        },
        {
          title: "Il demande un service",
          text: "Un ménage, du linge propre, un petit-déjeuner, la navette pour l'aéroport : il choisit, le prix est affiché.",
        },
        {
          title: "Vous recevez la demande",
          text: "Elle arrive sur votre téléphone, avec le numéro de l'appartement. Vous confirmez d'un geste.",
        },
      ],
      screens: {
        scan: { hint: "Visez le QR Code de l'appartement" },
        list: {
          title: "Les Cocotiers",
          subtitle: "Appartement B2 · Bienvenue",
          tabs: ["Guide", "Services", "Contacts"],
          items: [
            { name: "Wi-Fi", detail: "Réseau et code d'accès", note: "Inclus" },
            { name: "Ménage", detail: "Passage dans la journée", price: 5000 },
            { name: "Petit-déjeuner", detail: "Livré à l'appartement", price: 4000 },
            { name: "Navette aéroport", detail: "À réserver la veille", price: 15000 },
          ],
          action: "Écrire au gérant",
        },
        detail: {
          title: "Ménage de l'appartement",
          text: "Sols, salle de bain, cuisine et changement des draps. Choisissez le moment qui vous arrange.",
          price: 5000,
          action: "Demander",
        },
        confirm: {
          title: "Demande envoyée",
          subtitle: "Appartement B2 · Les Cocotiers",
          lines: [{ label: "1 × Ménage de l'appartement", amount: 5000 }, { label: "Demain, dans la matinée" }],
          totalLabel: "À régler sur place",
          total: 5000,
          stages: ["Reçue", "Confirmée", "Faite"],
          live: "Suivi en direct",
        },
        ticket: {
          title: "Appartement B2",
          when: "À l'instant",
          badge: "Nouvelle",
          lines: ["1 × Ménage de l'appartement", "Demain, dans la matinée"],
          refuse: "Refuser",
          accept: "Confirmer",
        },
      },
      benefitsTitle: "Moins d'appels, plus de services.",
      benefits: [
        {
          title: "Le code Wi-Fi sans vous déranger",
          text: "Les questions de tous les jours ont leur réponse dans le guide. Votre téléphone sonne moins.",
        },
        {
          title: "Des services, donc des revenus",
          text: "Ménage, linge, petit-déjeuner, navette : ce que vous proposez est affiché avec son prix, et se demande en deux gestes.",
        },
        {
          title: "Un lien à envoyer avant l'arrivée",
          text: "L'adresse, le plan d'accès, les consignes d'entrée : le locataire a tout avant même d'être là.",
        },
      ],
    },
  },
};

export const fr = withFrenchSpaces(texts);
