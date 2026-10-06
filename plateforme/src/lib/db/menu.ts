import "server-only";

import type { CollectionReference } from "firebase-admin/firestore";
import { db, many, one } from "./core";
import type { Category, Item } from "./types";

const establishment = (id: string) => db().collection("establishments").doc(id);
const categories = (establishmentId: string) => establishment(establishmentId).collection("categories");
const items = (establishmentId: string) => establishment(establishmentId).collection("items");

type CategoryData = Omit<Category, "id">;
type ItemData = Omit<Item, "id">;

export interface Menu {
  categories: Category[];
  items: Item[];
}

/** Toute la carte d'un établissement, dans l'ordre d'affichage. */
export async function getMenu(establishmentId: string): Promise<Menu> {
  const [categorySnapshot, itemSnapshot] = await Promise.all([
    categories(establishmentId).orderBy("position", "asc").get(),
    items(establishmentId).orderBy("position", "asc").get(),
  ]);
  return { categories: many<CategoryData>(categorySnapshot), items: many<ItemData>(itemSnapshot) };
}

/* ——— Catégories ——— */

export async function createCategory(establishmentId: string, name: string, nameEn = ""): Promise<Category> {
  // La date sert de position : une nouvelle catégorie arrive en dernier.
  const data: CategoryData = { name, nameEn, position: Date.now(), visible: true };
  const ref = await categories(establishmentId).add(data);
  return { ...data, id: ref.id };
}

export async function updateCategory(
  establishmentId: string,
  categoryId: string,
  patch: Partial<CategoryData>,
): Promise<void> {
  await categories(establishmentId).doc(categoryId).update(patch);
}

/** Supprime une catégorie et tous ses articles. */
export async function deleteCategory(establishmentId: string, categoryId: string): Promise<void> {
  const inside = await items(establishmentId).where("categoryId", "==", categoryId).get();
  const batch = db().batch();
  inside.docs.forEach((doc) => batch.delete(doc.ref));
  batch.delete(categories(establishmentId).doc(categoryId));
  await batch.commit();
}

/* ——— Articles ——— */

export async function getItem(establishmentId: string, itemId: string): Promise<Item | null> {
  return one<ItemData>(await items(establishmentId).doc(itemId).get());
}

export async function createItem(
  establishmentId: string,
  input: Omit<ItemData, "position" | "available">,
): Promise<Item> {
  const data: ItemData = { ...input, available: true, position: Date.now() };
  const ref = await items(establishmentId).add(data);
  return { ...data, id: ref.id };
}

export async function updateItem(
  establishmentId: string,
  itemId: string,
  patch: Partial<ItemData>,
): Promise<void> {
  await items(establishmentId).doc(itemId).update(patch);
}

export async function deleteItem(establishmentId: string, itemId: string): Promise<void> {
  await items(establishmentId).doc(itemId).delete();
}

/**
 * Échange la place d'un élément avec son voisin, dans une liste déjà triée.
 * `direction` vaut -1 pour monter, 1 pour descendre.
 */
async function swap(
  collection: CollectionReference,
  ordered: { id: string; position: number }[],
  id: string,
  direction: -1 | 1,
): Promise<void> {
  const index = ordered.findIndex((entry) => entry.id === id);
  const neighbour = ordered[index + direction];
  if (index === -1 || !neighbour) return;
  const batch = db().batch();
  batch.update(collection.doc(id), { position: neighbour.position });
  batch.update(collection.doc(neighbour.id), { position: ordered[index].position });
  await batch.commit();
}

export async function moveCategory(establishmentId: string, categoryId: string, direction: -1 | 1) {
  const { categories: ordered } = await getMenu(establishmentId);
  await swap(categories(establishmentId), ordered, categoryId, direction);
}

export async function moveItem(establishmentId: string, itemId: string, direction: -1 | 1) {
  const { items: all } = await getMenu(establishmentId);
  const item = all.find((entry) => entry.id === itemId);
  if (!item) return;
  const siblings = all.filter((entry) => entry.categoryId === item.categoryId);
  await swap(items(establishmentId), siblings, itemId, direction);
}

/** Remplit une carte vide avec des catégories et des articles d'exemple, à modifier ensuite. */
export async function seedMenu(
  establishmentId: string,
  sample: { category: string; items: { name: string; description: string; price: number | null; note?: string }[] }[],
): Promise<void> {
  const batch = db().batch();
  let position = Date.now();
  for (const group of sample) {
    const categoryRef = categories(establishmentId).doc();
    batch.set(categoryRef, { name: group.category, nameEn: "", position: (position += 1), visible: true });
    for (const entry of group.items) {
      const data: ItemData = {
        categoryId: categoryRef.id,
        name: entry.name,
        nameEn: "",
        description: entry.description,
        descriptionEn: "",
        price: entry.price,
        note: entry.note ?? "",
        photo: null,
        available: true,
        position: (position += 1),
      };
      batch.set(items(establishmentId).doc(), data);
    }
  }
  await batch.commit();
}
