import { describe, it, expect, vi, beforeEach } from "vitest";
import { createMessageAction } from "@/features/messages/actions/createMessageAction/createMessageAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/rateLimit", () => ({
  getClientIdentifier: vi.fn().mockResolvedValue("test-client"),
  isRateLimited: vi.fn().mockReturnValue(false),
  RATE_LIMIT_MESSAGE: "Trop de tentatives. Réessayez dans 15 minutes.",
}));
vi.mock("@/lib/supabase/CRUD", () => ({
  createMessage: vi.fn(),
}));

const { createMessage } = await import("@/lib/supabase/CRUD");

const validConversationId = "e6a6c3b2-1234-4abc-8def-000000000001";

describe("createMessageAction", () => {
  beforeEach(() => {
    vi.mocked(createMessage).mockReset();
  });

  it("retourne une erreur si FormData invalide (conversationId non UUID)", async () => {
    const formData = new FormData();
    formData.set("conversationId", "invalid");
    formData.set("text", "Hello");
    const result = await createMessageAction(formData);
    expect(result.error).toBeTruthy();
    expect(createMessage).not.toHaveBeenCalled();
  });

  it("retourne une erreur si message vide", async () => {
    const formData = new FormData();
    formData.set("conversationId", validConversationId);
    formData.set("text", "");
    const result = await createMessageAction(formData);
    expect(result.error).toBeTruthy();
    expect(createMessage).not.toHaveBeenCalled();
  });

  it("retourne error: null quand createMessage réussit", async () => {
    vi.mocked(createMessage).mockResolvedValue({ message: {} as never, error: null });
    const formData = new FormData();
    formData.set("conversationId", validConversationId);
    formData.set("text", "Hello");
    const result = await createMessageAction(formData);
    expect(result.error).toBeNull();
    expect(createMessage).toHaveBeenCalledWith(validConversationId, "Hello", undefined);
  });
});
