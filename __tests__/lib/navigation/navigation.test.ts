import { describe, it, expect } from "vitest";
import { mainNavItems } from "@/lib/navigation/navigation";

describe("mainNavItems", () => {
  it("contient les 4 entrées attendues", () => {
    expect(mainNavItems).toHaveLength(4);
  });

  it("chaque entrée a href, label et badge", () => {
    for (const item of mainNavItems) {
      expect(item).toHaveProperty("href");
      expect(item).toHaveProperty("label");
      expect(item).toHaveProperty("badge");
      expect(typeof item.href).toBe("string");
      expect(typeof item.label).toBe("string");
      expect(item.badge).toBeNull();
    }
  });

  it("contient Accueil, Messages, Calendrier, Notifications", () => {
    const labels = mainNavItems.map((i) => i.label);
    expect(labels).toContain("Accueil");
    expect(labels).toContain("Messages");
    expect(labels).toContain("Calendrier");
    expect(labels).toContain("Notifications");
  });

  it("hrefs sont absolus et cohérents", () => {
    expect(mainNavItems.find((i) => i.label === "Accueil")?.href).toBe("/");
    expect(mainNavItems.find((i) => i.label === "Messages")?.href).toBe("/messages");
    expect(mainNavItems.find((i) => i.label === "Calendrier")?.href).toBe("/calendar");
    expect(mainNavItems.find((i) => i.label === "Notifications")?.href).toBe("/notifications");
  });
});
