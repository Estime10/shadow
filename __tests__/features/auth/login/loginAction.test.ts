import { describe, it, expect, vi, beforeEach } from "vitest";
import { loginAction } from "@/features/auth/login/loginAction/loginAction";
import { RATE_LIMIT_MESSAGE } from "@/lib/rateLimit";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({
        error: { message: "Invalid login credentials" },
      }),
    },
  }),
}));
vi.mock("@/lib/rateLimit", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/rateLimit")>();
  return {
    ...actual,
    getClientIdentifier: vi.fn().mockResolvedValue("test-ip-rate-limit"),
  };
});

describe("loginAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne RATE_LIMIT_MESSAGE après 10 tentatives (rate limiting)", async () => {
    const formData = new FormData();
    formData.set("email", "user@example.com");
    formData.set("password", "password123");

    for (let i = 0; i < 10; i++) {
      const result = await loginAction(formData);
      expect(result.success).toBe(false);
      if (!result.success) expect(result.error).not.toBe(RATE_LIMIT_MESSAGE);
    }

    const eleventh = await loginAction(formData);
    expect(eleventh.success).toBe(false);
    if (!eleventh.success) expect(eleventh.error).toBe(RATE_LIMIT_MESSAGE);
  });
});
