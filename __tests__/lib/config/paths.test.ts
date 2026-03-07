import { describe, it, expect } from "vitest";
import { PATHS } from "@/lib/config/paths";

describe("PATHS", () => {
  it("expose CALENDAR et MESSAGES", () => {
    expect(PATHS.CALENDAR).toBe("/calendar");
    expect(PATHS.MESSAGES).toBe("/messages");
  });

  it("messageConversation retourne le chemin avec l'id", () => {
    const id = "e6a6c3b2-1234-4abc-8def-000000000001";
    expect(PATHS.messageConversation(id)).toBe(`/messages/${id}`);
  });

  it("messageConversation est déterministe pour un même id", () => {
    const id = "a1b2c3d4-0000-4000-8000-000000000000";
    expect(PATHS.messageConversation(id)).toBe(PATHS.messageConversation(id));
  });
});
