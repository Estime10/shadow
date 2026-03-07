import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/server", () => {
  class NextResponseMock extends Response {
    constructor(body?: BodyInit | null, init?: ResponseInit & { status?: number }) {
      super(body ?? null, init);
    }
    static next() {
      return new Response();
    }
    static redirect(url: URL) {
      return Response.redirect(url);
    }
  }
  return { NextResponse: NextResponseMock };
});

describe("updateSession", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne 503 quand NEXT_PUBLIC_SUPABASE_URL est absent", async () => {
    const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "key";

    const { updateSession } = await import("@/lib/supabase/middleware");
    const request = new Request("https://example.com/");
    const nextRequest = Object.assign(request, {
      nextUrl: new URL("https://example.com/"),
      cookies: { getAll: () => [], set: () => {} },
    }) as unknown as import("next/server").NextRequest;

    const response = await updateSession(nextRequest);

    expect(response.status).toBe(503);
    if (origUrl !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    if (origKey !== undefined) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
  });

  it("retourne 503 quand NEXT_PUBLIC_SUPABASE_ANON_KEY est absent", async () => {
    const origUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const origKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://xxx.supabase.co";
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const { updateSession } = await import("@/lib/supabase/middleware");
    const request = new Request("https://example.com/");
    const nextRequest = Object.assign(request, {
      nextUrl: new URL("https://example.com/"),
      cookies: { getAll: () => [], set: () => {} },
    }) as unknown as import("next/server").NextRequest;

    const response = await updateSession(nextRequest);

    expect(response.status).toBe(503);
    if (origUrl !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = origUrl;
    if (origKey !== undefined) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = origKey;
  });
});
