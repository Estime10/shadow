import { describe, it, expect } from "vitest";
import {
  parseCreateEventParams,
  parseUpdateEventParams,
  parseDeleteEventParams,
  eventFormSchema,
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

describe("eventFormSchema (formulaire événement)", () => {
  it("accepte titre, time et description optionnelle", () => {
    const result = eventFormSchema.safeParse({
      title: "Réunion",
      time: "14:30",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Réunion");
      expect(result.data.time).toBe("14:30");
      expect(result.data.description).toBe("");
    }
  });

  it("trim titre et description", () => {
    const result = eventFormSchema.safeParse({
      title: "  Titre  ",
      description: "  desc  ",
      time: "09:00",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("Titre");
      expect(result.data.description).toBe("desc");
    }
  });

  it("rejette titre vide", () => {
    const result = eventFormSchema.safeParse({ title: "", time: "10:00" });
    expect(result.success).toBe(false);
  });

  it("rejette titre trop long", () => {
    const result = eventFormSchema.safeParse({
      title: "a".repeat(MAX_EVENT_TITLE_LENGTH + 1),
      time: "10:00",
    });
    expect(result.success).toBe(false);
  });

  it("rejette time invalide (format non HH:MM)", () => {
    expect(eventFormSchema.safeParse({ title: "OK", time: "12:3" }).success).toBe(false);
    expect(eventFormSchema.safeParse({ title: "OK", time: "" }).success).toBe(false);
    expect(eventFormSchema.safeParse({ title: "OK", time: "12h30" }).success).toBe(false);
  });

  it("accepte time au format HH:MM", () => {
    expect(eventFormSchema.safeParse({ title: "OK", time: "09:30" }).success).toBe(true);
    expect(eventFormSchema.safeParse({ title: "OK", time: "23:59" }).success).toBe(true);
  });

  it("rejette description trop longue", () => {
    const result = eventFormSchema.safeParse({
      title: "OK",
      time: "10:00",
      description: "a".repeat(MAX_EVENT_DESCRIPTION_LENGTH + 1),
    });
    expect(result.success).toBe(false);
  });
});
