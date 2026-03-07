import { describe, it, expect } from "vitest";
import { stepTimeString } from "@/lib/functions/stepTimeString/stepTimeString";

describe("stepTimeString", () => {
  const step = 15;

  it("avance d'un palier (direction 1)", () => {
    expect(stepTimeString("12:00", step, 1)).toBe("12:15");
    expect(stepTimeString("12:15", step, 1)).toBe("12:30");
    expect(stepTimeString("12:45", step, 1)).toBe("13:00");
  });

  it("recule d'un palier (direction -1)", () => {
    expect(stepTimeString("12:30", step, -1)).toBe("12:15");
    expect(stepTimeString("12:15", step, -1)).toBe("12:00");
    expect(stepTimeString("13:00", step, -1)).toBe("12:45");
  });

  it("arrondit au palier supérieur quand entre deux (flèche haut)", () => {
    expect(stepTimeString("12:01", step, 1)).toBe("12:15");
    expect(stepTimeString("12:59", step, 1)).toBe("13:00");
  });

  it("arrondit au palier inférieur quand entre deux (flèche bas)", () => {
    expect(stepTimeString("12:14", step, -1)).toBe("12:00");
    expect(stepTimeString("13:01", step, -1)).toBe("13:00");
  });

  it("boucle minuit (23:45 + 1 → 00:00)", () => {
    expect(stepTimeString("23:45", step, 1)).toBe("00:00");
  });

  it("boucle minuit (00:00 - 1 → 23:45)", () => {
    expect(stepTimeString("00:00", step, -1)).toBe("23:45");
  });

  it("pas de 30 : paliers :00 et :30", () => {
    expect(stepTimeString("12:00", 30, 1)).toBe("12:30");
    expect(stepTimeString("12:30", 30, 1)).toBe("13:00");
    expect(stepTimeString("12:15", 30, 1)).toBe("12:30");
  });
});
