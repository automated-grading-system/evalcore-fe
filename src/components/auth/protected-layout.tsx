"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { getDashboardPath, isAllowedForRole } from "@/lib/auth/role-utils";

// ============================================================
// ProtectedLayout — wraps role-specific route layouts.
//
// - Unauthenticated users are redirected to /login.
// - Authenticated users in the wrong role area are redirected
//   to their correct dashboard.
// - Shows nothing (null) while the auth check is in progress.
// ============================================================

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { isAuthenticated, isCheckingAuth, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isCheckingAuth) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user && !isAllowedForRole(pathname, user.role)) {
      router.replace(getDashboardPath(user.role));
    }
  }, [isAuthenticated, isCheckingAuth, user, pathname, router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-foreground" />
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;
  if (!isAllowedForRole(pathname, user.role)) return null;

  return <>{children}</>;
}
