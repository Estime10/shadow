import { describe, it, expect } from "vitest";
import { mapEventRowToCalendarEvent } from "@/lib/supabase/CRUD/events/mappers/mappers";
import type { EventRow } from "@/lib/supabase/CRUD/events/types/types";

describe("mapEventRowToCalendarEvent", () => {
  it("mappe tous les champs correctement", () => {
    const row: EventRow = {
      id: "e6a6c3b2-1234-4abc-8def-000000000001",
      title: "Meeting",
      description: "Description",
      event_date: "2025-12-01",
      created_by: "user-id",
      created_at: "2025-01-01T10:00:00Z",
    };
    const event = mapEventRowToCalendarEvent(row);
    expect(event.id).toBe(row.id);
    expect(event.title).toBe(row.title);
    expect(event.description).toBe("Description");
    expect(event.eventDate).toBe(row.event_date);
    expect(event.createdBy).toBe(row.created_by);
    expect(event.createdAt).toBe(row.created_at);
  });

  it("convertit description null en null", () => {
    const row: EventRow = {
      id: "e6a6c3b2-1234-4abc-8def-000000000002",
      title: "Sans description",
      description: null,
      event_date: "2025-12-01",
      created_by: "user-id",
      created_at: "2025-01-01T10:00:00Z",
    };
    const event = mapEventRowToCalendarEvent(row);
    expect(event.description).toBeNull();
  });
});
