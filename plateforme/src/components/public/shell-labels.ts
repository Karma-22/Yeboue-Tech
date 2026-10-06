/*
 * Les textes du panier et de la fiche d'un article, dans les deux langues.
 * Ils vivent hors du composant : une page du serveur doit pouvoir les lire.
 */

export interface ShellLabels {
  add: string;
  remove: string;
  soldOut: string;
  viewCart: string;
  cartTitle: string;
  cartHintTable: string;
  cartHintWhatsapp: string;
  note: string;
  notePlaceholder: string;
  total: string;
  send: string;
  sendWhatsapp: string;
  sending: string;
  previewNotice: string;
  whatsappHello: string;
  error: string;
}

export const SHELL_LABELS: Record<"fr" | "en", ShellLabels> = {
  fr: {
    add: "Ajouter",
    remove: "Retirer",
    soldOut: "En rupture pour le moment",
    viewCart: "Voir mon panier",
    cartTitle: "Votre commande",
    cartHintTable: "Vérifiez, puis envoyez : elle arrive directement au comptoir.",
    cartHintWhatsapp: "Vérifiez, puis envoyez : le message s'écrit tout seul dans WhatsApp.",
    note: "Une remarque ?",
    notePlaceholder: "Sans piment, bien cuit…",
    total: "Total",
    send: "Envoyer la commande",
    sendWhatsapp: "Envoyer sur WhatsApp",
    sending: "Envoi…",
    previewNotice: "Ceci est un aperçu : la commande n'est pas envoyée.",
    whatsappHello: "Bonjour, je souhaite commander :",
    error: "La commande n'a pas pu partir. Réessayez.",
  },
  en: {
    add: "Add",
    remove: "Remove",
    soldOut: "Sold out for now",
    viewCart: "View my basket",
    cartTitle: "Your order",
    cartHintTable: "Check it, then send: it goes straight to the counter.",
    cartHintWhatsapp: "Check it, then send: the message writes itself in WhatsApp.",
    note: "Any request?",
    notePlaceholder: "No chilli, well done…",
    total: "Total",
    send: "Send the order",
    sendWhatsapp: "Send on WhatsApp",
    sending: "Sending…",
    previewNotice: "This is a preview: the order is not sent.",
    whatsappHello: "Hello, I would like to order:",
    error: "The order could not be sent. Please try again.",
  },
};
