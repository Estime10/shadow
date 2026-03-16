import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Toutes les routes sauf :
     * - _next/static, _next/image
     * - favicon et assets statiques
     * - PWA : sw.js, workbox-*.js, manifest.json (évite getClaims() inutile)
     */
    "/((?!_next/static|_next/image|favicon.ico|sw\\.js|workbox-[^/]*\\.js|manifest\\.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
