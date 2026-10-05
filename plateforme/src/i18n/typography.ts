const NO_BREAK_SPACE = " ";

/**
 * Pose les espaces insécables de la typographie française : avant « ? ! : ; »
 * et à l'intérieur des guillemets. Sans elles, un point d'interrogation peut se
 * retrouver seul au début d'une ligne.
 */
export function frenchSpaces(text: string): string {
  return text
    .replace(/ ([?!:;»])/g, `${NO_BREAK_SPACE}$1`)
    .replace(/« /g, `«${NO_BREAK_SPACE}`);
}

/** Applique `frenchSpaces` à tous les textes d'un dictionnaire, sans en changer la forme. */
export function withFrenchSpaces<T>(value: T): T {
  if (typeof value === "string") return frenchSpaces(value) as T;
  if (Array.isArray(value)) return value.map((item) => withFrenchSpaces(item)) as T;
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, withFrenchSpaces(item)]),
    ) as T;
  }
  return value;
}
