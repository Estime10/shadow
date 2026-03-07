import { describe, it, expect, vi } from "vitest";
import { requireUser } from "@/lib/supabase/requireUser";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

describe("requireUser", () => {
  it("retourne { error: 'Non authentifié' } quand getUser renvoie pas d'utilisateur", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      },
    } as unknown as SupabaseClient;

    const result = await requireUser(mockSupabase);
    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBe("Non authentifié");
    }
  });

  it("retourne { error: 'Non authentifié' } quand getUser renvoie une erreur", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: new Error("Session expired"),
        }),
      },
    } as unknown as SupabaseClient;

    const result = await requireUser(mockSupabase);
    expect("error" in result).toBe(true);
    if ("error" in result) {
      expect(result.error).toBe("Non authentifié");
    }
  });

  it("retourne { user } quand getUser renvoie un utilisateur", async () => {
    const mockUser: User = {
      id: "e6a6c3b2-1234-4abc-8def-000000000001",
      email: "user@example.com",
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    };

    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as unknown as SupabaseClient;

    const result = await requireUser(mockSupabase);
    expect("user" in result).toBe(true);
    if ("user" in result) {
      expect(result.user.id).toBe(mockUser.id);
      expect(result.user.email).toBe(mockUser.email);
    }
  });
});
