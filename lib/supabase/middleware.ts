import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getEnv } from "@/lib/config/env";
import { isPublicRoute } from "@/lib/config/publicRoutes";

const CONFIG_ERROR_HTML =
  "<!DOCTYPE html><html><body><h1>Configuration error</h1><p>Missing or invalid Supabase configuration.</p></body></html>";
const UNAVAILABLE_HTML =
  "<!DOCTYPE html><html><body><h1>Service temporarily unavailable</h1><p>Please try again later.</p></body></html>";
const HTML_HEADERS = { "Content-Type": "text/html; charset=utf-8" } as const;

/**
 * Rafraîchit la session Supabase Auth et met à jour les cookies (request + response).
 * À appeler depuis le middleware sur chaque requête concernée.
 *
 * Utilise getUser() pour la redirection : il distingue un utilisateur connecté d’une
 * session anonyme (getClaims() peut retourner des claims même pour anon).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  let url: string;
  let anonKey: string;
  try {
    const env = getEnv();
    url = env.NEXT_PUBLIC_SUPABASE_URL;
    anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  } catch {
    return new NextResponse(CONFIG_ERROR_HTML, { status: 503, headers: HTML_HEADERS });
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  let authenticatedUser: { id: string } | null = null;
  try {
    const { data } = await supabase.auth.getUser();
    authenticatedUser = data?.user ?? null;
  } catch {
    return new NextResponse(UNAVAILABLE_HTML, { status: 503, headers: HTML_HEADERS });
  }

  const pathname = request.nextUrl.pathname;
  if (!authenticatedUser && !isPublicRoute(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
