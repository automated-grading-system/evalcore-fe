import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types/api";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

// ============================================================
// DashboardShell — the full layout frame for role pages.
// Taste Skill: structured columns, controlled density,
// no decorative backgrounds.
// ============================================================

interface DashboardShellProps {
  role: Role;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({
  role,
  title,
  children,
  className,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-[100dvh] bg-background">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col min-w-0">
        <Topbar title={title} />
        <main className={cn("flex-1 p-6 overflow-auto", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ---- Page section helpers (layout rhythm) ----

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground max-w-[60ch]">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}

export function StatsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{children}</div>
  );
}

export interface StatCardProps {
  label: string;
  value: string | number;
  note?: string;
}

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {note && <p className="mt-1 text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
