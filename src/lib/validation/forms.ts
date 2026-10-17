import { z } from "zod";
import { ACCENT_PRESETS, TEMPLATE_IDS } from "@/config/templates";
import { PLAN_IDS } from "@/config/plans";
import { ESTABLISHMENT_TYPES, ROLES } from "@/lib/db/types";
import { isHexColor } from "@/lib/utils/color";
import { normalizePhone } from "@/lib/utils/phone";

/* Les règles de saisie de tous les formulaires. Les messages sont ceux que lit le gérant. */

/** Ce qu'une action de formulaire renvoie à la page. */
export interface FormState {
  /** Une erreur par champ, sous son nom. */
  errors?: Record<string, string>;
  /** Un message général, d'erreur ou de succès. */
  message?: string;
  ok?: boolean;
  /** Ce qui avait été saisi, pour ne pas le faire retaper. */
  values?: Record<string, string>;
}

/** Lit un formulaire avec un schéma : rend les données propres, ou les erreurs champ par champ. */
export function parseForm<T extends z.ZodType>(
  schema: T,
  formData: FormData,
): { data: z.infer<T> } | { state: FormState } {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }
  const result = schema.safeParse(values);
  if (result.success) return { data: result.data };

  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? "form");
    errors[field] ??= issue.message;
  }
  // On ne renvoie jamais un mot de passe vers la page.
  const { password: _password, ...safe } = values;
  void _password;
  return { state: { errors, values: safe } };
}

const text = (label: string, max = 80) =>
  z
    .string()
    .trim()
    .min(1, `${label} est nécessaire.`)
    .max(max, `${label} est trop long (${max} caractères au plus).`);

const optionalText = (max: number) => z.string().trim().max(max, `Trop long (${max} caractères au plus).`).default("");

const phone = z
  .string()
  .transform((value, context) => {
    const normalized = normalizePhone(value);
    if (!normalized) {
      context.addIssue({ code: "custom", message: "Ce numéro n'a pas dix chiffres. Exemple : 07 00 00 00 00." });
      return z.NEVER;
    }
    return normalized;
  });

const email = z.string().trim().toLowerCase().pipe(z.email("Cette adresse e-mail n'est pas valide."));

const password = z
  .string()
  .min(8, "Le mot de passe doit faire au moins 8 caractères.")
  .max(100, "Le mot de passe est trop long.");

export const signUpSchema = z.object({
  firstName: text("Votre prénom", 40),
  lastName: text("Votre nom", 40),
  phone,
  email,
  password,
});

export const signInSchema = z.object({
  email,
  password: z.string().min(1, "Votre mot de passe est nécessaire."),
});

export const codeSchema = z.object({
  code: z.string().regex(/^\d{6}$/, "Le code a six chiffres."),
});

export const resetRequestSchema = z.object({ email });

export const resetSchema = z.object({
  email,
  code: z.string().regex(/^\d{6}$/, "Le code a six chiffres."),
  password,
});

export const profileSchema = z.object({
  firstName: text("Votre prénom", 40),
  lastName: text("Votre nom", 40),
  phone,
});

export const newEstablishmentSchema = z.object({
  name: text("Le nom de l'établissement", 60),
  type: z.enum(ESTABLISHMENT_TYPES, "Choisissez un type d'établissement."),
  district: text("Le quartier", 40),
  whatsapp: phone,
});

export const appearanceSchema = z.object({
  template: z.enum(TEMPLATE_IDS, "Choisissez un modèle."),
  accentColor: z
    .string()
    .trim()
    .refine(isHexColor, "Cette couleur n'est pas valide. Exemple : #F2622E.")
    .default(ACCENT_PRESETS[0].value),
});

export const informationSchema = z.object({
  name: text("Le nom de l'établissement", 60),
  description: optionalText(300),
  address: optionalText(120),
  district: text("Le quartier", 40),
  city: text("La ville", 40),
  hours: optionalText(120),
  phone,
  whatsapp: phone,
  googleReviewUrl: z
    .string()
    .trim()
    .refine((value) => value === "" || /^https:\/\/\S+$/.test(value), "Collez un lien qui commence par https://")
    .default(""),
  english: z.string().optional().transform((value) => value === "on"),
});

export const categorySchema = z.object({
  name: text("Le nom de la catégorie", 40),
  nameEn: optionalText(40),
});

/** Un prix en FCFA : vide (pas de prix), ou un nombre entier positif. Les espaces sont tolérées. */
const price = z
  .string()
  .transform((value) => value.replace(/[\s  ]/g, ""))
  .refine((value) => value === "" || /^\d{1,8}$/.test(value), "Le prix est un nombre entier, en francs CFA.")
  .transform((value) => (value === "" ? null : Number(value)));

export const itemSchema = z.object({
  categoryId: z.string().min(1, "Choisissez une catégorie."),
  name: text("Le nom", 60),
  nameEn: optionalText(60),
  description: optionalText(240),
  descriptionEn: optionalText(240),
  price,
  note: optionalText(20),
});

export const zoneSchema = z.object({
  name: text("Le nom de la zone", 30),
  count: z.coerce
    .number("Indiquez un nombre.")
    .int("Indiquez un nombre entier.")
    .min(1, "Il faut au moins une table.")
    .max(200, "200 au plus par zone."),
});

export const planSchema = z.object({
  plan: z.enum(PLAN_IDS, "Choisissez une offre."),
  whatsapp: phone,
});

export const invitationSchema = z.object({
  email,
  role: z.enum(ROLES.filter((role) => role !== "owner") as ["manager", "waiter", "kitchen"], "Choisissez un rôle."),
});

export const paymentSchema = z.object({
  establishmentId: z.string().min(1),
  plan: z.enum(PLAN_IDS, "Choisissez une offre."),
  months: z.coerce.number().int().min(1, "Au moins un mois.").max(24, "24 mois au plus."),
  amount: z.coerce.number("Indiquez le montant reçu.").int().min(0),
  method: z.enum(["wave", "orange", "mtn", "moov", "cash"], "Choisissez le moyen de paiement."),
  reference: optionalText(60),
});

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: optionalText(500),
});
