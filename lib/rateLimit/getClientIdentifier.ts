import { headers } from "next/headers";

/**
 * Retourne un identifiant client pour le rate limiting.
 * Utilise x-forwarded-for (premier IP) ou x-real-ip en production derrière proxy.
 */
export async function getClientIdentifier(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
