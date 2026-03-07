import { describe, it, expect, beforeEach } from "vitest";
import { isRateLimited, RATE_LIMIT_MESSAGE } from "@/lib/rateLimit/rateLimit";

describe("isRateLimited", () => {
  const key = "test-key-unique-" + Math.random();

  beforeEach(() => {
    // Utiliser une clé unique par test pour éviter interférence (store global)
    // On ne peut pas vider le store sans exporter une fonction de reset,
    // donc on utilise une clé unique.
  });

  it("retourne false pour les N premières requêtes, true à la N+1", () => {
    const limit = 3;
    const k = key + "-1";
    expect(isRateLimited(k, limit)).toBe(false);
    expect(isRateLimited(k, limit)).toBe(false);
    expect(isRateLimited(k, limit)).toBe(false);
    expect(isRateLimited(k, limit)).toBe(true);
    expect(isRateLimited(k, limit)).toBe(true);
  });

  it("chaque clé a son propre compteur", () => {
    const k1 = key + "-2a";
    const k2 = key + "-2b";
    expect(isRateLimited(k1, 1)).toBe(false);
    expect(isRateLimited(k1, 1)).toBe(true);
    expect(isRateLimited(k2, 1)).toBe(false);
  });
});

describe("RATE_LIMIT_MESSAGE", () => {
  it("est une chaîne non vide", () => {
    expect(typeof RATE_LIMIT_MESSAGE).toBe("string");
    expect(RATE_LIMIT_MESSAGE.length).toBeGreaterThan(0);
    expect(RATE_LIMIT_MESSAGE).toContain("15");
  });
});
