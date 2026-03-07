import { describe, it, expect } from "vitest";
import {
  parseCreateMessageFormData,
  parseDeleteMessageFormData,
  parseUpdateMessageFormData,
  parseCreateGroupPayload,
  otherUserIdSchema,
} from "@/features/messages/schemas";
import { MAX_MESSAGE_LENGTH } from "@/features/messages/constants";

const validConversationId = "e6a6c3b2-1234-4abc-8def-000000000001";
const validMessageId = "e6a6c3b2-1234-4abc-8def-000000000002";
const validUserId = "e6a6c3b2-1234-4abc-8def-000000000003";

describe("parseCreateMessageFormData", () => {
  it("accepte conversationId UUID et texte non vide", () => {
    const formData = new FormData();
    formData.set("conversationId", validConversationId);
    formData.set("text", "Hello");

    const result = parseCreateMessageFormData(formData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.conversationId).toBe(validConversationId);
      expect(result.data.text).toBe("Hello");
    }
  });

  it("rejette conversationId non UUID", () => {
    const formData = new FormData();
    formData.set("conversationId", "not-a-uuid");
    formData.set("text", "Hello");
    expect(parseCreateMessageFormData(formData).success).toBe(false);
  });

  it("rejette message vide", () => {
    const formData = new FormData();
    formData.set("conversationId", validConversationId);
    formData.set("text", "");
    expect(parseCreateMessageFormData(formData).success).toBe(false);
  });

  it("rejette message trop long", () => {
    const formData = new FormData();
    formData.set("conversationId", validConversationId);
    formData.set("text", "a".repeat(MAX_MESSAGE_LENGTH + 1));
    expect(parseCreateMessageFormData(formData).success).toBe(false);
  });
});

describe("parseDeleteMessageFormData", () => {
  it("accepte messageId et conversationId optionnel", () => {
    const formData = new FormData();
    formData.set("messageId", validMessageId);
    formData.set("conversationId", validConversationId);

    const result = parseDeleteMessageFormData(formData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.messageId).toBe(validMessageId);
      expect(result.data.conversationId).toBe(validConversationId);
    }
  });

  it("accepte conversationId null/absent", () => {
    const formData = new FormData();
    formData.set("messageId", validMessageId);

    const result = parseDeleteMessageFormData(formData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.messageId).toBe(validMessageId);
      expect(result.data.conversationId).toBeUndefined();
    }
  });

  it("rejette conversationId chaîne non UUID (ex. espaces)", () => {
    const formData = new FormData();
    formData.set("messageId", validMessageId);
    formData.set("conversationId", "   ");
    expect(parseDeleteMessageFormData(formData).success).toBe(false);
  });

  it("rejette messageId non UUID", () => {
    const formData = new FormData();
    formData.set("messageId", "invalid");
    expect(parseDeleteMessageFormData(formData).success).toBe(false);
  });
});

describe("parseUpdateMessageFormData", () => {
  it("accepte messageId, conversationId optionnel et texte", () => {
    const formData = new FormData();
    formData.set("messageId", validMessageId);
    formData.set("conversationId", validConversationId);
    formData.set("text", "Updated text");

    const result = parseUpdateMessageFormData(formData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.messageId).toBe(validMessageId);
      expect(result.data.text).toBe("Updated text");
    }
  });

  it("rejette messageId non UUID", () => {
    const formData = new FormData();
    formData.set("messageId", "invalid");
    formData.set("text", "OK");
    expect(parseUpdateMessageFormData(formData).success).toBe(false);
  });

  it("rejette texte vide", () => {
    const formData = new FormData();
    formData.set("messageId", validMessageId);
    formData.set("text", "");
    expect(parseUpdateMessageFormData(formData).success).toBe(false);
  });

  it("rejette texte trop long", () => {
    const formData = new FormData();
    formData.set("messageId", validMessageId);
    formData.set("text", "a".repeat(MAX_MESSAGE_LENGTH + 1));
    expect(parseUpdateMessageFormData(formData).success).toBe(false);
  });
});

describe("parseCreateGroupPayload", () => {
  it("accepte au moins 2 participantIds UUID", () => {
    const result = parseCreateGroupPayload({
      participantIds: [validUserId, validConversationId],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.participantIds).toHaveLength(2);
    }
  });

  it("rejette moins de 2 participants", () => {
    expect(parseCreateGroupPayload({ participantIds: [] }).success).toBe(false);
    expect(parseCreateGroupPayload({ participantIds: [validUserId] }).success).toBe(false);
  });

  it("rejette un id non UUID dans la liste", () => {
    const result = parseCreateGroupPayload({
      participantIds: [validUserId, "not-a-uuid"],
    });
    expect(result.success).toBe(false);
  });

  it("accepte plus de 2 participants", () => {
    const result = parseCreateGroupPayload({
      participantIds: [validUserId, validConversationId, validMessageId],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.participantIds).toHaveLength(3);
    }
  });
});

describe("otherUserIdSchema", () => {
  it("accepte un UUID valide", () => {
    const result = otherUserIdSchema.safeParse(validUserId);
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe(validUserId);
  });

  it("rejette une chaîne non UUID", () => {
    expect(otherUserIdSchema.safeParse("").success).toBe(false);
    expect(otherUserIdSchema.safeParse("x").success).toBe(false);
    expect(otherUserIdSchema.safeParse("123").success).toBe(false);
  });
});
