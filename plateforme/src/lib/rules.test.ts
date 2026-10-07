import { createRequire } from "node:module";
import jsQR from "jsqr";
import { describe, expect, it } from "vitest";
import { EXPIRY, TRIAL } from "@/config/plans";
import { can } from "@/lib/auth/permissions";
import {
  canEdit,
  daysLeft,
  extendPeriod,
  hasFeature,
  isPageOnline,
  startTrial,
  subscriptionState,
} from "@/lib/billing/subscription";
import { buildOrderLines, canTransition, isOpen } from "@/lib/orders/rules";
import { qrSvg } from "@/lib/qr/svg";
import { accentTheme, contrast, isHexColor } from "@/lib/utils/color";
import { slugCandidates, slugify, slugProblem } from "@/lib/utils/slug";

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.UTC(2026, 9, 6, 12);

describe("état de l'abonnement", () => {
  const trial = startTrial("menu_orders", NOW);

  it("n'existe pas tant que la création guidée n'est pas finie", () => {
    expect(subscriptionState(null, NOW)).toBe("none");
    expect(hasFeature(null, "dineInOrders", NOW)).toBe(false);
  });

  it("suit l'essai, puis la grâce, le mode limité et la mise hors ligne", () => {
    expect(subscriptionState(trial, NOW)).toBe("trial");
    expect(subscriptionState(trial, NOW + (TRIAL.days - 1) * DAY)).toBe("trial");
    expect(subscriptionState(trial, NOW + TRIAL.days * DAY)).toBe("grace");
    expect(subscriptionState(trial, NOW + (TRIAL.days + EXPIRY.graceDays) * DAY)).toBe("limited");
    expect(
      subscriptionState(trial, NOW + (TRIAL.days + EXPIRY.graceDays + EXPIRY.limitedDays) * DAY),
    ).toBe("offline");
  });

  it("redevient actif dès qu'un paiement est enregistré", () => {
    const late = NOW + 60 * DAY;
    expect(subscriptionState(trial, late)).toBe("offline");
    const paid = extendPeriod(trial, "menu", 1, late);
    expect(subscriptionState(paid, late)).toBe("active");
    expect(paid.plan).toBe("menu");
  });

  it("ne fait pas perdre les jours d'essai restants à qui paie en avance", () => {
    const paid = extendPeriod(trial, "menu_orders", 1, NOW + DAY);
    // La période payée commence à la fin de l'essai, pas le jour du paiement.
    expect(paid.periodEndsAt).toBeGreaterThan(trial.trialEndsAt + 27 * DAY);
  });

  it("ajoute les mois au bout de la période en cours", () => {
    const first = extendPeriod(trial, "menu", 1, NOW + 20 * DAY);
    const second = extendPeriod(first, "menu", 3, NOW + 21 * DAY);
    expect(second.periodEndsAt! - first.periodEndsAt!).toBeGreaterThan(88 * DAY);
  });

  it("la suspension l'emporte sur tout", () => {
    expect(subscriptionState({ ...trial, suspended: true }, NOW)).toBe("suspended");
    expect(isPageOnline("suspended")).toBe(false);
  });

  it("garde le menu visible en mode limité, mais coupe la commande", () => {
    const limited = NOW + (TRIAL.days + EXPIRY.graceDays + 1) * DAY;
    expect(isPageOnline(subscriptionState(trial, limited))).toBe(true);
    expect(hasFeature(trial, "dineInOrders", limited)).toBe(false);
    expect(canEdit(subscriptionState(trial, limited))).toBe(false);
  });

  it("n'ouvre la commande qu'à l'offre qui la contient", () => {
    expect(hasFeature(trial, "dineInOrders", NOW)).toBe(true);
    expect(hasFeature(startTrial("menu", NOW), "dineInOrders", NOW)).toBe(false);
  });

  it("compte les jours restants", () => {
    expect(daysLeft(trial, NOW)).toBe(TRIAL.days);
    expect(daysLeft(trial, NOW + 100 * DAY)).toBe(0);
  });
});

describe("droits par rôle", () => {
  it("laisse tout le monde traiter les commandes et les ruptures", () => {
    for (const role of ["owner", "manager", "waiter", "kitchen"] as const) {
      expect(can(role, "orders.handle")).toBe(true);
      expect(can(role, "items.toggle")).toBe(true);
    }
  });

  it("réserve le menu au propriétaire et au gérant", () => {
    expect(can("manager", "menu.edit")).toBe(true);
    expect(can("waiter", "menu.edit")).toBe(false);
    expect(can("kitchen", "menu.edit")).toBe(false);
  });

  it("réserve l'abonnement et l'équipe au propriétaire", () => {
    expect(can("owner", "billing.manage")).toBe(true);
    expect(can("manager", "billing.manage")).toBe(false);
    expect(can("manager", "team.manage")).toBe(false);
  });
});

describe("cycle d'une commande", () => {
  it("n'avance que dans le sens prévu", () => {
    expect(canTransition("new", "accepted")).toBe(true);
    expect(canTransition("accepted", "ready")).toBe(true);
    expect(canTransition("ready", "served")).toBe(true);
    expect(canTransition("new", "served")).toBe(false);
    expect(canTransition("served", "new")).toBe(false);
    expect(canTransition("rejected", "accepted")).toBe(false);
  });

  it("sait quand il ne reste plus rien à faire", () => {
    expect(isOpen("new")).toBe(true);
    expect(isOpen("served")).toBe(false);
    expect(isOpen("rejected")).toBe(false);
  });
});

describe("panier → commande", () => {
  const items = [
    { id: "fish", name: "Poisson braisé", price: 4500, available: true },
    { id: "alloco", name: "Alloco", price: 1000, available: true },
    { id: "chicken", name: "Poulet", price: 3000, available: false },
    { id: "wifi", name: "Wi-Fi", price: null, available: true },
  ];

  it("relit les prix dans la carte et calcule le total", () => {
    const result = buildOrderLines(
      [
        { itemId: "fish", quantity: 1 },
        { itemId: "alloco", quantity: 2 },
      ],
      items,
    );
    expect(result).toEqual({
      lines: [
        { itemId: "fish", name: "Poisson braisé", price: 4500, quantity: 1 },
        { itemId: "alloco", name: "Alloco", price: 1000, quantity: 2 },
      ],
      total: 6500,
    });
  });

  it("regroupe deux fois le même article", () => {
    const result = buildOrderLines(
      [
        { itemId: "alloco", quantity: 1 },
        { itemId: "alloco", quantity: 2 },
      ],
      items,
    );
    expect(result).toMatchObject({ total: 3000 });
  });

  it("refuse un panier vide, un article inconnu, en rupture ou sans prix", () => {
    expect(buildOrderLines([], items)).toEqual({ error: "empty" });
    expect(buildOrderLines([{ itemId: "ghost", quantity: 1 }], items)).toMatchObject({ error: "unknown-item" });
    expect(buildOrderLines([{ itemId: "chicken", quantity: 1 }], items)).toMatchObject({ error: "unavailable" });
    expect(buildOrderLines([{ itemId: "wifi", quantity: 1 }], items)).toMatchObject({ error: "no-price" });
  });

  it("refuse les quantités absurdes", () => {
    expect(buildOrderLines([{ itemId: "fish", quantity: 0 }], items)).toMatchObject({ error: "too-large" });
    expect(buildOrderLines([{ itemId: "fish", quantity: 1.5 }], items)).toMatchObject({ error: "too-large" });
    expect(buildOrderLines([{ itemId: "fish", quantity: 500 }], items)).toMatchObject({ error: "too-large" });
  });
});

describe("identifiant d'adresse", () => {
  it("retire accents, espaces et apostrophes", () => {
    expect(slugify("Chez Tantie Affoué")).toBe("chez-tantie-affoue");
    expect(slugify("L'Étoile du Plateau !")).toBe("l-etoile-du-plateau");
    expect(slugify("  Maquis   2000 ")).toBe("maquis-2000");
  });

  it("refuse les adresses réservées, trop courtes ou mal formées", () => {
    expect(slugProblem("chez-ali")).toBeNull();
    expect(slugProblem("admin")).toBe("reserved");
    expect(slugProblem("en")).toBe("too-short");
    expect(slugProblem("Chez Ali")).toBe("invalid");
    expect(slugProblem("chez--ali")).toBe("invalid");
  });

  it("propose des variantes quand le nom est pris", () => {
    expect(slugCandidates("Chez Ali", "Cocody").slice(0, 3)).toEqual(["chez-ali", "chez-ali-cocody", "chez-ali-2"]);
    // Un nom réservé n'est jamais proposé tel quel.
    expect(slugCandidates("Menu", "Yopougon")[0]).toBe("menu-yopougon");
  });
});

describe("couleur du gérant", () => {
  const colors = ["#F2622E", "#14213D", "#FFFFFF", "#E8A317", "#000000", "#7A2E63", "#FFE600"];

  it.each(colors)("%s reste lisible partout", (color) => {
    const theme = accentTheme(color);
    expect(contrast(theme.onAccent, theme.accent)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.textOnLight, "#FAF6EF")).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.textOnDark, "#14213D")).toBeGreaterThanOrEqual(4.5);
  });

  it.each(colors)("%s trouve ses couleurs compagnes", (color) => {
    const theme = accentTheme(color);
    for (const value of [theme.companion, theme.third, theme.relief]) expect(isHexColor(value)).toBe(true);
    // L'encre se lit sur la compagne ; une lettre peinte se détache de son relief.
    expect(contrast("#14213D", theme.companion)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.onAccent, theme.relief)).toBeGreaterThanOrEqual(3);
  });

  it("se rabat sur la braise si la couleur est invalide", () => {
    expect(accentTheme("rouge").accent).toBe("#F2622E");
  });
});

describe("QR Code", () => {
  const sharp = createRequire(import.meta.url)("sharp");

  /** Transforme le SVG en image, comme le ferait une impression, puis le relit avec un décodeur. */
  async function decode(svg: string): Promise<string | undefined> {
    const { data, info } = await sharp(Buffer.from(svg), { density: 300 })
      .resize(600, 600)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    return jsQR(new Uint8ClampedArray(data), info.width, info.height)?.data;
  }

  it("se relit, avec les repères arrondis de la marque", async () => {
    const url = "https://exemple.ci/chez-tantie/t/12";
    expect(await decode(qrSvg(url))).toBe(url);
  });

  it("se relit aussi avec la couleur d'un établissement", async () => {
    const url = "https://exemple.ci/le-baobab-lounge";
    expect(await decode(qrSvg(url, { dark: "#7A2E63", accent: "#F2622E" }))).toBe(url);
  });
});
