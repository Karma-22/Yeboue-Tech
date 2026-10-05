import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import { site } from "@/config/site";
import "./globals.css";

// Les titres. Les axes « taille optique » et « largeur » servent aux grands titres resserrés.
const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

// Le texte courant et l'interface.
const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
};

export const viewport: Viewport = {
  themeColor: "#FAF6EF",
};

/*
 * Applique le mode sombre avant le premier affichage, si la personne l'a
 * choisi lors d'une visite précédente (bouton de l'en-tête). Sans ce script, la
 * page apparaîtrait d'abord claire, puis basculerait. La clé « theme » est celle
 * de src/components/marketing/theme-toggle.tsx.
 */
const THEME_SCRIPT = `try{if(localStorage.getItem("theme")==="dark")document.documentElement.dataset.theme="dark"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // Le script ci-dessous peut ajouter data-theme avant que React ne prenne la main.
    <html lang="fr" className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
