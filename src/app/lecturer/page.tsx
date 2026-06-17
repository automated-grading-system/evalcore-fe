"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

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
import { useLecturerClasses } from "@/features/classes/hooks/use-classes";

export default function LecturerDashboardPage() {
  const classesQuery = useLecturerClasses({ page: 1, pageSize: 4 });

  return (
    <div className="flex max-w-6xl flex-col gap-8">
      <PageHeader
        title="Overview"
        description="Manage classes and lab assets for automated ASP.NET project evaluation."
      >
        <Button asChild>
          <Link href="/lecturer/classes/new">
            <PlusIcon className="size-4" />
            New class
          </Link>
        </Button>
      </PageHeader>

      <StatsGrid>
        <StatCard
          label="Classes"
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
          note="Open a class to inspect labs"
        />
        <StatCard
          label="Pending Assets"
          value="—"
          note="Tracked per class"
        />
        <StatCard
          label="Submission Queue"
          value="—"
          note="Submission Service pending"
        />
      </StatsGrid>

      {classesQuery.isError && <ApiErrorAlert error={classesQuery.error} />}

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-medium text-zinc-100">
              Recent classes
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Classes returned by the Gateway-backed Class Service.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href="/lecturer/classes">View all</Link>
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
                href={`/lecturer/classes/${classItem.id}`}
              />
            ))}
          </div>
        )}

        {classesQuery.data && classesQuery.data.items.length === 0 && (
          <ClassEmptyState
            title="No classes yet"
            description="Create a class before assigning labs or enrolling students."
            actionHref="/lecturer/classes/new"
            actionLabel="Create class"
          />
        )}
      </section>
    </div>
  );
}
