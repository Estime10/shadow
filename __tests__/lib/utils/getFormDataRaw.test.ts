import { describe, it, expect } from "vitest";
import { getFormDataRaw } from "@/lib/utils/getFormDataRaw";

describe("getFormDataRaw", () => {
  it("extrait les champs demandés depuis le FormData", () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "secret123");
    formData.set("extra", "ignored");

    const raw = getFormDataRaw(formData, ["email", "password"]);
    expect(raw).toEqual({
      email: "user@example.com",
      password: "secret123",
    });
    expect(raw).not.toHaveProperty("extra");
  });

  it("met null pour les clés absentes", () => {
    const formData = new FormData();
    formData.set("a", "1");

    const raw = getFormDataRaw(formData, ["a", "b", "c"]);
    expect(raw).toEqual({ a: "1", b: null, c: null });
  });

  it("retourne un objet vide si keys est vide", () => {
    const formData = new FormData();
    formData.set("x", "y");
    const raw = getFormDataRaw(formData, []);
    expect(raw).toEqual({});
  });

  it("ne contient que les clés passées (pas d'injection de champs)", () => {
    const formData = new FormData();
    formData.set("messageId", "e6a6c3b2-1234-4abc-8def-000000000001");
    formData.set("conversationId", "e6a6c3b2-1234-4abc-8def-000000000002");

    const raw = getFormDataRaw(formData, ["messageId"]);
    expect(Object.keys(raw)).toEqual(["messageId"]);
    expect(raw.messageId).toBe("e6a6c3b2-1234-4abc-8def-000000000001");
  });

  it("utilise la première valeur en cas de clé dupliquée (FormData.get)", () => {
    const formData = new FormData();
    formData.append("a", "first");
    formData.append("a", "second");
    const raw = getFormDataRaw(formData, ["a"]);
    expect(raw.a).toBe("first");
  });
});
