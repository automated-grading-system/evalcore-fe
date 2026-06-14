import { PageHeader, StatsGrid, StatCard } from "@/components/layout/dashboard-shell";

// ============================================================
// Student Dashboard Home
// ============================================================

export default function StudentDashboardPage() {
  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <PageHeader
        title="Overview"
        description="Your academic progress and recent evaluations."
      />

      <StatsGrid>
        <StatCard label="Joined Classes" value="—" note="No active classes" />
        <StatCard label="Pending Labs" value="—" note="All caught up" />
        <StatCard label="Latest Submission" value="—" note="No submissions yet" />
        <StatCard label="Latest Score" value="—" note="Awaiting grades" />
      </StatsGrid>

      <div className="rounded-md border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 px-8 py-16 flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800/50">
          <span className="text-zinc-500 text-lg">📚</span>
        </div>
        <div>
          <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100">No activity to report</h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
            Join a class using the search tab to start participating in labs and submitting your ASP.NET projects.
          </p>
        </div>
      </div>
    </div>
  );
}
