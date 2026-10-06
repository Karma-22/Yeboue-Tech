import "server-only";

import { FieldValue } from "firebase-admin/firestore";
import { canTransition } from "@/lib/orders/rules";
import { dayKey, db, many, one } from "./core";
import type { DayStats, Order, OrderLine, OrderStatus, Review } from "./types";

const establishment = (id: string) => db().collection("establishments").doc(id);
const orders = (establishmentId: string) => establishment(establishmentId).collection("orders");
const stats = (establishmentId: string) => establishment(establishmentId).collection("stats");
const reviews = (establishmentId: string) => establishment(establishmentId).collection("reviews");

type OrderData = Omit<Order, "id">;

/** La commande ne peut pas passer à cet état depuis le sien. */
export class TransitionError extends Error {
  constructor(from: OrderStatus, to: OrderStatus) {
    super(`Une commande « ${from} » ne peut pas devenir « ${to} ».`);
    this.name = "TransitionError";
  }
}

interface NewOrder {
  establishmentId: string;
  tableId: string | null;
  tableLabel: string;
  lines: OrderLine[];
  total: number;
  note: string;
}

/** Enregistre la commande et met à jour les compteurs du jour, d'un seul tenant. */
export async function createOrder(input: NewOrder): Promise<Order> {
  const now = Date.now();
  const ref = orders(input.establishmentId).doc();
  const data: OrderData = { ...input, status: "new", rejectReason: "", createdAt: now, updatedAt: now };
  const batch = db().batch();
  batch.set(ref, data);
  batch.set(
    stats(input.establishmentId).doc(dayKey(now)),
    { orders: FieldValue.increment(1), revenue: FieldValue.increment(input.total) },
    { merge: true },
  );
  await batch.commit();
  return { ...data, id: ref.id };
}

export async function getOrder(establishmentId: string, orderId: string): Promise<Order | null> {
  return one<OrderData>(await orders(establishmentId).doc(orderId).get());
}

/** Les commandes passées depuis un instant donné, les plus récentes d'abord. */
export async function listOrdersSince(establishmentId: string, since: number): Promise<Order[]> {
  return many<OrderData>(
    await orders(establishmentId).where("createdAt", ">=", since).orderBy("createdAt", "desc").limit(200).get(),
  );
}

/** Fait avancer une commande. Refuse tout changement hors du cycle prévu. */
export async function setOrderStatus(
  establishmentId: string,
  orderId: string,
  status: OrderStatus,
  rejectReason = "",
): Promise<void> {
  const ref = orders(establishmentId).doc(orderId);
  await db().runTransaction(async (transaction) => {
    const current = one<OrderData>(await transaction.get(ref));
    if (!current) throw new Error("Commande introuvable.");
    if (!canTransition(current.status, status)) throw new TransitionError(current.status, status);
    transaction.update(ref, { status, rejectReason, updatedAt: Date.now() });
    // Une commande refusée ou annulée ne compte plus dans le chiffre du jour.
    if (status === "rejected" || status === "cancelled") {
      transaction.set(
        stats(establishmentId).doc(dayKey(current.createdAt)),
        { orders: FieldValue.increment(-1), revenue: FieldValue.increment(-current.total) },
        { merge: true },
      );
    }
  });
}

/* ——— Compteurs du jour ——— */

export async function recordScan(establishmentId: string): Promise<void> {
  await stats(establishmentId)
    .doc(dayKey(Date.now()))
    .set({ scans: FieldValue.increment(1) }, { merge: true });
}

export async function recordWhatsappOrder(establishmentId: string): Promise<void> {
  await stats(establishmentId)
    .doc(dayKey(Date.now()))
    .set({ whatsappOrders: FieldValue.increment(1) }, { merge: true });
}

/** Les compteurs des derniers jours, du plus ancien au plus récent ; les jours sans activité sont à zéro. */
export async function getStats(establishmentId: string, days: number): Promise<DayStats[]> {
  const today = Date.now();
  const keys = Array.from({ length: days }, (_, index) => dayKey(today - (days - 1 - index) * 86_400_000));
  const snapshots = await db().getAll(...keys.map((key) => stats(establishmentId).doc(key)));
  return snapshots.map((snapshot, index) => {
    const data = (snapshot.data() ?? {}) as Partial<DayStats>;
    return {
      date: keys[index],
      scans: data.scans ?? 0,
      orders: data.orders ?? 0,
      revenue: data.revenue ?? 0,
      whatsappOrders: data.whatsappOrders ?? 0,
    };
  });
}

/* ——— Avis ——— */

export async function createReview(
  establishmentId: string,
  input: Pick<Review, "rating" | "comment" | "orderId">,
): Promise<void> {
  await reviews(establishmentId).add({ ...input, createdAt: Date.now() });
}

export async function listReviews(establishmentId: string, limit = 100): Promise<Review[]> {
  return many<Omit<Review, "id">>(await reviews(establishmentId).orderBy("createdAt", "desc").limit(limit).get());
}

/** L'avis déjà laissé pour une commande, s'il y en a un : une commande, un seul avis. */
export async function getReviewOf(establishmentId: string, orderId: string): Promise<Review | null> {
  const snapshot = await reviews(establishmentId).where("orderId", "==", orderId).limit(1).get();
  return many<Omit<Review, "id">>(snapshot)[0] ?? null;
}
