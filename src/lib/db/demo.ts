import "server-only";

import { dayKey, db } from "./core";

/*
 * Des chiffres inventés pour l'établissement de démonstration, en développement
 * seulement : sans eux, la page Statistiques serait vide. Ce fichier n'est
 * appelé que par /api/dev/seed, qui refuse de tourner hors des émulateurs.
 */

/** Remplit les compteurs des derniers jours. `pattern` donne les scans de chaque jour, du plus ancien au plus récent. */
export async function writeDemoStats(establishmentId: string, pattern: number[]): Promise<void> {
  const today = Date.now();
  const batch = db().batch();
  pattern.forEach((scans, index) => {
    const date = dayKey(today - (pattern.length - 1 - index) * 86_400_000);
    const orders = Math.round(scans * 0.3);
    batch.set(
      db().collection("establishments").doc(establishmentId).collection("stats").doc(date),
      { scans, orders, revenue: orders * 6500, whatsappOrders: Math.round(scans * 0.08) },
      { merge: true },
    );
  });
  await batch.commit();
}
