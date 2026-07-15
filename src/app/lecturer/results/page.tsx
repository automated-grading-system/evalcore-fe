"use client";

import { ChartNoAxesColumnIcon } from "lucide-react";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/layout/states";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassCard } from "@/features/classes/components/class-card";
import { useLecturerClasses } from "@/features/classes/hooks/use-classes";

export default function LecturerResultsPage() {
  const classesQuery = useLecturerClasses({ page: 1, pageSize: 20 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Evaluation"
        title="Results"
        description="Choose a class, open a lab, and review the latest real evaluation for each submitted project."
      />
      {classesQuery.isLoading ? (
        <div className="grid gap-3 lg:grid-cols-2">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : null}
      {classesQuery.isError ? (
        <ApiErrorAlert error={classesQuery.error} />
      ) : null}
      {classesQuery.data?.items.length ? (
        <div className="grid gap-3 lg:grid-cols-2">
          {classesQuery.data.items.map((item) => (
            <ClassCard
              key={item.id}
              classItem={item}
              href={`/lecturer/classes/${item.id}`}
              actionLabel="Choose lab"
            />
          ))}
        </div>
      ) : null}
      {classesQuery.data && classesQuery.data.items.length === 0 ? (
        <EmptyState
          title="No results to review"
          description="Create a class and publish a lab before student evaluations can appear."
          icon={<ChartNoAxesColumnIcon className="size-5" />}
        />
      ) : null}
    </div>
  );
}
