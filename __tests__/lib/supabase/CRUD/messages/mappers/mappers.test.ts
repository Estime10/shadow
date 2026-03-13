import { describe, it, expect } from "vitest";
import { mapMessageRowToMessage } from "@/lib/supabase/CRUD/messages/mappers/mappers";
import { ROOM_CONVERSATION_ID } from "@/lib/supabase/constants";
import type { MessageRow } from "@/lib/supabase/CRUD/messages/types/types";

describe("mapMessageRowToMessage", () => {
  it("mappe tous les champs correctement", () => {
    const row: MessageRow = {
      id: "msg-id",
      user_id: "user-id",
      conversation_id: "conv-id",
      text: "Hello",
      media_url: null,
      media_type: null,
      created_at: "2025-01-01T10:00:00Z",
      expires_at: null,
    };
    const message = mapMessageRowToMessage(row);
    expect(message.id).toBe(row.id);
    expect(message.senderId).toBe(row.user_id);
    expect(message.conversationId).toBe("conv-id");
    expect(message.text).toBe("Hello");
    expect(message.createdAt).toBe(row.created_at);
  });

  it("utilise ROOM_CONVERSATION_ID quand conversation_id est null", () => {
    const row: MessageRow = {
      id: "msg-id",
      user_id: "user-id",
      conversation_id: null,
      text: "Room msg",
      media_url: null,
      media_type: null,
      created_at: "2025-01-01T10:00:00Z",
      expires_at: null,
    };
    const message = mapMessageRowToMessage(row);
    expect(message.conversationId).toBe(ROOM_CONVERSATION_ID);
    expect(message.text).toBe("Room msg");
  });

  it("convertit text null en chaîne vide", () => {
    const row: MessageRow = {
      id: "msg-id",
      user_id: "user-id",
      conversation_id: "conv-id",
      text: null,
      media_url: null,
      media_type: null,
      created_at: "2025-01-01T10:00:00Z",
      expires_at: null,
    };
    const message = mapMessageRowToMessage(row);
    expect(message.text).toBe("");
  });
});
