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

/*
 * L'espace OKLCH décrit une couleur comme l'œil la voit : sa clarté, sa
 * vivacité, sa teinte (un angle sur le cercle des couleurs). C'est lui qui
 * permet de trouver, pour n'importe quelle couleur, celles qui vont avec elle.
 */

const toLinear = (channel: number) => (channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
const toGamma = (channel: number) => (channel <= 0.0031308 ? channel * 12.92 : 1.055 * channel ** (1 / 2.4) - 0.055);

/** La teinte d'une couleur, en degrés sur le cercle des couleurs. */
function hueOf(hex: string): number {
  const [r, g, b] = toRgb(hex).map((value) => toLinear(value / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
}

/** Une couleur à partir de sa clarté (0 à 1), de sa vivacité et de sa teinte. `null` si un écran ne peut pas l'afficher. */
function oklch(lightness: number, chroma: number, hue: number): Rgb | null {
  const angle = (hue * Math.PI) / 180;
  const a = chroma * Math.cos(angle);
  const b = chroma * Math.sin(angle);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  if (linear.some((channel) => channel < -0.0005 || channel > 1.0005)) return null;
  return linear.map((channel) => toGamma(Math.min(1, Math.max(0, channel))) * 255) as Rgb;
}

/** La couleur la plus vive qu'un écran sache afficher, à cette clarté et dans cette teinte. */
function vivid(lightness: number, chroma: number, hue: number): string {
  for (let current = chroma; current > 0; current -= 0.01) {
    const rgb = oklch(lightness, current, hue);
    if (rgb) return toHex(rgb);
  }
  return toHex(oklch(lightness, 0, hue) ?? [128, 128, 128]);
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
  /**
   * Le relief d'une lettre peinte sur la couleur : l'ombre qui lui donne son épaisseur.
   * Sous une lettre sombre, un rehaut clair ; sous une lettre claire, une ombre profonde.
   */
  relief: string;
  /**
   * La compagne : une couleur claire et vive, presque à l'opposé sur le cercle des couleurs.
   * Les modèles à deux encres (le wax, l'impression, le vitrail) s'en servent. L'encre se lit dessus.
   */
  companion: string;
  /** Une troisième couleur, de clarté moyenne, pour les modèles qui en veulent trois. */
  third: string;
}

/** Tout ce qu'un modèle tire de la couleur du gérant. */
export function accentTheme(accent: string): AccentTheme {
  const color = isHexColor(accent) ? accent.toUpperCase() : "#F2622E";
  const onAccent = contrast(INK, color) >= contrast(IVORY, color) ? INK : IVORY;
  const deep = mix(color, "#0A0F1C", 0.22);
  const hue = hueOf(color);
  return {
    companion: vivid(0.84, 0.15, hue + 150),
    third: vivid(0.64, 0.17, hue - 100),
    accent: color,
    onAccent,
    textOnLight: towards(color, INK, IVORY, 4.5),
    textOnDark: towards(color, IVORY, INK, 4.5),
    soft: mix(color, IVORY, 0.12),
    deep,
    relief: onAccent === INK ? IVORY : deep,
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
    "--brand-relief": theme.relief,
    "--brand-alt": theme.companion,
    "--brand-alt-2": theme.third,
  };
}
