import type { PlanId } from "@/config/plans";
import type { TemplateId } from "@/config/templates";

/*
 * La forme des données enregistrées dans Firestore (ARCHITECTURE.md §5).
 * Les dates sont des nombres de millisecondes : elles voyagent sans conversion
 * entre le serveur, le cache et le navigateur.
 */

export const ESTABLISHMENT_TYPES = ["restaurant", "maquis", "bar", "hotel", "residence"] as const;
export type EstablishmentType = (typeof ESTABLISHMENT_TYPES)[number];

export const ROLES = ["owner", "manager", "waiter", "kitchen"] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = ["new", "accepted", "ready", "served", "rejected", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  establishmentIds: string[];
  createdAt: number;
}

export interface Subscription {
  plan: PlanId;
  /** Fin de l'essai gratuit. */
  trialEndsAt: number;
  /** Fin de la dernière période payée ; `null` tant que rien n'a été payé. */
  periodEndsAt: number | null;
  /** Coupure décidée à la main par l'administration. */
  suspended: boolean;
}

export interface Establishment {
  id: string;
  name: string;
  slug: string;
  type: EstablishmentType;
  ownerId: string;
  description: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  whatsapp: string;
  /** Horaires, en texte libre : « Tous les jours, 11 h – 23 h ». */
  hours: string;
  logoUrl: string | null;
  coverUrl: string | null;
  template: TemplateId;
  accentColor: string;
  /** Le menu est aussi proposé en anglais. */
  english: boolean;
  googleReviewUrl: string;
  /** La page est en ligne. */
  published: boolean;
  /** `null` tant que la création guidée n'est pas terminée. */
  subscription: Subscription | null;
  /** L'écran de la création guidée où le gérant s'est arrêté (2 à 4) ; `null` une fois terminée. */
  setupStep: number | null;
  createdAt: number;
  updatedAt: number;
}

export interface Member {
  userId: string;
  role: Role;
  name: string;
  email: string;
  addedAt: number;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  position: number;
  visible: boolean;
}

export interface ItemPhoto {
  /** Vignette, 400 px de large. */
  thumb: string;
  /** Grande image, 1 200 px de large. */
  large: string;
}

export interface Item {
  id: string;
  categoryId: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  /** En FCFA. `null` pour une ligne d'information sans prix (Wi-Fi, horaires…). */
  price: number | null;
  /** Mention affichée à la place du prix : « Gratuit », « Inclus ». */
  note: string;
  photo: ItemPhoto | null;
  /** Faux = en rupture. */
  available: boolean;
  position: number;
}

export interface Zone {
  id: string;
  name: string;
  position: number;
}

export interface Table {
  id: string;
  zoneId: string;
  number: number;
  /** « Étage — Table 12 ». */
  label: string;
}

export interface OrderLine {
  itemId: string;
  /** Nom et prix copiés au moment de la commande : ils ne bougent plus ensuite. */
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  establishmentId: string;
  tableId: string | null;
  tableLabel: string;
  lines: OrderLine[];
  total: number;
  status: OrderStatus;
  note: string;
  rejectReason: string;
  createdAt: number;
  updatedAt: number;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  orderId: string | null;
  createdAt: number;
}

export interface DayStats {
  /** `aaaa-mm-jj`. */
  date: string;
  scans: number;
  orders: number;
  revenue: number;
  whatsappOrders: number;
}

export interface Invitation {
  code: string;
  establishmentId: string;
  establishmentName: string;
  role: Role;
  email: string;
  expiresAt: number;
  usedAt: number | null;
}

export interface Payment {
  id: string;
  establishmentId: string;
  establishmentName: string;
  amount: number;
  plan: PlanId;
  months: number;
  method: "wave" | "orange" | "mtn" | "moov" | "cash";
  reference: string;
  recordedBy: string;
  createdAt: number;
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  targetId: string;
  details: string;
  createdAt: number;
}
