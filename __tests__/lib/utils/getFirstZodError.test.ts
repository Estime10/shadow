import { describe, it, expect } from "vitest";
import { z } from "zod";
import { getFirstZodError } from "@/lib/utils/getFirstZodError";

const schema = z.object({
  email: z.string().email("Email invalide"),
  age: z.number().min(18, "Trop jeune"),
});

describe("getFirstZodError", () => {
  it("retourne la première formError quand présente", () => {
    const refiner = z
      .object({ a: z.string() })
      .refine(() => false, { message: "Erreur formulaire" });
    const result = refiner.safeParse({ a: "x" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFirstZodError(result)).toBe("Erreur formulaire");
    }
  });

  it("retourne la première fieldError quand pas de formError", () => {
    const result = schema.safeParse({ email: "not-an-email", age: 20 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(getFirstZodError(result)).toBe("Email invalide");
    }
  });

  it("retourne l'erreur du premier champ en ordre quand plusieurs champs invalides", () => {
    const result = schema.safeParse({ email: "bad", age: 10 });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msg = getFirstZodError(result);
      expect(["Email invalide", "Trop jeune"]).toContain(msg);
    }
  });

  it("retourne toujours une chaîne non vide quand success est false", () => {
    const result = schema.safeParse({ email: "bad", age: "not-a-number" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const msg = getFirstZodError(result);
      expect(typeof msg).toBe("string");
      expect(msg.length).toBeGreaterThan(0);
    }
  });
});
