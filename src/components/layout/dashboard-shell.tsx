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
    <div className="flex min-h-[100dvh] bg-zinc-950 font-sans text-zinc-50">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col min-w-0 bg-zinc-950">
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
    <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-zinc-800/60 pb-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight text-zinc-50">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-zinc-400 max-w-[60ch] leading-relaxed">
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
    <div className="rounded-md border border-zinc-800/60 bg-zinc-900/30 p-5 flex flex-col gap-3">
      <p className="text-[11px] font-mono font-medium text-zinc-500 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-3xl font-medium tracking-tight text-zinc-100">
        {value}
      </p>
      {note && <p className="text-xs text-zinc-500 font-medium">{note}</p>}
    </div>
  );
}
