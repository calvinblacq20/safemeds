/**
 * Routes reachable without a session.
 *
 * Single source of truth: the middleware and the client-side `useAuth` redirect
 * both read this. When they drifted apart, middleware let anonymous users into
 * /consult and /track while the hook immediately bounced them to /auth.
 */
export const PUBLIC_ROUTES = [
  "/",
  "/auth",
  "/signin",
  "/signup",
  "/verify",
  "/about",
  "/contact",
  "/search",
  "/legal",
  "/consult",
  "/track",
  "/delivery",
] as const;

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
