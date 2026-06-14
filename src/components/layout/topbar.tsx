"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { RoleBadge } from "@/components/layout/role-badge";
import { Button } from "@/components/ui/button";

// ============================================================
// Topbar — user identity, role badge, logout action.
// Taste Skill: clean, no decorative elements, max 64px height.
// ============================================================

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-5">
      {/* Page title */}
      <span className="text-sm font-semibold text-foreground">
        {title ?? "Dashboard"}
      </span>

      {/* User info + logout */}
      <div className="flex items-center gap-3">
        {user && (
          <>
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground sm:block">
                {user.fullName}
              </span>
              <RoleBadge role={user.role} />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              id="topbar-logout-btn"
            >
              Sign out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
