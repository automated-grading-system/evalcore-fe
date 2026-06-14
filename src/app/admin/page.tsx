import { PageHeader, StatsGrid, StatCard } from "@/components/layout/dashboard-shell";

// ============================================================
// Admin Dashboard Home
// ============================================================

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <PageHeader
        title="System Overview"
        description="Monitor EvalCore infrastructure and user activity."
      />

      <StatsGrid>
        <StatCard label="Total Users" value="—" note="Accounts registered" />
        <StatCard label="Services" value="5 / 5" note="All systems nominal" />
        <StatCard label="Eval Queue" value="—" note="0 pending tasks" />
        <StatCard label="System Health" value="100%" note="No recent alerts" />
      </StatsGrid>

      <div className="rounded-md border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 px-8 py-16 flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800/50">
          <span className="text-zinc-500 text-lg">⚙️</span>
        </div>
        <div>
          <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">System Nominal</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            The API Gateway and Identity service are functioning properly. 
            Detailed service logs and evaluations will populate here.
          </p>
        </div>
      </div>
    </div>
  );
}
