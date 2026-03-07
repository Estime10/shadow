import { describe, it, expect } from "vitest";
import {
  parseCreateEventParams,
  parseUpdateEventParams,
  parseDeleteEventParams,
} from "@/features/calendar/schemas";
import {
  MAX_EVENT_TITLE_LENGTH,
  MAX_EVENT_DESCRIPTION_LENGTH,
} from "@/features/calendar/constants";

const validUUID = "e6a6c3b2-1234-4abc-8def-000000000001";
const validDate = "2025-12-01T10:00:00.000Z";

describe("createEventSchema / parseCreateEventParams", () => {
  it("accepte titre, date et description optionnelle", () => {
    const result = parseCreateEventParams({
      title: "Meeting",
      eventDate: validDate,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Meeting");
      expect(result.data.eventDate).toBe(validDate);
      expect(result.data.description).toBeNull();
    }
  });

  it("rejette titre vide", () => {
    const result = parseCreateEventParams({ title: "", eventDate: validDate });
    expect(result.success).toBe(false);
  });

  it("rejette titre trop long", () => {
    const result = parseCreateEventParams({
      title: "a".repeat(MAX_EVENT_TITLE_LENGTH + 1),
      eventDate: validDate,
    });
    expect(result.success).toBe(false);
  });

  it("rejette date invalide", () => {
    const result = parseCreateEventParams({ title: "OK", eventDate: "not-a-date" });
    expect(result.success).toBe(false);
  });

  it("rejette description trop longue", () => {
    const result = parseCreateEventParams({
      title: "OK",
      eventDate: validDate,
      description: "a".repeat(MAX_EVENT_DESCRIPTION_LENGTH + 1),
    });
    expect(result.success).toBe(false);
  });

  it("trim titre et description", () => {
    const result = parseCreateEventParams({
      title: "  Trimmed  ",
      eventDate: validDate,
      description: "  desc  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Trimmed");
      expect(result.data.description).toBe("desc");
    }
  });
});

describe("updateEventSchemaRefined / parseUpdateEventParams", () => {
  it("accepte eventId + champs optionnels", () => {
    const result = parseUpdateEventParams({
      eventId: validUUID,
      title: "Updated",
      eventDate: validDate,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.eventId).toBe(validUUID);
      expect(result.data.title).toBe("Updated");
    }
  });

  it("rejette eventId non UUID", () => {
    const result = parseUpdateEventParams({ eventId: "not-a-uuid", title: "OK" });
    expect(result.success).toBe(false);
  });

  it("rejette titre trop long", () => {
    const result = parseUpdateEventParams({
      eventId: validUUID,
      title: "a".repeat(MAX_EVENT_TITLE_LENGTH + 1),
    });
    expect(result.success).toBe(false);
  });
});

describe("parseDeleteEventParams", () => {
  it("accepte un UUID valide", () => {
    const result = parseDeleteEventParams(validUUID);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe(validUUID);
    }
  });

  it("rejette une chaîne non UUID", () => {
    expect(parseDeleteEventParams("").success).toBe(false);
    expect(parseDeleteEventParams("not-a-uuid").success).toBe(false);
    expect(parseDeleteEventParams("123").success).toBe(false);
  });

  it("rejette un type non string", () => {
    expect(parseDeleteEventParams(null).success).toBe(false);
    expect(parseDeleteEventParams(123).success).toBe(false);
  });
});

describe("createEventSchema — cas limites", () => {
  it("accepte description null explicitement", () => {
    const result = parseCreateEventParams({
      title: "OK",
      eventDate: validDate,
      description: null,
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.description).toBeNull();
  });

  it("accepte titre à la limite MAX_EVENT_TITLE_LENGTH", () => {
    const result = parseCreateEventParams({
      title: "a".repeat(MAX_EVENT_TITLE_LENGTH),
      eventDate: validDate,
    });
    expect(result.success).toBe(true);
  });

  it("accepte description à la limite MAX_EVENT_DESCRIPTION_LENGTH", () => {
    const result = parseCreateEventParams({
      title: "OK",
      eventDate: validDate,
      description: "b".repeat(MAX_EVENT_DESCRIPTION_LENGTH),
    });
    expect(result.success).toBe(true);
  });
});
