import type { Role } from "@/lib/types/api";

// ============================================================
// Role-based routing utilities.
// Centralised so dashboard redirect logic never lives in pages.
// ============================================================

export function getDashboardPath(role: Role): string {
  switch (role) {
    case "student":
      return "/student";
    case "lecturer":
      return "/lecturer";
    case "admin":
      return "/admin";
    default:
      return "/login";
  }
}

export function isAllowedForRole(
  pathname: string,
  role: Role | undefined,
): boolean {
  if (!role) return false;

  if (pathname.startsWith("/student")) return role === "student";
  if (pathname.startsWith("/lecturer")) return role === "lecturer";
  if (pathname.startsWith("/admin")) return role === "admin";

  return true;
}
