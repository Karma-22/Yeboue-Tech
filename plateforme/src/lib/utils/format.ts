const NARROW_NO_BREAK_SPACE = " ";
const NO_BREAK_SPACE = " ";
const MINUS = "−";

/**
 * Écrit un montant en FCFA à la française : 3500 → « 3 500 F ».
 *
 * Le découpage est fait à la main plutôt qu'avec Intl : le résultat est ainsi
 * identique sur le serveur et dans tous les navigateurs.
 */
export function formatPrice(amount: number, unit: "F" | "FCFA" = "F"): string {
  const rounded = Math.round(amount);
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, NARROW_NO_BREAK_SPACE);
  const sign = rounded < 0 ? MINUS : "";
  return `${sign}${digits}${NO_BREAK_SPACE}${unit}`;
}

const DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const DATE_TIME = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

/** Écrit une date à la française : « 6 octobre 2026 ». Abidjan est à l'heure universelle toute l'année. */
export function formatDate(timestamp: number): string {
  return DATE.format(timestamp);
}

/** Une date avec son heure, en court : « 6 oct., 14:05 ». */
export function formatDateTime(timestamp: number): string {
  return DATE_TIME.format(timestamp);
}
