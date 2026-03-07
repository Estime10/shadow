import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteEventAction } from "@/features/calendar/actions/deleteEventAction/deleteEventAction";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/supabase/CRUD", () => ({
  deleteEvent: vi.fn(),
}));

const { deleteEvent } = await import("@/lib/supabase/CRUD");

describe("deleteEventAction", () => {
  beforeEach(() => {
    vi.mocked(deleteEvent).mockReset();
  });

  it("retourne 'ID événement invalide' si eventId invalide", async () => {
    expect(await deleteEventAction("")).toMatchObject({ error: "ID événement invalide" });
    expect(await deleteEventAction("not-a-uuid")).toMatchObject({
      error: "ID événement invalide",
    });
    expect(await deleteEventAction(null)).toMatchObject({ error: "ID événement invalide" });
    expect(deleteEvent).not.toHaveBeenCalled();
  });

  it("retourne error: null quand deleteEvent réussit", async () => {
    vi.mocked(deleteEvent).mockResolvedValue({ ok: true, error: null });
    const result = await deleteEventAction("e6a6c3b2-1234-4abc-8def-000000000001");
    expect(result.error).toBeNull();
    expect(deleteEvent).toHaveBeenCalledWith("e6a6c3b2-1234-4abc-8def-000000000001");
  });

  it("retourne l'erreur quand deleteEvent échoue", async () => {
    vi.mocked(deleteEvent).mockResolvedValue({ ok: false, error: "Non autorisé" });
    const result = await deleteEventAction("e6a6c3b2-1234-4abc-8def-000000000001");
    expect(result.error).toBe("Non autorisé");
  });
});
