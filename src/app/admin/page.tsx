import {
  PageHeader,
  StatsGrid,
  StatCard,
} from "@/components/layout/dashboard-shell";

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

      <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card px-8 py-16 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <span className="text-lg text-muted-foreground">⚙️</span>
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground">
            System Nominal
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            The API Gateway and Identity service are functioning properly.
            Detailed service logs and evaluations will populate here.
          </p>
        </div>
      </div>
    </div>
  );
}
