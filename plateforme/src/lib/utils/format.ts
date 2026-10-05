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
