import { PageHeader, StatsGrid, StatCard } from "@/components/layout/dashboard-shell";

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        description="System health, user management, and evaluation queue."
      />

      <StatsGrid>
        <StatCard label="Users" value="—" note="No data yet" />
        <StatCard label="Services" value="—" note="No data yet" />
        <StatCard label="Evaluation Queue" value="—" note="No data yet" />
        <StatCard label="System Health" value="—" note="No data yet" />
      </StatsGrid>

      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-foreground">System monitoring pending</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Admin health and log integrations will appear here once the evaluation service is connected.
        </p>
      </div>
    </div>
  );
}
