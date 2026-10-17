import { Anton, Caveat, Cormorant_Garamond, Fraunces, JetBrains_Mono, Syne } from "next/font/google";

/*
 * Les polices propres à certains modèles. Elles ne sont pas préchargées : le
 * navigateur ne télécharge que celle du modèle réellement affiché. Les autres
 * modèles utilisent les polices de la plateforme (Bricolage Grotesque, Hanken Grotesk).
 */

/** Ardoise : une écriture à la craie. */
export const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap", preload: false });

/** Table d'hôte : des lettres élégantes, avec leur italique. */
export const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

/** Comptoir : des capitales larges, pour la nuit. */
export const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap", preload: false });

/** Palace : des lettres fines et hautes. */
export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

/** Marché : des capitales serrées, très présentes. */
export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
  display: "swap",
  preload: false,
});

/** Carnet : les chiffres alignés d'un ticket de caisse. */
export const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap", preload: false });
