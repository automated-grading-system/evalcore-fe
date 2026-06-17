"use client";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassEmptyState } from "@/features/classes/components/class-empty-state";
import { ClassTable } from "@/features/classes/components/class-table";
import { useMyClasses } from "@/features/classes/hooks/use-classes";

export default function StudentClassesPage() {
  const classesQuery = useMyClasses({ page: 1, pageSize: 20 });

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="My Classes"
        description="Classes you have joined through the Class Service."
      />

      {classesQuery.isLoading && (
        <div className="grid gap-3">
          <Skeleton className="h-12 bg-zinc-900" />
          <Skeleton className="h-56 bg-zinc-900" />
        </div>
      )}

      {classesQuery.isError && <ApiErrorAlert error={classesQuery.error} />}

      {classesQuery.data && classesQuery.data.items.length > 0 && (
        <ClassTable
          classes={classesQuery.data.items}
          getHref={(classItem) => `/student/classes/${classItem.id}`}
        />
      )}

      {classesQuery.data && classesQuery.data.items.length === 0 && (
        <ClassEmptyState
          title="No joined classes"
          description="Search for a class by name and join it to see active labs."
          actionHref="/student/classes/search"
          actionLabel="Search classes"
        />
      )}
    </div>
  );
}
