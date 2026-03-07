import { describe, it, expect } from "vitest";
import {
  mapRealtimeMessageToMessage,
  type RealtimeMessageRow,
} from "@/features/messages/lib/mapRealtimeMessageToMessage";

describe("mapRealtimeMessageToMessage", () => {
  it("mappe tous les champs du payload Realtime vers Message", () => {
    const row: RealtimeMessageRow = {
      id: "msg-1",
      user_id: "user-1",
      conversation_id: "conv-1",
      text: "Hello",
      created_at: "2025-01-01T12:00:00Z",
    };
    const msg = mapRealtimeMessageToMessage(row);
    expect(msg.id).toBe("msg-1");
    expect(msg.senderId).toBe("user-1");
    expect(msg.conversationId).toBe("conv-1");
    expect(msg.text).toBe("Hello");
    expect(msg.createdAt).toBe("2025-01-01T12:00:00Z");
  });

  it("utilise 'room' quand conversation_id est null", () => {
    const row: RealtimeMessageRow = {
      id: "msg-2",
      user_id: "user-2",
      conversation_id: null,
      text: "Room message",
      created_at: "2025-01-01T12:00:00Z",
    };
    const msg = mapRealtimeMessageToMessage(row);
    expect(msg.conversationId).toBe("room");
    expect(msg.text).toBe("Room message");
  });

  it("convertit text null en chaîne vide", () => {
    const row: RealtimeMessageRow = {
      id: "msg-3",
      user_id: "user-3",
      conversation_id: "conv-3",
      text: null,
      created_at: "2025-01-01T12:00:00Z",
    };
    const msg = mapRealtimeMessageToMessage(row);
    expect(msg.text).toBe("");
  });
});
