import { describe, it, expect, vi, beforeEach } from "vitest";
import { createGroupConversationAction } from "@/features/messages/actions/createGroupConversationAction/createGroupConversationAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/supabase/CRUD", () => ({
  createGroupConversation: vi.fn(),
}));

const { createGroupConversation } = await import("@/lib/supabase/CRUD");

const validId1 = "e6a6c3b2-1234-4abc-8def-000000000001";
const validId2 = "e6a6c3b2-1234-4abc-8def-000000000002";

describe("createGroupConversationAction", () => {
  beforeEach(() => {
    vi.mocked(createGroupConversation).mockReset();
  });

  it("retourne une erreur si moins de 2 participants (validation Zod)", async () => {
    const r1 = await createGroupConversationAction([]);
    expect(r1.conversationId).toBe("");
    expect(r1.error).toBeTruthy();
    expect(createGroupConversation).not.toHaveBeenCalled();

    const r2 = await createGroupConversationAction([validId1]);
    expect(r2.error).toBeTruthy();
    expect(createGroupConversation).not.toHaveBeenCalled();
  });

  it("retourne une erreur si un id n'est pas un UUID", async () => {
    const result = await createGroupConversationAction([validId1, "not-a-uuid"]);
    expect(result.conversationId).toBe("");
    expect(result.error).toBeTruthy();
    expect(createGroupConversation).not.toHaveBeenCalled();
  });

  it("appelle createGroupConversation et retourne conversationId quand succès", async () => {
    vi.mocked(createGroupConversation).mockResolvedValue({
      conversationId: "conv-uuid",
      error: null,
    });
    const result = await createGroupConversationAction([validId1, validId2]);
    expect(result.error).toBeNull();
    expect(result.conversationId).toBe("conv-uuid");
    expect(createGroupConversation).toHaveBeenCalledWith([validId1, validId2]);
  });

  it("retourne l'erreur CRUD quand createGroupConversation échoue", async () => {
    vi.mocked(createGroupConversation).mockResolvedValue({
      conversationId: "",
      error: "Impossible de créer le groupe",
    });
    const result = await createGroupConversationAction([validId1, validId2]);
    expect(result.error).toBe("Impossible de créer le groupe");
    expect(result.conversationId).toBe("");
  });
});
