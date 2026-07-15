"use client";

import { BellIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useUnreadNotificationCount } from "@/features/notifications/hooks/use-notifications";

export function NotificationBell() {
  const unreadCount = useUnreadNotificationCount().data?.count ?? 0;

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      asChild
      className="relative"
      aria-label={
        unreadCount
          ? `Open notifications, ${unreadCount} unread`
          : "Open notifications"
      }
    >
      <Link href="/notifications">
        <BellIcon />
        {unreadCount > 0 ? (
          <span className="absolute right-0 top-0 flex min-w-4 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-destructive px-1 text-[9px] font-bold leading-4 text-white ring-2 ring-background">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </Link>
    </Button>
  );
}
