import { PageHeader, StatsGrid, StatCard } from "@/components/layout/dashboard-shell";

export default function LecturerDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Overview"
        description="Manage your classes, labs, and student results."
      />

      <StatsGrid>
        <StatCard label="Classes" value="—" note="No data yet" />
        <StatCard label="Active Labs" value="—" note="No data yet" />
        <StatCard label="Pending Submissions" value="—" note="No data yet" />
        <StatCard label="Average Score" value="—" note="No data yet" />
      </StatsGrid>

      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-12 flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-foreground">No activity yet</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Create a class and add labs to start receiving student submissions.
        </p>
      </div>
    </div>
  );
}
