import { describe, expect, it } from "vitest";
import { isDemoProject, resolveEmulatorUse } from "./emulators";

describe("isDemoProject", () => {
  it("reconnaît les projets de démonstration", () => {
    expect(isDemoProject("demo-yeboue-tech")).toBe(true);
  });

  it("refuse tout le reste", () => {
    expect(isDemoProject("yeboue-tech")).toBe(false);
    expect(isDemoProject("yeboue-tech-demo-1")).toBe(false);
    expect(isDemoProject("")).toBe(false);
    expect(isDemoProject(undefined)).toBe(false);
  });
});

describe("resolveEmulatorUse", () => {
  it("ne branche pas les émulateurs s'ils ne sont pas demandés", () => {
    expect(resolveEmulatorUse({ projectId: "yeboue-tech", requested: false })).toBe(false);
    expect(resolveEmulatorUse({ projectId: "demo-yeboue-tech", requested: false })).toBe(false);
  });

  it("les branche pour un projet de démonstration", () => {
    expect(resolveEmulatorUse({ projectId: "demo-yeboue-tech", requested: true })).toBe(true);
  });

  // Les émulateurs acceptent n'importe quel jeton : sur un vrai projet, ce serait une porte ouverte.
  it("refuse de démarrer si on les demande pour un vrai projet", () => {
    expect(() => resolveEmulatorUse({ projectId: "yeboue-tech", requested: true })).toThrow(
      /demo-/,
    );
    expect(() => resolveEmulatorUse({ projectId: undefined, requested: true })).toThrow(/demo-/);
  });
});
