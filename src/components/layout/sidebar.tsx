"use client";

import {
  BellIcon,
  BookOpenIcon,
  ChartNoAxesColumnIcon,
  FlaskConicalIcon,
  GaugeIcon,
  HeartPulseIcon,
  SearchIcon,
  ServerCogIcon,
  TerminalSquareIcon,
  UploadCloudIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import type { Role } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  student: [
    { label: "Overview", href: "/student", icon: GaugeIcon },
    { label: "My classes", href: "/student/classes", icon: BookOpenIcon },
    {
      label: "Find a class",
      href: "/student/classes/search",
      icon: SearchIcon,
    },
    {
      label: "Submissions",
      href: "/student/submissions",
      icon: UploadCloudIcon,
    },
    { label: "Notifications", href: "/notifications", icon: BellIcon },
  ],
  lecturer: [
    { label: "Overview", href: "/lecturer", icon: GaugeIcon },
    { label: "Classes", href: "/lecturer/classes", icon: BookOpenIcon },
    { label: "Labs", href: "/lecturer/labs", icon: FlaskConicalIcon },
    {
      label: "Results",
      href: "/lecturer/results",
      icon: ChartNoAxesColumnIcon,
    },
    { label: "Notifications", href: "/notifications", icon: BellIcon },
  ],
  admin: [
    { label: "Overview", href: "/admin", icon: GaugeIcon },
    { label: "Users", href: "/admin/users", icon: UsersIcon },
    { label: "Health", href: "/admin/health", icon: HeartPulseIcon },
    { label: "Logs", href: "/admin/logs", icon: TerminalSquareIcon },
    { label: "Notifications", href: "/notifications", icon: BellIcon },
  ],
};

function isItemActive(pathname: string, item: NavItem, navItems: NavItem[]) {
  if (pathname === item.href) return true;
  if (!pathname.startsWith(`${item.href}/`)) return false;
  return !navItems.some(
    (candidate) =>
      candidate.href !== item.href &&
      candidate.href.startsWith(`${item.href}/`) &&
      (pathname === candidate.href ||
        pathname.startsWith(`${candidate.href}/`)),
  );
}

interface SidebarProps {
  role: Role;
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ role, mobile, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_BY_ROLE[role];

  return (
    <aside
      className={cn(
        "flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
        mobile
          ? "fixed inset-y-0 left-0 z-50 shadow-2xl md:hidden"
          : "sticky top-0 hidden h-dvh md:flex",
      )}
      aria-label="Primary navigation"
    >
      <div className="flex h-18 items-center justify-between border-b border-sidebar-border px-5">
        <Link
          href={`/${role}`}
          onClick={onClose}
          aria-label="EvalCore dashboard"
        >
          <Brand />
        </Link>
        {mobile ? (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <XIcon />
          </Button>
        ) : null}
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 overflow-y-auto p-4">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {role} workspace
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isItemActive(pathname, item, navItems);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/65 hover:text-sidebar-foreground",
              )}
            >
              <span
                className={cn(
                  "absolute inset-y-2 left-0 w-0.5 rounded-full bg-sidebar-primary transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon
                className={cn("size-4.5", active && "text-sidebar-primary")}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-3">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary/12 text-sidebar-primary">
            <ServerCogIcon className="size-4" />
          </span>
          <span>
            <span className="block text-xs font-semibold">Local workspace</span>
            <span className="block text-[11px] text-muted-foreground">
              Gateway-backed services
            </span>
          </span>
        </div>
      </div>
    </aside>
  );
}
