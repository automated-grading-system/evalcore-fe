import { PageHeader, StatsGrid, StatCard } from "@/components/layout/dashboard-shell";

// ============================================================
// Lecturer Dashboard Home
// ============================================================

export default function LecturerDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <PageHeader
        title="Overview"
        description="Manage your classes, labs, and student evaluations."
      />

      <StatsGrid>
        <StatCard label="Classes" value="—" note="No active classes" />
        <StatCard label="Active Labs" value="—" note="No ongoing labs" />
        <StatCard label="Pending Submissions" value="—" note="Queue is empty" />
        <StatCard label="Average Score" value="—" note="No grades recorded" />
      </StatsGrid>

      <div className="rounded-md border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 px-8 py-16 flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800/50">
          <span className="text-zinc-500 text-lg">📊</span>
        </div>
        <div>
          <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">Ready to start</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            Create a new class and configure your first lab with a Postman test collection to begin automated grading.
          </p>
        </div>
      </div>
    </div>
  );
}
