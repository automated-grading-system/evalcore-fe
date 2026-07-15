"use client";

import { FlaskConicalIcon } from "lucide-react";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/layout/states";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassCard } from "@/features/classes/components/class-card";
import { useLecturerClasses } from "@/features/classes/hooks/use-classes";

export default function LecturerLabsPage() {
  const classesQuery = useLecturerClasses({ page: 1, pageSize: 20 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Course content"
        title="Labs"
        description="Choose a class to create labs, publish requirement assets, and manage deadlines."
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
              actionLabel="Manage labs"
            />
          ))}
        </div>
      ) : null}
      {classesQuery.data && classesQuery.data.items.length === 0 ? (
        <EmptyState
          title="No classes available"
          description="Create a class first; labs are managed within their class workspace."
          icon={<FlaskConicalIcon className="size-5" />}
        />
      ) : null}
    </div>
  );
}
