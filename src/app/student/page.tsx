"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  SearchIcon,
  UploadCloudIcon,
} from "lucide-react";
import Link from "next/link";

import {
  PageHeader,
  SectionHeader,
  StatCard,
  StatsGrid,
} from "@/components/layout/dashboard-shell";
import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassCard } from "@/features/classes/components/class-card";
import { ClassEmptyState } from "@/features/classes/components/class-empty-state";
import { useMyClasses } from "@/features/classes/hooks/use-classes";
import { useLatestEvaluationForSubmission } from "@/features/evaluations/hooks/use-evaluations";
import { EvaluationStatusBadge } from "@/features/evaluations/components/evaluation-status-badge";
import { useMySubmissions } from "@/features/submissions/hooks/use-submissions";
import { useAuth } from "@/lib/auth/auth-context";

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const classesQuery = useMyClasses({ page: 1, pageSize: 4 });
  const submissionsQuery = useMySubmissions({ page: 1, pageSize: 1 });
  const latestSubmission = submissionsQuery.data?.items[0];
  const evaluationQuery = useLatestEvaluationForSubmission(
    latestSubmission?.id ?? "",
    { enabled: Boolean(latestSubmission) },
  );
  const evaluation = evaluationQuery.data;
  const firstName = user?.fullName.split(/\s+/)[0] ?? "there";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Student workspace"
        title={`Welcome back, ${firstName}`}
        description="Open your classes, submit project work, and follow evaluation progress from one place."
      >
        <Button asChild>
          <Link href="/student/classes/search">
            <SearchIcon />
            Find a class
          </Link>
        </Button>
      </PageHeader>

      <StatsGrid>
        <StatCard
          label="Joined classes"
          value={
            classesQuery.isLoading ? "…" : (classesQuery.data?.totalItems ?? 0)
          }
          note="Your current enrollments"
          icon={<BookOpenIcon className="size-4" />}
        />
        <StatCard
          label="Submissions"
          value={
            submissionsQuery.isLoading
              ? "…"
              : (submissionsQuery.data?.totalItems ?? 0)
          }
          note="Completed upload attempts"
          icon={<UploadCloudIcon className="size-4" />}
        />
        <div className="surface-panel flex min-h-32 flex-col justify-between p-5 sm:col-span-2 xl:col-span-2">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Latest evaluation
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              {evaluationQuery.isLoading ? (
                <Skeleton className="h-6 w-28" />
              ) : evaluation ? (
                <EvaluationStatusBadge status={evaluation.status} />
              ) : (
                <p className="text-lg font-bold">No result yet</p>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {latestSubmission
                  ? "From your most recent submission"
                  : "Submit a lab project to begin"}
              </p>
            </div>
            {evaluation?.score != null ? (
              <p className="text-3xl font-bold tracking-tight">
                {evaluation.score}
                <span className="text-base font-medium text-muted-foreground">
                  {" "}
                  / {evaluation.maxScore ?? "—"}
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </StatsGrid>

      {classesQuery.isError || submissionsQuery.isError ? (
        <ApiErrorAlert error={classesQuery.error ?? submissionsQuery.error} />
      ) : null}

      <section className="space-y-4">
        <SectionHeader
          title="Recent classes"
          description="Continue where you left off."
        >
          <Button asChild variant="ghost" size="sm">
            <Link href="/student/classes">
              View all <ArrowRightIcon />
            </Link>
          </Button>
        </SectionHeader>
        {classesQuery.isLoading ? (
          <div className="grid gap-3 lg:grid-cols-2">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        ) : null}
        {classesQuery.data?.items.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {classesQuery.data.items.map((item) => (
              <ClassCard
                key={item.id}
                classItem={item}
                href={`/student/classes/${item.id}`}
              />
            ))}
          </div>
        ) : null}
        {classesQuery.data && classesQuery.data.items.length === 0 ? (
          <ClassEmptyState
            title="No joined classes"
            description="Find a lecturer class and join it to access active labs."
            actionHref="/student/classes/search"
            actionLabel="Find a class"
          />
        ) : null}
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Quick actions"
          description="The most common student workflows."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Card className="group">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-bold">Browse classes</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Open labs and requirements.
                </p>
              </div>
              <Button asChild variant="outline" size="icon">
                <Link href="/student/classes" aria-label="Browse classes">
                  <ArrowRightIcon />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card className="group">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-bold">Review submissions</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  See attempts and results.
                </p>
              </div>
              <Button asChild variant="outline" size="icon">
                <Link
                  href="/student/submissions"
                  aria-label="Review submissions"
                >
                  <ArrowRightIcon />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
