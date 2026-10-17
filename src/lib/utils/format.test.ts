import { describe, expect, it } from "vitest";
import { formatPrice } from "./format";

// Espace fine insécable entre les milliers, espace insécable avant l'unité.
const THIN = " ";
const NBSP = " ";

describe("formatPrice", () => {
  it("sépare les milliers à la française", () => {
    expect(formatPrice(3500)).toBe(`3${THIN}500${NBSP}F`);
    expect(formatPrice(15000)).toBe(`15${THIN}000${NBSP}F`);
    expect(formatPrice(1250000)).toBe(`1${THIN}250${THIN}000${NBSP}F`);
  });

  it("laisse les petits montants tels quels", () => {
    expect(formatPrice(0)).toBe(`0${NBSP}F`);
    expect(formatPrice(500)).toBe(`500${NBSP}F`);
  });

  it("arrondit au franc, le FCFA n'ayant pas de centimes", () => {
    expect(formatPrice(999.6)).toBe(`1${THIN}000${NBSP}F`);
  });

  it("écrit les montants négatifs avec un vrai signe moins", () => {
    expect(formatPrice(-5000)).toBe(`−5${THIN}000${NBSP}F`);
  });

  it("accepte l'unité longue", () => {
    expect(formatPrice(30000, "FCFA")).toBe(`30${THIN}000${NBSP}FCFA`);
  });
});
