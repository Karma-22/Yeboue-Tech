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

/** Là où mènent tous les boutons « Créer mon menu » du site vitrine (ARCHITECTURE.md §17). */
export const SIGNUP_PATH = "/inscription";

/** Lien qui ouvre WhatsApp sur le numéro de Yéboué Tech, avec un message déjà écrit : pour nous contacter. */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;
}


/** L'adresse publique d'un établissement, ou d'une de ses tables : c'est elle qui est dessinée dans le QR Code. */
export function publicUrl(slug: string, tableNumber?: number): string {
  return tableNumber === undefined ? `${site.url}/${slug}` : `${site.url}/${slug}/t/${tableNumber}`;
}

/** Le site tourne encore sur un ordinateur : un QR Code imprimé maintenant ne mènerait nulle part. */
export const isLocalSite = ["localhost", "127.0.0.1"].some((host) => site.url.includes(host));

/** « yeboue.tech », sans le protocole : pour afficher une adresse. */
export const siteHost = new URL(site.url).host;
