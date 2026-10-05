/** Identité et coordonnées de la plateforme. */
export const site = {
  name: "Yéboué Tech",
  tagline: "Le menu de votre restaurant par QR Code",
  description:
    "Créez le menu en ligne de votre restaurant, maquis ou hôtel, imprimez votre QR Code et modifiez vos plats et vos prix vous-même, depuis votre téléphone.",
  // À remplacer par le vrai nom de domaine dès qu'il est acheté : il est imprimé dans chaque QR Code.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr",
  country: "CI",
  currency: "XOF",
  contact: {
    city: "Abidjan",
    phone: "+2250594899372",
    phoneDisplay: "+225 05 94 89 93 72",
    whatsapp: "2250594899372",
    // Pas d'adresse e-mail tant que le nom de domaine n'existe pas.
    email: null as string | null,
  },
} as const;

/**
 * Lien qui ouvre WhatsApp sur le numéro de Yéboué Tech, avec un message déjà écrit.
 * Tant que l'inscription n'existe pas (étape 1a), c'est là que mènent les boutons
 * « Créer mon menu » ; ensuite, ce sera /inscription.
 */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}

