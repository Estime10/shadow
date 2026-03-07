import { describe, it, expect, vi, afterEach } from "vitest";
import { formatRelativeTime } from "@/lib/functions/formatRelativeTime/formatRelativeTime";

describe("formatRelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("retourne l'heure pour une date aujourd'hui", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-02-24T14:30:00.000Z"));
    const iso = "2025-02-24T14:30:00.000Z";
    const result = formatRelativeTime(iso);
    expect(result).toMatch(/\d{1,2}:\d{2}/);
    vi.useRealTimers();
  });

  it("retourne 'Hier' pour la veille", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-02-24T12:00:00.000Z"));
    const yesterday = "2025-02-23T10:00:00.000Z";
    expect(formatRelativeTime(yesterday)).toBe("Hier");
    vi.useRealTimers();
  });

  it("retourne une date formatée pour un jour antérieur (pas hier)", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-02-24T12:00:00.000Z"));
    const old = "2025-02-20T10:00:00.000Z";
    const result = formatRelativeTime(old);
    expect(result).not.toBe("Hier");
    expect(result).toMatch(/\d{2}\/\d{2}/);
    vi.useRealTimers();
  });
});
