"use client";

import {
  ChevronDownIcon,
  LogOutIcon,
  MenuIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";

import { RoleBadge } from "@/components/layout/role-badge";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { useAuth } from "@/lib/auth/auth-context";

interface TopbarProps {
  title?: string;
  onOpenMenu: () => void;
}

function initials(name?: string) {
  return (name ?? "User")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Topbar({ title, onOpenMenu }: TopbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-18 shrink-0 items-center justify-between border-b border-border/80 bg-background/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          onClick={onOpenMenu}
          aria-label="Open navigation"
        >
          <MenuIcon />
        </Button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-foreground">
            {title ?? "Dashboard"}
          </p>
          <p className="hidden text-xs text-muted-foreground sm:block">
            EvalCore workspace
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <NotificationBell />

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 gap-2 px-1.5 sm:px-2"
                aria-label="Open account menu"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/12 text-xs font-bold text-primary">
                  {initials(user.fullName)}
                </span>
                <span className="hidden min-w-0 text-left lg:block">
                  <span className="block max-w-36 truncate text-xs font-semibold">
                    {user.fullName}
                  </span>
                  <span className="block max-w-36 truncate text-[10px] text-muted-foreground">
                    {user.email}
                  </span>
                </span>
                <ChevronDownIcon className="hidden size-3.5 text-muted-foreground lg:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-1.5">
              <DropdownMenuLabel className="space-y-1 px-2 py-2">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {user.fullName}
                </span>
                <span className="block truncate font-normal">{user.email}</span>
                <RoleBadge role={user.role} />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="px-2 py-2">
                <Link href={`/${user.role}`}>
                  <UserRoundIcon /> Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="px-2 py-2"
                onClick={logout}
                id="topbar-logout-btn"
              >
                <LogOutIcon /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>
    </header>
  );
}
