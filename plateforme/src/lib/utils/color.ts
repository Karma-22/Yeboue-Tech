/*
 * La couleur choisie par le gérant, et tout ce qu'un modèle de page en tire :
 * de quoi écrire dessus, une version lisible en texte, une teinte douce.
 * Les contrastes sont calculés, pas supposés : n'importe quelle couleur reste lisible.
 */

const INK = "#14213D";
const IVORY = "#FAF6EF";

type Rgb = [number, number, number];

export function isHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function toRgb(hex: string): Rgb {
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16)) as Rgb;
}

function toHex(rgb: Rgb): string {
  return `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Rapport de contraste WCAG entre deux couleurs, de 1 à 21. */
export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Mélange deux couleurs ; `share` est la part de la première. */
export function mix(a: string, b: string, share: number): string {
  const [first, second] = [toRgb(a), toRgb(b)];
  return toHex(first.map((value, index) => value * share + second[index] * (1 - share)) as Rgb);
}

/** Rapproche une couleur d'une autre par petits pas, jusqu'à atteindre le contraste voulu sur un fond. */
function towards(color: string, target: string, background: string, ratio: number): string {
  for (let share = 1; share >= 0; share -= 0.05) {
    const candidate = mix(color, target, share);
    if (contrast(candidate, background) >= ratio) return candidate;
  }
  return target;
}

export interface AccentTheme {
  /** La couleur choisie, pour les aplats et les boutons. */
  accent: string;
  /** Le texte posé sur cette couleur : encre ou ivoire, selon ce qui se lit le mieux. */
  onAccent: string;
  /** La couleur assombrie jusqu'à pouvoir servir de texte sur fond clair. */
  textOnLight: string;
  /** La couleur éclaircie jusqu'à pouvoir servir de texte sur fond sombre. */
  textOnDark: string;
  /** Une teinte très claire, pour un fond discret. */
  soft: string;
  /** Une teinte très sombre, pour un fond de nuit. */
  deep: string;
}

/** Tout ce qu'un modèle tire de la couleur du gérant. */
export function accentTheme(accent: string): AccentTheme {
  const color = isHexColor(accent) ? accent.toUpperCase() : "#F2622E";
  return {
    accent: color,
    onAccent: contrast(INK, color) >= contrast(IVORY, color) ? INK : IVORY,
    textOnLight: towards(color, INK, IVORY, 4.5),
    textOnDark: towards(color, IVORY, INK, 4.5),
    soft: mix(color, IVORY, 0.12),
    deep: mix(color, "#0A0F1C", 0.22),
  };
}

/** Les variables CSS que lisent les modèles de page. */
export function accentStyle(accent: string): Record<string, string> {
  const theme = accentTheme(accent);
  return {
    "--brand": theme.accent,
    "--on-brand": theme.onAccent,
    "--brand-text": theme.textOnLight,
    "--brand-text-dark": theme.textOnDark,
    "--brand-soft": theme.soft,
    "--brand-deep": theme.deep,
  };
}
