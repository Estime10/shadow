import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL doit être une URL valide"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY est requis"),
});

export type Env = z.output<typeof envSchema>;

let cached: Env | null = null;

/**
 * Retourne les variables d'environnement validées pour Supabase.
 * Lance en cas de valeur manquante ou invalide.
 * Résultat mis en cache pour éviter de revalider à chaque appel.
 */
export function getEnv(): Env {
  if (cached) return cached;
  const result = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  if (!result.success) {
    const first = result.error.flatten().fieldErrors;
    const msg = Object.entries(first)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join("; ");
    throw new Error(`Configuration invalide: ${msg}`);
  }
  cached = result.data;
  return result.data;
}
