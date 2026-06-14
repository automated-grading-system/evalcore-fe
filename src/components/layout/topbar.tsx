"use client";

import { useAuth } from "@/lib/auth/auth-context";
import { RoleBadge } from "@/components/layout/role-badge";
import { Button } from "@/components/ui/button";

// ============================================================
// Topbar — user identity, role badge, logout action.
// ============================================================

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800/60 bg-zinc-950/80 px-6 lg:px-10">
      {/* Page title / Breadcrumb area */}
      <span className="text-sm font-medium text-zinc-300">
        {title ?? "Dashboard"}
      </span>

      {/* User info + logout */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-zinc-300 sm:block">
                {user.fullName}
              </span>
              <RoleBadge role={user.role} />
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              id="topbar-logout-btn"
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            >
              Sign out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
