import "server-only";

import { db, one } from "./core";
import type { UserProfile } from "./types";

const users = () => db().collection("users");

export async function getUser(id: string): Promise<UserProfile | null> {
  return one<Omit<UserProfile, "id">>(await users().doc(id).get());
}

export async function createUser(profile: UserProfile): Promise<void> {
  const { id, ...data } = profile;
  await users().doc(id).set(data);
}

export async function updateUser(
  id: string,
  patch: Partial<Pick<UserProfile, "firstName" | "lastName" | "phone">>,
): Promise<void> {
  await users().doc(id).update(patch);
}

export async function listUsers(limit = 200): Promise<UserProfile[]> {
  const snapshot = await users().orderBy("createdAt", "desc").limit(limit).get();
  return snapshot.docs.map((doc) => ({ ...(doc.data() as Omit<UserProfile, "id">), id: doc.id }));
}
