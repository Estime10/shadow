import { describe, it, expect } from "vitest";
import { isPublicRoute, PUBLIC_ROUTES } from "@/lib/config/publicRoutes";

describe("isPublicRoute", () => {
  it("retourne true pour /login", () => {
    expect(isPublicRoute("/login")).toBe(true);
  });

  it("retourne true pour /register", () => {
    expect(isPublicRoute("/register")).toBe(true);
  });

  it("retourne false pour /", () => {
    expect(isPublicRoute("/")).toBe(false);
  });

  it("retourne false pour /messages", () => {
    expect(isPublicRoute("/messages")).toBe(false);
  });

  it("retourne false pour /calendar", () => {
    expect(isPublicRoute("/calendar")).toBe(false);
  });

  it("retourne false pour une route inconnue", () => {
    expect(isPublicRoute("/admin")).toBe(false);
    expect(isPublicRoute("/api/secret")).toBe(false);
  });
});

describe("PUBLIC_ROUTES", () => {
  it("contient exactement /login et /register", () => {
    expect(PUBLIC_ROUTES).toEqual(["/login", "/register"]);
  });
});
