"use server";

import { z } from "zod";
import type { PlaceOrderResult } from "@/components/public/menu-shell";
import { getMenu } from "@/lib/db/menu";
import { createOrder, createReview, getOrder, getReviewOf } from "@/lib/db/orders";
import { buildOrderLines, MAX_LINES, MAX_QUANTITY, type CartError } from "@/lib/orders/rules";
import { loadPublicPage } from "@/lib/public/load";
import { publicView } from "@/lib/public/view";
import { allow, clientKey } from "@/lib/utils/rate-limit";

/* Ce que les clients d'un établissement peuvent faire sans compte : commander et laisser un avis. */

const cartSchema = z
  .array(z.object({ itemId: z.string().min(1).max(64), quantity: z.number().int().min(1).max(MAX_QUANTITY) }))
  .min(1)
  .max(MAX_LINES);

function cartMessage(error: CartError, name: string | undefined): string {
  const item = name ? `« ${name} »` : "Un article";
  switch (error) {
    case "empty":
      return "Votre panier est vide.";
    case "too-large":
      return "Ce panier est trop gros pour être envoyé d'un coup. Appelez un serveur.";
    case "unavailable":
      return `${item} vient de tomber en rupture. Retirez-le de votre panier.`;
    case "no-price":
      return `${item} ne se commande pas en ligne.`;
    case "unknown-item":
      return "La carte vient de changer. Rechargez la page, puis recommencez.";
  }
}

/**
 * Enregistre la commande d'une table. Le navigateur n'envoie que des
 * identifiants et des quantités : les prix sont relus ici (ARCHITECTURE.md §6.5).
 */
export async function placeOrder(
  slug: string,
  tableNumber: number,
  cart: unknown,
  note: unknown,
): Promise<PlaceOrderResult> {
  if (!allow(`order:${await clientKey()}`, 6, 60_000)) {
    return { ok: false, message: "Trop de commandes à la suite. Patientez une minute." };
  }
  const parsed = cartSchema.safeParse(cart);
  if (!parsed.success) return { ok: false, message: "Votre panier n'a pas pu être lu. Rechargez la page." };

  const page = await loadPublicPage(slug);
  if (!page) return { ok: false, message: "Cet établissement est introuvable." };
  const { establishment } = page;
  if (publicView(establishment, true).ordering !== "table") {
    return { ok: false, message: "La commande sur place n'est pas disponible pour le moment." };
  }
  const table = page.tables.find((entry) => entry.number === tableNumber);
  if (!table) return { ok: false, message: "Cette table n'existe plus. Scannez de nouveau le QR Code." };

  // La carte est relue dans la base, et non dans le cache : une rupture décidée à l'instant compte.
  const { items } = await getMenu(establishment.id);
  const built = buildOrderLines(parsed.data, items);
  if ("error" in built) {
    const name = items.find((item) => item.id === built.itemId)?.name;
    return { ok: false, message: cartMessage(built.error, name) };
  }

  const order = await createOrder({
    establishmentId: establishment.id,
    tableId: table.id,
    tableLabel: table.label,
    lines: built.lines,
    total: built.total,
    note: typeof note === "string" ? note.trim().slice(0, 200) : "",
  });
  return { ok: true, orderId: order.id };
}

const reviewSchema = z.object({ rating: z.number().int().min(1).max(5), comment: z.string().trim().max(500) });

/** L'avis d'un client sur sa commande, une fois servie. Un seul par commande. */
export async function sendReview(
  slug: string,
  orderId: string,
  rating: unknown,
  comment: unknown,
): Promise<{ ok: boolean; message: string }> {
  if (!allow(`review:${await clientKey()}`, 5, 60_000)) return { ok: false, message: "Patientez une minute." };
  const parsed = reviewSchema.safeParse({ rating, comment });
  if (!parsed.success) return { ok: false, message: "Choisissez une note de 1 à 5." };

  const page = await loadPublicPage(slug);
  if (!page || !publicView(page.establishment, false).reviews) {
    return { ok: false, message: "Les avis ne sont pas ouverts ici." };
  }
  const order = await getOrder(page.establishment.id, orderId);
  if (!order || order.status !== "served") return { ok: false, message: "Vous pourrez donner votre avis une fois servi." };
  if (await getReviewOf(page.establishment.id, orderId)) return { ok: false, message: "Votre avis est déjà enregistré. Merci !" };

  await createReview(page.establishment.id, { ...parsed.data, orderId });
  return { ok: true, message: "Merci pour votre avis." };
}
