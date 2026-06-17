"use client";

import Link from "next/link";
import { SearchIcon } from "lucide-react";

import {
  PageHeader,
  StatCard,
  StatsGrid,
} from "@/components/layout/dashboard-shell";
import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassCard } from "@/features/classes/components/class-card";
import { ClassEmptyState } from "@/features/classes/components/class-empty-state";
import { useMyClasses } from "@/features/classes/hooks/use-classes";

export default function StudentDashboardPage() {
  const classesQuery = useMyClasses({ page: 1, pageSize: 4 });

  return (
    <div className="flex max-w-6xl flex-col gap-8">
      <PageHeader
        title="Overview"
        description="Track joined classes and active lab requirements."
      >
        <Button asChild>
          <Link href="/student/classes/search">
            <SearchIcon className="size-4" />
            Search classes
          </Link>
        </Button>
      </PageHeader>

      <StatsGrid>
        <StatCard
          label="Joined Classes"
          value={classesQuery.data?.totalItems ?? "—"}
          note={
            classesQuery.isLoading
              ? "Loading class data"
              : "From Class Service"
          }
        />
        <StatCard
          label="Active Labs"
          value="—"
          note="Open a class to view active labs"
        />
        <StatCard
          label="Latest Submission"
          value="—"
          note="Submission Service pending"
        />
        <StatCard
          label="Latest Score"
          value="—"
          note="Evaluation Service pending"
        />
      </StatsGrid>

      {classesQuery.isError && <ApiErrorAlert error={classesQuery.error} />}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-medium text-zinc-100">
              Recent joined classes
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Your enrolled classes from the Gateway-backed Class Service.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/student/classes">View all</Link>
          </Button>
        </div>

        {classesQuery.isLoading && (
          <div className="grid gap-3">
            <Skeleton className="h-28 bg-zinc-900" />
            <Skeleton className="h-28 bg-zinc-900" />
          </div>
        )}

        {classesQuery.data && classesQuery.data.items.length > 0 && (
          <div className="grid gap-3">
            {classesQuery.data.items.map((classItem) => (
              <ClassCard
                key={classItem.id}
                classItem={classItem}
                href={`/student/classes/${classItem.id}`}
              />
            ))}
          </div>
        )}

        {classesQuery.data && classesQuery.data.items.length === 0 && (
          <ClassEmptyState
            title="No joined classes"
            description="Search for a lecturer class and join it before downloading lab requirements."
            actionHref="/student/classes/search"
            actionLabel="Search classes"
          />
        )}
      </section>
    </div>
  );
}
