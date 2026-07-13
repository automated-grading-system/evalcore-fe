"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { useAuth } from "@/lib/auth/auth-context";
import { useUnreadNotificationCount } from "@/features/notifications/hooks/use-notifications";
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
  const unreadCountQuery = useUnreadNotificationCount();
  const unreadCount = unreadCountQuery.data?.count ?? 0;

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-md px-6 lg:px-10">
      {/* Page title / Breadcrumb area */}
      <span className="text-sm font-semibold tracking-tight text-foreground">
        {title ?? "Dashboard"}
      </span>

      {/* User info + logout */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="relative text-muted-foreground hover:text-foreground"
            >
              <Link href="/notifications" aria-label="Open notifications">
                <Bell />
                {unreadCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-none text-primary-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                ) : null}
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm font-medium text-foreground sm:block">
                {user.fullName}
              </span>
              <RoleBadge role={user.role} />
            </div>
            <div className="h-4 w-px bg-border/60" />
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              id="topbar-logout-btn"
              className="text-muted-foreground hover:text-foreground hover:bg-secondary/80 border border-transparent hover:border-border/30"
            >
              Sign out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
