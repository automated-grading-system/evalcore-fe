"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types/api";

// ============================================================
// Sidebar — role-based navigation with active state.
// ============================================================

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const STUDENT_NAV: NavItem[] = [
  { label: "Overview", href: "/student", icon: <GridIcon /> },
  { label: "My Classes", href: "/student/classes", icon: <BookIcon /> },
  {
    label: "Search Classes",
    href: "/student/classes/search",
    icon: <SearchIcon />,
  },
  { label: "Submissions", href: "/student/submissions", icon: <FileIcon /> },
  { label: "Notifications", href: "/notifications", icon: <BellIcon /> },
];

const LECTURER_NAV: NavItem[] = [
  { label: "Overview", href: "/lecturer", icon: <GridIcon /> },
  { label: "Classes", href: "/lecturer/classes", icon: <BookIcon /> },
  { label: "Labs", href: "/lecturer/labs", icon: <CodeIcon /> },
  { label: "Results", href: "/lecturer/results", icon: <ChartIcon /> },
  { label: "Notifications", href: "/notifications", icon: <BellIcon /> },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Overview", href: "/admin", icon: <GridIcon /> },
  { label: "Users", href: "/admin/users", icon: <UsersIcon /> },
  { label: "Health", href: "/admin/health", icon: <ServerIcon /> },
  { label: "Logs", href: "/admin/logs", icon: <TerminalIcon /> },
  { label: "Notifications", href: "/notifications", icon: <BellIcon /> },
];

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  student: STUDENT_NAV,
  lecturer: LECTURER_NAV,
  admin: ADMIN_NAV,
};

interface SidebarProps {
  role: Role;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_BY_ROLE[role];

  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/50 bg-background/50 backdrop-blur-md">
      {/* Brand mark */}
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 border border-primary/20">
          <span className="text-[10px] font-bold tracking-wider text-primary">
            EC
          </span>
        </div>
        <span className="text-sm font-semibold tracking-tight text-foreground">
          EvalCore
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <div className="mb-4 px-2">
          <p className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-widest">
            {role} Dashboard
          </p>
        </div>

        {navItems.map((item) => {
          const isActive =
            item.href === "/notifications"
              ? pathname === item.href
              : item.href === `/${role}`
                ? pathname === item.href
                : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all font-medium",
                isActive
                  ? "bg-primary/10 text-primary font-semibold border border-primary/10 shadow-xs"
                  : "text-muted-foreground hover:bg-zinc-900/50 hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "size-4 shrink-0 transition-colors",
                  isActive
                    ? "text-primary opacity-100"
                    : "text-muted-foreground opacity-80 group-hover:text-foreground",
                )}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

// ---------- Minimal inline icons ----------

function GridIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
      <line x1="6" y1="6" x2="6.01" y2="6" />
      <line x1="6" y1="18" x2="6.01" y2="18" />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}
