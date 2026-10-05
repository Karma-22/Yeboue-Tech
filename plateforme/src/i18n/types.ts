import type { SolutionId } from "./config";

/* La forme des textes du site vitrine. Chaque langue fournit exactement ces champs. */

export interface StepCopy {
  title: string;
  text: string;
}

/** Les textes des écrans du téléphone dessiné, pour un type d'établissement. */
export interface ScreensCopy {
  scan: { hint: string };
  list: {
    title: string;
    subtitle: string;
    tabs: string[];
    /** Les lignes suivent l'ordre des photos de src/components/marketing/solution-media.ts. */
    items: { name: string; detail: string; price?: number; note?: string }[];
    action: string;
    amount?: number;
  };
  detail: { title: string; text: string; price: number; action: string };
  confirm: {
    title: string;
    subtitle: string;
    lines: { label: string; amount?: number }[];
    totalLabel: string;
    total: number;
    stages: string[];
    live: string;
  };
  ticket: { title: string; when: string; badge: string; lines: string[]; refuse: string; accept: string };
}

export interface SolutionCopy {
  /** Le nom du type d'établissement : « Hôtels ». */
  name: string;
  /** La phrase de la carte « Pour qui ». */
  card: string;
  cardAlt: string;
  eyebrow: string;
  title: string;
  intro: string;
  heroAlt: string;
  storyTitle: string;
  storyIntro: string;
  steps: StepCopy[];
  screens: ScreensCopy;
  benefitsTitle: string;
  benefits: StepCopy[];
}

export interface Dictionary {
  meta: { title: string; description: string };
  nav: {
    audiences: string;
    how: string;
    pricing: string;
    faq: string;
    cta: string;
    openMenu: string;
    menuTitle: string;
    solutions: string;
    language: string;
    switchTo: string;
    toDark: string;
    toLight: string;
    theme: string;
  };
  hero: {
    rotating: { eyebrow: string; lead: string }[];
    titleRest: string;
    text: string;
    primary: string;
    secondary: string;
    assurances: string;
    photoAlt: string;
  };
  audiences: { eyebrow: string; title: string; intro: string; more: string };
  story: { eyebrow: string; title: string; intro: string; others: string };
  features: {
    eyebrow: string;
    title: string;
    items: { title: string; text: string; points: string[]; alt: string }[];
    crumbs: {
      dish: string;
      price: string;
      available: string;
      address: string;
      never: string;
      message: string;
      hello: string;
      messageLines: string[];
      total: string;
    };
  };
  video: { title: string; text: string };
  pricing: {
    eyebrow: string;
    title: string;
    intro: string;
    perMonth: string;
    stamp: string;
    /** `{days}` est remplacé par la durée de l'essai. */
    trial: string;
    includedLead: string;
    /** `{count}` est remplacé par le nombre d'accès de l'offre. */
    seats: string;
    cta: string;
    plans: { menu: { summary: string; points: string[] }; menu_orders: { summary: string; points: string[] } };
    servicesEyebrow: string;
    servicesTitle: string;
    services: { name: string; text: string; alt: string }[];
    once: string;
    onQuote: string;
  };
  faq: { eyebrow: string; title: string; items: { question: string; answer: string }[] };
  cta: { title: string; text: string; primary: string; call: string };
  footer: {
    about: string;
    product: string;
    contact: string;
    whatsapp: string;
    country: string;
    made: string;
    credits: string;
    whatsappMessage: string;
  };
  solutionPage: { benefitsEyebrow: string; storyEyebrow: string; othersTitle: string; pricingLink: string };
  signupMessage: string;
  solutions: Record<SolutionId, SolutionCopy>;
}
