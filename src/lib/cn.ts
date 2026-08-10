/**
 * Joins class names, dropping falsy values so callers can write
 * `cn("base", isActive && "active")` without producing "base false".
 *
 * Deliberately not tailwind-merge: nothing in this codebase relies on later
 * utilities overriding earlier ones, and a 6-line function beats a dependency.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
