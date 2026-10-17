import "server-only";

import { db, many } from "./core";
import type { Table, Zone } from "./types";

const establishment = (id: string) => db().collection("establishments").doc(id);
const zones = (establishmentId: string) => establishment(establishmentId).collection("zones");
const tables = (establishmentId: string) => establishment(establishmentId).collection("tables");

export interface Floor {
  zones: Zone[];
  tables: Table[];
}

export async function getFloor(establishmentId: string): Promise<Floor> {
  const [zoneSnapshot, tableSnapshot] = await Promise.all([
    zones(establishmentId).orderBy("position", "asc").get(),
    tables(establishmentId).orderBy("number", "asc").get(),
  ]);
  return {
    zones: many<Omit<Zone, "id">>(zoneSnapshot),
    tables: many<Omit<Table, "id">>(tableSnapshot),
  };
}

/** La table qui porte ce numéro, ou `null`. */
export async function getTableByNumber(establishmentId: string, number: number): Promise<Table | null> {
  const snapshot = await tables(establishmentId).where("number", "==", number).limit(1).get();
  return many<Omit<Table, "id">>(snapshot)[0] ?? null;
}

/**
 * Crée une zone et ses tables d'un coup. Les numéros continuent après le plus
 * grand déjà attribué : chaque table de l'établissement a un numéro unique,
 * donc une adresse unique.
 */
export async function createZone(
  establishmentId: string,
  name: string,
  count: number,
  unit: string,
): Promise<void> {
  const existing = await tables(establishmentId).orderBy("number", "desc").limit(1).get();
  const start = existing.empty ? 0 : (existing.docs[0].data() as Table).number;
  const zoneRef = zones(establishmentId).doc();
  const batch = db().batch();
  batch.set(zoneRef, { name, position: Date.now() });
  for (let index = 1; index <= count; index += 1) {
    const number = start + index;
    batch.set(tables(establishmentId).doc(), { zoneId: zoneRef.id, number, label: `${name} — ${unit} ${number}` });
  }
  await batch.commit();
}

/** Supprime une zone et ses tables. Leurs QR Codes cessent alors de fonctionner. */
export async function deleteZone(establishmentId: string, zoneId: string): Promise<void> {
  const inside = await tables(establishmentId).where("zoneId", "==", zoneId).get();
  const batch = db().batch();
  inside.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(zones(establishmentId).doc(zoneId));
  await batch.commit();
}
