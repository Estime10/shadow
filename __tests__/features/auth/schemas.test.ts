import { describe, it, expect } from "vitest";
import { loginSchema } from "@/features/auth/login/schema/loginSchema";
import { registerSchema } from "@/features/auth/register/schema/registerSchema";

const validEmail = "user@example.com";
const validPassword = "password123";

describe("loginSchema", () => {
  it("accepte email et mot de passe valides", () => {
    const result = loginSchema.safeParse({ email: validEmail, password: validPassword });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe(validEmail);
      expect(result.data.password).toBe(validPassword);
    }
  });

  it("rejette email vide", () => {
    const result = loginSchema.safeParse({ email: "", password: validPassword });
    expect(result.success).toBe(false);
  });

  it("rejette email invalide", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: validPassword });
    expect(result.success).toBe(false);
  });

  it("rejette mot de passe vide", () => {
    const result = loginSchema.safeParse({ email: validEmail, password: "" });
    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepte email, password (>= 8 car) et username (1–50 car)", () => {
    const result = registerSchema.safeParse({
      email: validEmail,
      password: "password8",
      username: "alice",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("alice");
    }
  });

  it("rejette mot de passe trop court", () => {
    const result = registerSchema.safeParse({
      email: validEmail,
      password: "short",
      username: "alice",
    });
    expect(result.success).toBe(false);
  });

  it("rejette username vide", () => {
    const result = registerSchema.safeParse({
      email: validEmail,
      password: "password8",
      username: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejette username trop long (> 50)", () => {
    const result = registerSchema.safeParse({
      email: validEmail,
      password: "password8",
      username: "a".repeat(51),
    });
    expect(result.success).toBe(false);
  });

  it("rejette les champs inconnus (strict)", () => {
    const result = registerSchema.safeParse({
      email: validEmail,
      password: "password8",
      username: "alice",
      role: "admin",
    });
    expect(result.success).toBe(false);
  });

  it("accepte username à la limite 50 caractères", () => {
    const result = registerSchema.safeParse({
      email: validEmail,
      password: "password8",
      username: "a".repeat(50),
    });
    expect(result.success).toBe(true);
  });

  it("accepte password exactement 8 caractères", () => {
    const result = registerSchema.safeParse({
      email: validEmail,
      password: "12345678",
      username: "alice",
    });
    expect(result.success).toBe(true);
  });
});
