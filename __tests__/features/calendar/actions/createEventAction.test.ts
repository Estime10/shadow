import { describe, it, expect, vi, beforeEach } from "vitest";
import { createEventAction } from "@/features/calendar/actions/createEventAction/createEventAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/supabase/CRUD", () => ({
  createEvent: vi.fn(),
}));

const { createEvent } = await import("@/lib/supabase/CRUD");

describe("createEventAction", () => {
  beforeEach(() => {
    vi.mocked(createEvent).mockReset();
  });

  it("retourne une erreur si params invalides (validation Zod)", async () => {
    const result = await createEventAction({});
    expect(result.error).toBeTruthy();
    expect(typeof result.error).toBe("string");
    expect(createEvent).not.toHaveBeenCalled();
  });

  it("retourne une erreur si titre vide", async () => {
    const result = await createEventAction({
      title: "",
      eventDate: "2025-12-01T10:00:00.000Z",
    });
    expect(result.error).toBeTruthy();
    expect(createEvent).not.toHaveBeenCalled();
  });

  it("retourne une erreur si date invalide", async () => {
    const result = await createEventAction({
      title: "OK",
      eventDate: "not-a-date",
    });
    expect(result.error).toBeTruthy();
    expect(createEvent).not.toHaveBeenCalled();
  });

  it("retourne error: null quand createEvent réussit", async () => {
    vi.mocked(createEvent).mockResolvedValue({ event: {} as never, error: null });
    const result = await createEventAction({
      title: "Meeting",
      eventDate: "2025-12-01T10:00:00.000Z",
    });
    expect(result.error).toBeNull();
    expect(createEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Meeting",
        eventDate: "2025-12-01T10:00:00.000Z",
      })
    );
  });

  it("retourne l'erreur Supabase quand createEvent échoue", async () => {
    vi.mocked(createEvent).mockResolvedValue({
      event: null,
      error: "Erreur DB",
    });
    const result = await createEventAction({
      title: "Meeting",
      eventDate: "2025-12-01T10:00:00.000Z",
    });
    expect(result.error).toBe("Erreur DB");
  });
});
