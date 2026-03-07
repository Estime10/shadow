/**
 * Routes accessibles sans authentification.
 * Utilisé par le middleware pour ne pas rediriger vers /login sur ces chemins.
 */
export const PUBLIC_ROUTES = ["/login", "/register"] as const;

export function isPublicRoute(pathname: string): boolean {
  return (PUBLIC_ROUTES as readonly string[]).includes(pathname);
}
