/*
 * Les styles et les polices propres à un modèle.
 *
 * Avec quatre-vingts modèles, tout ranger dans la feuille de style du site la
 * ferait peser sur chaque page. Ici, les styles d'un modèle voyagent avec lui :
 * ils ne sont envoyés au téléphone que lorsque ce modèle s'affiche, et sa
 * police n'est téléchargée que par ceux qui la voient.
 *
 * Convention : chaque règle commence par la classe racine du modèle (`.gbk …`),
 * pour ne jamais déborder sur le reste de la page.
 */

/** Les caractères du français et de l'anglais : c'est la tranche que couvrent les fichiers de public/fonts. */
const LATIN =
  "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD";

export interface FontFile {
  /** Le nom à écrire dans `font-family`. */
  family: string;
  /** Le fichier, dans public/fonts. */
  file: string;
  /** « 400 », ou une plage pour une police variable : « 100 900 ». */
  weight?: string;
  style?: "normal" | "italic";
}

function fontFace(font: FontFile): string {
  return `@font-face{font-family:"${font.family}";src:url("/fonts/${font.file}") format("woff2");font-weight:${font.weight ?? "400"};font-style:${font.style ?? "normal"};font-display:swap;unicode-range:${LATIN}}`;
}

/** Retire les retours à la ligne et les espaces d'écriture : la page voyage plus léger. */
function compact(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/\s*([{};,>])\s*/g, "$1")
    .trim();
}

interface TemplateStyleProps {
  css: string;
  fonts?: FontFile[];
  /** La police du grand titre : son fichier est demandé tout de suite, pour qu'il ne « saute » pas à l'arrivée. */
  preload?: string;
}

/** À poser une fois, en tête du modèle. */
export function TemplateStyle({ css, fonts = [], preload }: TemplateStyleProps) {
  return (
    <>
      {preload && <link rel="preload" as="font" type="font/woff2" href={`/fonts/${preload}`} crossOrigin="anonymous" />}
      <style dangerouslySetInnerHTML={{ __html: fonts.map(fontFace).join("") + compact(css) }} />
    </>
  );
}

/** Pour écrire du CSS dans un fichier TypeScript, avec la coloration de l'éditeur. */
export const css = String.raw;
