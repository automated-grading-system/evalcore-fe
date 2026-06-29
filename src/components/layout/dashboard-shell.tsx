import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types/api";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

// ============================================================
// DashboardShell — the full layout frame for role pages.
// Taste Skill: structured columns, controlled density,
// premium dark aesthetics.
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
    <div className="flex min-h-[100dvh] bg-background font-sans text-foreground">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col min-w-0 bg-background">
        <Topbar title={title} />
        <main className={cn("flex-1 p-6 lg:p-10 overflow-auto", className)}>
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
    <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-border/40 pb-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-[60ch] leading-relaxed">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{children}</div>
  );
}

export interface StatCardProps {
  label: string;
  value: string | number;
  note?: string;
}

export function StatCard({ label, value, note }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-5 flex flex-col gap-3 shadow-xs">
      <p className="text-[11px] font-mono font-semibold text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
      <p className="text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {note && <p className="text-xs text-muted-foreground font-medium">{note}</p>}
    </div>
  );
}
