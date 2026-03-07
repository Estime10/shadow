import { describe, it, expect } from "vitest";
import { normalizeTimeString } from "@/lib/functions/normalizeTimeString/normalizeTimeString";

describe("normalizeTimeString", () => {
  it("retourne null pour chaîne vide", () => {
    expect(normalizeTimeString("")).toBeNull();
    expect(normalizeTimeString("   ")).toBeNull();
  });

  it("accepte HH:mm", () => {
    expect(normalizeTimeString("14:30")).toBe("14:30");
    expect(normalizeTimeString("09:00")).toBe("09:00");
    expect(normalizeTimeString("00:00")).toBe("00:00");
    expect(normalizeTimeString("23:59")).toBe("23:59");
  });

  it("accepte 14h30", () => {
    expect(normalizeTimeString("14h30")).toBe("14:30");
    expect(normalizeTimeString("9H00")).toBe("09:00");
  });

  it("accepte format compact 1430", () => {
    expect(normalizeTimeString("1430")).toBe("14:30");
    expect(normalizeTimeString("0900")).toBe("09:00");
  });

  it("clamp les heures 0-23 et minutes 0-59", () => {
    expect(normalizeTimeString("25:00")).toBe("23:00");
    expect(normalizeTimeString("-1:00")).toBe("00:00");
    expect(normalizeTimeString("12:99")).toBe("12:59");
    expect(normalizeTimeString("12:-5")).toBe("12:00");
  });

  it("trim et enlève espaces", () => {
    expect(normalizeTimeString("  14:30  ")).toBe("14:30");
    expect(normalizeTimeString("14 : 30")).toBe("14:30");
  });

  it("retourne null si invalide (non numérique)", () => {
    expect(normalizeTimeString("ab:cd")).toBeNull();
  });

  it("retourne 00:00 pour chaîne sans chiffres (comportement clamp)", () => {
    expect(normalizeTimeString("xx")).toBe("00:00");
  });

  it("gère 3 chiffres (ex. 930 → 09:30)", () => {
    expect(normalizeTimeString("930")).toBe("09:30");
  });

  it("padStart 2 chiffres pour heures et minutes", () => {
    expect(normalizeTimeString("9:5")).toBe("09:05");
  });
});
