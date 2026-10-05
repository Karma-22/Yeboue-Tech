import type { Dictionary } from "../types";

/* Les textes anglais du site vitrine. Même forme que le français, champ pour champ. */
export const en: Dictionary = {
  meta: {
    title: "Your menu and services online, with a QR code",
    description:
      "Restaurants, maquis, bars, hotels and serviced apartments: put your menu and services online, set a QR code on the table, and change your prices yourself from your phone.",
  },

  nav: {
    audiences: "Who it's for",
    how: "How it works",
    pricing: "Pricing",
    faq: "Questions",
    cta: "Create my menu",
    openMenu: "Open the menu",
    menuTitle: "Menu",
    solutions: "Your venue",
    language: "Language",
    switchTo: "Français",
    toDark: "Switch to dark mode",
    toLight: "Switch to light mode",
    theme: "Appearance",
  },

  hero: {
    rotating: [
      { eyebrow: "For restaurants and maquis", lead: "Your menu" },
      { eyebrow: "For bars and lounges", lead: "Your drinks list" },
      { eyebrow: "For hotels", lead: "Your services" },
      { eyebrow: "For serviced apartments", lead: "Your guide" },
    ],
    titleRest: "online in 15 minutes.",
    text: "One QR code on the table, at the bar or in the room: your guests see your dishes, drinks and services, with your photos and today's prices. You change everything yourself, from your phone, and never reprint.",
    primary: "Create my menu",
    secondary: "See how it works",
    assurances: "Free 14-day trial · No commitment · No app to install",
    photoAlt: "Two guests at a table looking at a menu on a phone",
  },

  audiences: {
    eyebrow: "Who it's for",
    title: "From the local maquis to the hotel.",
    intro: "One tool for every kind of house. You add your name, your colours, your dishes or your services.",
    more: "See how it works",
  },

  story: {
    eyebrow: "How it works",
    title: "From scan to kitchen in four steps.",
    intro: "An example: one evening in a maquis. Here is what the guest sees, and what you see on your side.",
    others: "Running a different kind of venue? See how it works for you:",
  },

  features: {
    eyebrow: "What changes for you",
    title: "Less paper, fewer trips back and forth.",
    items: [
      {
        title: "You change a price in ten seconds.",
        text: "A dish that has run out, a new price, today's special: you do it yourself, from your phone. Your guests see it on the next scan.",
        points: [
          "Unlimited dishes, services and photos",
          "A sold-out dish comes off the menu in one tap",
          "Specials and promotions shown at the hours you choose",
        ],
        alt: "A manager in an apron, sitting at a table in her restaurant, on the phone",
      },
      {
        title: "You print once, for good.",
        text: "The QR code leads to an address that never changes. Edit your menu as often as you like: nothing to reprint, nothing to stick again.",
        points: [
          "One QR code for the house, or one per table and per room",
          "Posters and sheets ready to print",
          "The same link for Instagram, WhatsApp and your Google listing",
        ],
        alt: "A small stand with a QR code on a restaurant table",
      },
      {
        title: "The order reaches the counter, no shouting.",
        text: "The guest orders from the table or the room. The order appears on your side at once, with a chime and the table number. You accept it in one tap.",
        points: [
          "An order screen on any phone or tablet",
          "The guest follows the order: accepted, ready, served",
          "Call the waiter and ask for the bill from the table",
        ],
        alt: "A chef flambéing a pan in an open kitchen",
      },
      {
        title: "Takeaway? The order goes out on WhatsApp.",
        text: "The guest fills a basket on your page and sends it to your WhatsApp, already written out. You agree the time and the delivery with them, as usual.",
        points: [
          "Nothing new for your team to learn",
          "The total is worked out, the dishes are listed",
          "Included in both plans",
        ],
        alt: "A guest sitting at a café table looking at her phone",
      },
    ],
    crumbs: {
      dish: "Grilled fish",
      price: "Price",
      available: "Available today",
      address: "Your page address",
      never: "Never changes",
      message: "Message ready to send",
      hello: "Hello, I would like to order:",
      messageLines: ["1 × Grilled fish", "2 × House bissap"],
      total: "Total:",
    },
  },

  video: {
    title: "During service, you don't have a minute.",
    text: "So everything takes one tap, between two plates: a price, a sold-out dish, an order to accept.",
  },

  pricing: {
    eyebrow: "Pricing",
    title: "Two plans, no surprises.",
    intro: "No limit on dishes, photos or orders. No commission on your sales.",
    perMonth: "per month",
    stamp: "Free trial · 14 days",
    trial: "Free {days}-day trial with every feature. No commitment: stop whenever you like.",
    includedLead: "Everything in Menu, plus:",
    seats: "{count} logins for your team, each with its own role",
    cta: "Start the free trial",
    plans: {
      menu: {
        summary: "Your menu online, always up to date.",
        points: [
          "Your page, with your name and your colours",
          "Unlimited dishes, services and photos",
          "A QR code that never changes",
          "Menu in French and English",
          "Takeaway orders by WhatsApp",
          "Number of scans, day by day",
        ],
      },
      menu_orders: {
        summary: "The menu, plus orders arriving at the counter.",
        points: [
          "One QR code per table or per room",
          "Ordering from the table",
          "Live order screen at the counter",
          "Guest reviews and loyalty card",
          "Your sales, dish by dish",
        ],
      },
    },
    servicesEyebrow: "A helping hand",
    servicesTitle: "Would you rather we handle it?",
    services: [
      {
        name: "Turnkey setup",
        text: "We enter your menu, print and place your QR codes, and train your team. You have nothing to do.",
        alt: "A smiling man standing in the bright dining room of a restaurant",
      },
      {
        name: "Photo shoot of your dishes",
        text: "A partner photographer comes to you and leaves with pictures that make people hungry: your dishes, your room, your team.",
        alt: "A photographer, camera in hand, behind a laid table",
      },
    ],
    once: "one-off",
    onQuote: "On quote",
  },

  faq: {
    eyebrow: "Questions",
    title: "What we get asked most.",
    items: [
      {
        question: "Do my guests need to install an app?",
        answer:
          "No. They open their phone camera, point it at the QR code, and your page opens in their browser. Nothing to download, no account to create.",
      },
      {
        question: "Do I have to reprint the QR code when I change a price?",
        answer:
          "Never. The QR code always leads to the same address; only the content of the page changes. Print once, edit as often as you like.",
      },
      {
        question: "What are the team logins for?",
        answer:
          "Each member of your team signs in with their own account and only sees what concerns them. The waiter handles orders, the kitchen sees what to prepare, the manager edits the menu, and only you manage the subscription. Nobody shares a password, and you remove a login in one tap when someone leaves.",
      },
      {
        question: "I am not comfortable with computers. Is this for me?",
        answer:
          "Yes. Everything is done from a phone, like writing a message. And if you would rather not do it yourself, the turnkey setup covers everything: entering the menu, printing and placing the QR codes, training your team.",
      },
      {
        question: "Who takes the photos?",
        answer:
          "You do, with your phone: a short guide shows you how to get them right, and the page still looks good without photos. If you want better, a partner photographer can come to you.",
      },
      {
        question: "How do I pay for the subscription?",
        answer:
          "By Wave or Orange Money, for one month or several months in advance. You get a reminder before the due date, and your page is never cut off in the middle of service.",
      },
      {
        question: "What happens when the 14-day trial ends?",
        answer:
          "You choose the plan that suits you. Your QR codes stay the same: the ones you placed during the trial keep working.",
      },
    ],
  },

  cta: {
    title: "Your menu online by tonight.",
    text: "Fifteen minutes to create your page, one QR code to place, and 14 days to try it for free.",
    primary: "Create my menu",
    call: "Call",
  },

  footer: {
    about:
      "Online menus and services for restaurants, maquis, bars, hotels and serviced apartments in Côte d'Ivoire. One QR code, and everything stays up to date.",
    product: "Product",
    contact: "Get in touch",
    whatsapp: "Write on WhatsApp",
    country: "Côte d'Ivoire",
    made: "Made in Abidjan.",
    credits: "Illustrative photos and video: Pexels and Unsplash.",
    whatsappMessage: "Hello, I have a question about Yéboué Tech.",
  },

  solutionPage: {
    storyEyebrow: "How it works",
    benefitsEyebrow: "What you gain",
    othersTitle: "Running a different kind of venue?",
    pricingLink: "See pricing",
  },

  signupMessage: "Hello, I would like to create the menu for my venue.",

  solutions: {
    restaurants: {
      name: "Restaurants",
      card: "A menu that is always right, in French and English.",
      cardAlt: "A team in aprons serving guests at a restaurant counter",
      eyebrow: "For restaurants",
      title: "Your menu, always right, on every table.",
      intro: "Your guests read the menu, choose and order from their table. You change a dish or a price in ten seconds, with nothing to reprint.",
      heroAlt: "A team in aprons serving guests at a restaurant counter",
      storyTitle: "From table to kitchen in four steps.",
      storyIntro: "What a guest experiences when they sit down, and what the floor and the kitchen see.",
      steps: [
        {
          title: "The guest scans at the table",
          text: "They open their phone camera and point it at the QR code. No app to install, no account to create.",
        },
        {
          title: "Your menu opens",
          text: "Starters, mains, desserts, drinks, with your photos. In French, or in English for your visiting guests.",
        },
        {
          title: "They choose without waiting",
          text: "A large photo, a clear description, the price. They build their order while your waiters look after other tables.",
        },
        {
          title: "The floor and the kitchen get the order",
          text: "It appears at once, with the table number. No more orders taken down wrong: the guest wrote it.",
        },
      ],
      screens: {
        scan: { hint: "Point at the table's QR code" },
        list: {
          title: "Le Palmier",
          subtitle: "Restaurant · Plateau · Open until 11 pm",
          tabs: ["Mains", "Grill", "Drinks"],
          items: [
            { name: "Riz gras with alloco", detail: "Tomato rice, fried plantain", price: 4000 },
            { name: "Foutou, palm nut sauce", detail: "With smoked fish", price: 4500 },
            { name: "Chicken skewers", detail: "Marinated, charcoal-grilled", price: 5000 },
            { name: "House bissap", detail: "By the glass", price: 1000 },
          ],
          action: "View my basket",
          amount: 5000,
        },
        detail: {
          title: "Riz gras with alloco",
          text: "Fragrant tomato rice, golden fried plantain and the house sauce. Served with chicken or fish, as you prefer.",
          price: 4000,
          action: "Add to basket",
        },
        confirm: {
          title: "Order sent",
          subtitle: "Table 7 · Le Palmier",
          lines: [
            { label: "1 × Riz gras with alloco", amount: 4000 },
            { label: "1 × House bissap", amount: 1000 },
          ],
          totalLabel: "Total",
          total: 5000,
          stages: ["Sent", "Being prepared", "Ready"],
          live: "Live tracking",
        },
        ticket: {
          title: "Table 7",
          when: "Just now",
          badge: "New",
          lines: ["1 × Riz gras with alloco", "1 × House bissap"],
          refuse: "Decline",
          accept: "Accept",
        },
      },
      benefitsTitle: "A floor that runs smoother.",
      benefits: [
        {
          title: "A menu in two languages",
          text: "Your foreign guests read the menu in English, without you printing a second version.",
        },
        {
          title: "Less waiting, more covers",
          text: "The order goes out while the waiter is elsewhere. Calling the waiter and asking for the bill also happen from the table.",
        },
        {
          title: "The menu you want, tonight",
          text: "A dish of the day, a chef's suggestion, a sold-out item: the menu follows your kitchen, not the printer.",
        },
      ],
    },

    maquis: {
      name: "Maquis",
      card: "Today's fish at today's price, shown in ten seconds.",
      cardAlt: "Fish grilling on a barbecue",
      eyebrow: "For maquis",
      title: "Today's fish, at today's price.",
      intro: "This morning the carp changed price, tonight the chicken has run out: your menu says so by itself. Your guests order on the spot or to take away.",
      heroAlt: "Fish grilling on a barbecue",
      storyTitle: "From scan to grill in four steps.",
      storyIntro: "One evening at your place: what the guest sees, and what you see on your side.",
      steps: [
        {
          title: "The guest scans",
          text: "They open their phone camera and point it at the QR code on the table. No app to install, no account to create.",
        },
        {
          title: "Your menu opens",
          text: "Your dishes, your photos, today's prices. The page is light: it opens fast, even on a weak network.",
        },
        {
          title: "They choose",
          text: "A large photo, a clear description, the price. They add the dish to their basket without waiting for someone to come over.",
        },
        {
          title: "The order reaches the counter",
          text: "It appears at once on your phone or tablet, with the table number. The guest follows the order until it is ready.",
        },
      ],
      screens: {
        scan: { hint: "Point at the table's QR code" },
        list: {
          title: "Chez Tantie",
          subtitle: "Maquis · Cocody · Open until 11 pm",
          tabs: ["Grill", "Mains", "Drinks"],
          items: [
            { name: "Grilled fish", detail: "Carp, onions, chilli", price: 4500 },
            { name: "Chicken skewers", detail: "Served with riz gras", price: 3500 },
            { name: "Alloco", detail: "Fried plantain", price: 1000 },
            { name: "House bissap", detail: "By the glass", price: 500 },
          ],
          action: "View my basket",
          amount: 4500,
        },
        detail: {
          title: "Chicken skewers",
          text: "Marinated chicken, peppers and onions, grilled over charcoal. Served with riz gras and the house sauce.",
          price: 3500,
          action: "Add to basket",
        },
        confirm: {
          title: "Order sent",
          subtitle: "Table 12 · Chez Tantie",
          lines: [
            { label: "1 × Chicken skewers", amount: 3500 },
            { label: "1 × Alloco", amount: 1000 },
          ],
          totalLabel: "Total",
          total: 4500,
          stages: ["Sent", "Being prepared", "Ready"],
          live: "Live tracking",
        },
        ticket: {
          title: "Table 12",
          when: "Just now",
          badge: "New",
          lines: ["1 × Chicken skewers", "1 × Alloco"],
          refuse: "Decline",
          accept: "Accept",
        },
      },
      benefitsTitle: "Your chalkboard, only better.",
      benefits: [
        {
          title: "Today's price in ten seconds",
          text: "You change the price of the fish in the morning, from your phone. By evening, everyone sees the right one.",
        },
        {
          title: "No more \"we've run out\"",
          text: "A dish is finished? You take it off in one tap, and it stays off the menu until tomorrow.",
        },
        {
          title: "Takeaway, by WhatsApp",
          text: "The guest prepares the order on your page and sends it to your WhatsApp, already written out, total included.",
        },
      ],
    },

    "bars-lounges": {
      name: "Bars and lounges",
      card: "Your cocktails in pictures, your nights on show.",
      cardAlt: "The lit counter of a bar",
      eyebrow: "For bars and lounges",
      title: "Your cocktails in pictures, orders without waving.",
      intro: "With the music on, nobody can hear. Your guests read the list, order their round from the table, and the bar gets it all in writing.",
      heroAlt: "A bartender preparing a row of colourful cocktails",
      storyTitle: "From table to bar in four steps.",
      storyIntro: "One night at your place: what the guest sees, and what the bar sees.",
      steps: [
        {
          title: "The guest scans, without leaving their seat",
          text: "The QR code is on the high table or on the counter. They point their phone at it: no app to install.",
        },
        {
          title: "Your list opens",
          text: "Cocktails, beers, bottles, something to nibble. Every cocktail has its photo and recipe, and tonight's offer shows at the hours you chose.",
        },
        {
          title: "They order their round",
          text: "Two cocktails, a plate to share: they build the order without waiting for a waiter to pass.",
        },
        {
          title: "The bar gets the order",
          text: "It arrives in writing, with the table number. No more orders shouted over the music, nothing forgotten.",
        },
      ],
      screens: {
        scan: { hint: "Point at the table's QR code" },
        list: {
          title: "Le Baobab Lounge",
          subtitle: "Bar · Zone 4 · Open until 3 am",
          tabs: ["Cocktails", "Beers", "To share"],
          items: [
            { name: "Passion mojito", detail: "Mint, lime, passion fruit", price: 5000 },
            { name: "Bissap spritz", detail: "Bissap, ginger, bubbles", price: 4500 },
            { name: "House planter's punch", detail: "Fresh fruit juices", price: 5000 },
            { name: "Alloco to share", detail: "With chilli sauce", price: 2500 },
          ],
          action: "View my order",
          amount: 9500,
        },
        detail: {
          title: "Bissap spritz",
          text: "House bissap, fresh ginger, lime and sparkling water. Served very cold, with or without alcohol.",
          price: 4500,
          action: "Add to order",
        },
        confirm: {
          title: "Order sent",
          subtitle: "High table 4 · Le Baobab",
          lines: [
            { label: "1 × Passion mojito", amount: 5000 },
            { label: "1 × Bissap spritz", amount: 4500 },
          ],
          totalLabel: "Total",
          total: 9500,
          stages: ["Sent", "Being prepared", "Served"],
          live: "Live tracking",
        },
        ticket: {
          title: "High table 4",
          when: "Just now",
          badge: "New",
          lines: ["1 × Passion mojito", "1 × Bissap spritz"],
          refuse: "Decline",
          accept: "Accept",
        },
      },
      benefitsTitle: "A bar that serves faster.",
      benefits: [
        {
          title: "A list that makes people thirsty",
          text: "A cocktail with a photo sells better than a name on a list. You add this week's creation in a minute.",
        },
        {
          title: "Tonight's offer, on time",
          text: "Set the hours once: the promotion appears and disappears by itself.",
        },
        {
          title: "Fewer people queuing at the counter",
          text: "Orders arrive in writing, table by table. Your bartenders mix instead of taking notes.",
        },
      ],
    },

    hotels: {
      name: "Hotels",
      card: "The menu and the services of the house, in every room.",
      cardAlt: "A staff member making the bed in a hotel room",
      eyebrow: "For hotels",
      title: "Your whole hotel, in the guest's phone.",
      intro: "The Wi-Fi code, breakfast hours, the room service menu, an extra towel: the guest finds everything by scanning the QR code in the room.",
      heroAlt: "Breakfast served in a hotel room on a laid table",
      storyTitle: "From room to reception in four steps.",
      storyIntro: "What a guest experiences in the room, and what reception sees.",
      steps: [
        {
          title: "The guest scans in the room",
          text: "A QR code is waiting on the desk or the bedside table. They point their phone at it: no app to install.",
        },
        {
          title: "The whole hotel opens",
          text: "Wi-Fi, opening hours, the restaurant, room service, useful numbers. In French or English: no more laminated folder.",
        },
        {
          title: "They order or ask for a service",
          text: "Breakfast in the room, an extra towel, a late check-out: they choose and confirm, without picking up the phone.",
        },
        {
          title: "Reception gets the request",
          text: "It appears at once, with the room number. The guest can see the request is being handled.",
        },
      ],
      screens: {
        scan: { hint: "Point at the room's QR code" },
        list: {
          title: "Hôtel La Lagune",
          subtitle: "Room 204 · Welcome",
          tabs: ["Services", "Restaurant", "Info"],
          items: [
            { name: "Wi-Fi", detail: "Network and access code", note: "Free" },
            { name: "Breakfast in your room", detail: "From 6:30 to 10:30 am", price: 7500 },
            { name: "Room service", detail: "The menu, until 11 pm" },
            { name: "Housekeeping and towels", detail: "Just ask", note: "Included" },
          ],
          action: "Call reception",
        },
        detail: {
          title: "Breakfast in your room",
          text: "Pastries, fresh fruit, eggs any style, coffee or tea. Served in your room at the time you choose.",
          price: 7500,
          action: "Order",
        },
        confirm: {
          title: "Request sent",
          subtitle: "Room 204 · Hôtel La Lagune",
          lines: [{ label: "1 × Breakfast in your room", amount: 7500 }, { label: "Served at 7:30 am" }],
          totalLabel: "Added to your bill",
          total: 7500,
          stages: ["Received", "Being prepared", "On its way"],
          live: "Live tracking",
        },
        ticket: {
          title: "Room 204",
          when: "Just now",
          badge: "New",
          lines: ["1 × Breakfast in your room", "Served at 7:30 am"],
          refuse: "Decline",
          accept: "Accept",
        },
      },
      benefitsTitle: "A calmer reception desk.",
      benefits: [
        {
          title: "No more folder in the room",
          text: "A rate changes, an hour moves: you edit it once and every room is up to date.",
        },
        {
          title: "Room service without the phone",
          text: "The guest orders in writing. Reception no longer takes notes, and the kitchen gets a clear order.",
        },
        {
          title: "In English for your foreign guests",
          text: "The same page reads in French or English: the guest switches in one tap.",
        },
      ],
    },

    residences: {
      name: "Serviced apartments",
      card: "The guide to the apartment and your services, one tap away.",
      cardAlt: "The bright living room of a furnished apartment",
      eyebrow: "For serviced apartments",
      title: "The apartment guide, plus your services.",
      intro: "The Wi-Fi code, the air conditioning, the house rules, cleaning on request: your tenant finds it all alone, and you get fewer calls.",
      heroAlt: "The bright living room of a furnished apartment",
      storyTitle: "From arrival to request in four steps.",
      storyIntro: "What a tenant experiences when settling in, and what you receive.",
      steps: [
        {
          title: "The tenant scans on arrival",
          text: "The QR code is by the door or on the living-room table. You can also send the link by WhatsApp before they arrive.",
        },
        {
          title: "The apartment guide opens",
          text: "Wi-Fi, air conditioning, water heater, house rules, your contacts. Everything people usually call you about.",
        },
        {
          title: "They ask for a service",
          text: "Cleaning, fresh linen, breakfast, the airport shuttle: they choose, and the price is shown.",
        },
        {
          title: "You get the request",
          text: "It arrives on your phone, with the apartment number. You confirm in one tap.",
        },
      ],
      screens: {
        scan: { hint: "Point at the apartment's QR code" },
        list: {
          title: "Les Cocotiers",
          subtitle: "Apartment B2 · Welcome",
          tabs: ["Guide", "Services", "Contacts"],
          items: [
            { name: "Wi-Fi", detail: "Network and access code", note: "Included" },
            { name: "Cleaning", detail: "During the day", price: 5000 },
            { name: "Breakfast", detail: "Delivered to the apartment", price: 4000 },
            { name: "Airport shuttle", detail: "Book the day before", price: 15000 },
          ],
          action: "Write to the manager",
        },
        detail: {
          title: "Apartment cleaning",
          text: "Floors, bathroom, kitchen and a change of sheets. Pick the time that suits you.",
          price: 5000,
          action: "Request",
        },
        confirm: {
          title: "Request sent",
          subtitle: "Apartment B2 · Les Cocotiers",
          lines: [{ label: "1 × Apartment cleaning", amount: 5000 }, { label: "Tomorrow morning" }],
          totalLabel: "To pay on site",
          total: 5000,
          stages: ["Received", "Confirmed", "Done"],
          live: "Live tracking",
        },
        ticket: {
          title: "Apartment B2",
          when: "Just now",
          badge: "New",
          lines: ["1 × Apartment cleaning", "Tomorrow morning"],
          refuse: "Decline",
          accept: "Confirm",
        },
      },
      benefitsTitle: "Fewer calls, more services.",
      benefits: [
        {
          title: "The Wi-Fi code without disturbing you",
          text: "Everyday questions are answered in the guide. Your phone rings less.",
        },
        {
          title: "Services mean revenue",
          text: "Cleaning, linen, breakfast, shuttle: what you offer is listed with its price, and requested in two taps.",
        },
        {
          title: "One link to send before arrival",
          text: "The address, directions, entry instructions: the tenant has everything before even getting there.",
        },
      ],
    },
  },
};
