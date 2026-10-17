import { revalidateTag } from "next/cache";
import { startTrial } from "@/lib/billing/subscription";
import { pageTag } from "@/lib/db/core";
import { writeDemoStats } from "@/lib/db/demo";
import { createEstablishment, getEstablishmentBySlug, updateEstablishment } from "@/lib/db/establishments";
import { seedMenu } from "@/lib/db/menu";
import { createOrder, setOrderStatus } from "@/lib/db/orders";
import { createZone, getFloor } from "@/lib/db/tables";
import type { UserProfile } from "@/lib/db/types";
import { createUser, getUser } from "@/lib/db/users";
import { adminAuth } from "@/lib/firebase/admin";
import { isDemoProject } from "@/lib/firebase/emulators";
import { sampleData, SAMPLES } from "@/templates/sample";

/*
 * Crée de quoi essayer toute la plateforme en local : un compte gérant, un
 * compte administrateur et un établissement de démonstration complet.
 *
 * Ne fonctionne qu'avec le projet factice des émulateurs : avec un vrai projet
 * Firebase, cette adresse répond « introuvable ». Lancée par « npm run demo ».
 */

const PASSWORD = "demo-1234";
const OWNER = { email: "gerant@demo.test", firstName: "Awa", lastName: "Démo", phone: "2250700000000" };
const ADMIN = { email: "admin@demo.test", firstName: "Admin", lastName: "Démo", phone: "2250700000001" };
const SLUG = "le-palmier";

/** Trouve le compte, ou le crée : la commande peut être relancée sans rien casser. */
async function account(person: typeof OWNER, superAdmin: boolean): Promise<UserProfile> {
  const auth = adminAuth();
  const record = await auth.getUserByEmail(person.email).catch(() =>
    auth.createUser({ email: person.email, password: PASSWORD, emailVerified: true, displayName: `${person.firstName} ${person.lastName}` }),
  );
  if (superAdmin) await auth.setCustomUserClaims(record.uid, { superAdmin: true });
  const existing = await getUser(record.uid);
  if (existing) return existing;
  const profile: UserProfile = { id: record.uid, ...person, establishmentIds: [], createdAt: Date.now() };
  await createUser(profile);
  return profile;
}

export async function POST() {
  if (!isDemoProject(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)) return new Response(null, { status: 404 });

  const [owner] = await Promise.all([account(OWNER, false), account(ADMIN, true)]);
  const accounts = { gerant: OWNER.email, administrateur: ADMIN.email, motDePasse: PASSWORD };
  if (await getEstablishmentBySlug(SLUG)) {
    return Response.json({ message: "L'établissement de démonstration existe déjà.", page: `/${SLUG}`, ...accounts });
  }

  const sample = SAMPLES.restaurant;
  const data = sampleData("restaurant");
  const establishment = await createEstablishment({
    name: sample.name,
    slug: SLUG,
    type: "restaurant",
    district: sample.district,
    whatsapp: OWNER.phone,
    owner,
  });
  await updateEstablishment(establishment.id, {
    description: sample.description,
    address: sample.address,
    hours: sample.hours,
    coverUrl: data.coverUrl,
    published: true,
    setupStep: null,
    subscription: startTrial("menu_orders", Date.now()),
  });
  await seedMenu(
    establishment.id,
    data.categories.map((category) => ({
      category: category.name,
      items: category.items.map(({ name, description, price, note, photo, available }) => ({ name, description, price, note, photo, available })),
    })),
  );
  await createZone(establishment.id, "Salle", 8, "Table");
  await createZone(establishment.id, "Terrasse", 4, "Table");
  // Des chiffres inventés, pour que les graphiques aient quelque chose à montrer.
  await writeDemoStats(establishment.id, [12, 18, 9, 22, 31, 40, 28, 15, 19, 24, 35, 47, 52, 30]);

  // Deux commandes en cours, pour voir l'écran de commandes vivre.
  const { tables } = await getFloor(establishment.id);
  const [first, second] = data.categories[1].items;
  const line = (item: typeof first, quantity: number) => ({ itemId: item.id, name: item.name, price: item.price ?? 0, quantity });
  const accepted = await createOrder({
    establishmentId: establishment.id,
    tableId: tables[4].id,
    tableLabel: tables[4].label,
    lines: [line(second, 2)],
    total: (second.price ?? 0) * 2,
    note: "",
  });
  await setOrderStatus(establishment.id, accepted.id, "accepted");
  await createOrder({
    establishmentId: establishment.id,
    tableId: tables[2].id,
    tableLabel: tables[2].label,
    lines: [line(first, 1), line(second, 1)],
    total: (first.price ?? 0) + (second.price ?? 0),
    note: "Sans piment, s'il vous plaît.",
  });

  revalidateTag(pageTag(SLUG), { expire: 0 });
  return Response.json({ message: "Établissement de démonstration créé.", page: `/${SLUG}`, table: `/${SLUG}/t/3`, ...accounts });
}
