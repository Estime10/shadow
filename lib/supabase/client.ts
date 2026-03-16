import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase côté navigateur.
 * On n'utilise pas getEnv() ici pour éviter tout échec Zod/cache dans le bundle client
 * (authUserIdStore, badges, realtime) ; la validation Zod reste côté serveur (server.ts, middleware).
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  return createBrowserClient(url, anonKey);
}
