const COUNTRY_CODE = "225";

/**
 * Met un numéro ivoirien sous sa forme complète, sans espaces : `2250700000000`.
 * Accepte « 07 00 00 00 00 », « +225 07 00 00 00 00 » ou « 002250700000000 ».
 * Rend `null` si ce n'est pas un numéro à dix chiffres.
 */
export function normalizePhone(input: string): string | null {
  let digits = input.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith(COUNTRY_CODE) && digits.length === 13) digits = digits.slice(3);
  return /^\d{10}$/.test(digits) ? `${COUNTRY_CODE}${digits}` : null;
}

/** Écrit un numéro pour être lu : `+225 07 00 00 00 00`. */
export function formatPhone(normalized: string): string {
  const local = normalized.startsWith(COUNTRY_CODE) ? normalized.slice(3) : normalized;
  return `+${COUNTRY_CODE} ${local.replace(/(\d{2})(?=\d)/g, "$1 ")}`;
}

/** Lien qui ouvre WhatsApp sur ce numéro, avec un message déjà écrit. */
export function whatsappLink(normalized: string, message: string): string {
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
