import { PageHeader, StatsGrid, StatCard } from "@/components/layout/dashboard-shell";

// ============================================================
// Student Dashboard Home
// Placeholder stat cards — no real data yet.
// ============================================================

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        description="Your EvalCore activity at a glance."
      />

      <StatsGrid>
        <StatCard label="Joined Classes" value="—" note="No data yet" />
        <StatCard label="Pending Labs" value="—" note="No data yet" />
        <StatCard label="Latest Submission" value="—" note="No data yet" />
        <StatCard label="Latest Score" value="—" note="No data yet" />
      </StatsGrid>

      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-foreground">Nothing here yet</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Join a class to start submitting labs. Your results will appear here.
        </p>
      </div>
    </div>
  );
}
