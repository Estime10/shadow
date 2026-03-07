import { describe, it, expect } from "vitest";
import { NAV_BOTTOM_REM, NAV_BOTTOM_PX } from "@/lib/config/layout";

describe("layout config", () => {
  it("NAV_BOTTOM_REM est un nombre positif", () => {
    expect(NAV_BOTTOM_REM).toBe(5);
    expect(NAV_BOTTOM_REM).toBeGreaterThan(0);
  });

  it("NAV_BOTTOM_PX vaut NAV_BOTTOM_REM * 16", () => {
    expect(NAV_BOTTOM_PX).toBe(NAV_BOTTOM_REM * 16);
    expect(NAV_BOTTOM_PX).toBe(80);
  });
});
