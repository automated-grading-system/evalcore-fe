"use client";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassEmptyState } from "@/features/classes/components/class-empty-state";
import { LabCard } from "@/features/classes/components/lab-card";
import {
  formatDateTime,
} from "@/features/classes/components/formatters";
import {
  useClassDetail,
  useClassLabs,
} from "@/features/classes/hooks/use-classes";

interface StudentClassDetailViewProps {
  classId: string;
}

export function StudentClassDetailView({
  classId,
}: StudentClassDetailViewProps) {
  const classQuery = useClassDetail(classId);
  const labsQuery = useClassLabs(classId, { page: 1, pageSize: 50 });

  if (classQuery.isLoading) {
    return (
      <div className="flex max-w-6xl flex-col gap-6">
        <Skeleton className="h-24 bg-zinc-900" />
        <Skeleton className="h-72 bg-zinc-900" />
      </div>
    );
  }

  if (classQuery.isError) {
    return (
      <div className="max-w-4xl">
        <ApiErrorAlert error={classQuery.error} />
      </div>
    );
  }

  if (!classQuery.data) return null;

  const activeLabs =
    labsQuery.data?.items.filter((lab) => lab.status === "active") ?? [];

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <PageHeader
        title={classQuery.data.name}
        description={
          classQuery.data.description ??
          "Active lab requirements for this joined class."
        }
      />

      <div className="rounded-lg border border-zinc-800/70 bg-zinc-900/35 p-5">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
          Last updated
        </p>
        <p className="mt-1 text-sm text-zinc-200">
          {formatDateTime(classQuery.data.updatedAt)}
        </p>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-base font-medium text-zinc-100">Active labs</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Only active labs are shown to students.
          </p>
        </div>

        {labsQuery.isLoading && (
          <div className="grid gap-3">
            <Skeleton className="h-28 bg-zinc-900" />
            <Skeleton className="h-28 bg-zinc-900" />
          </div>
        )}
        {labsQuery.isError && <ApiErrorAlert error={labsQuery.error} />}
        {labsQuery.data && activeLabs.length > 0 && (
          <div className="grid gap-3">
            {activeLabs.map((lab) => (
              <LabCard
                key={lab.id}
                lab={lab}
                href={`/student/labs/${lab.id}`}
                actionLabel="View requirement"
              />
            ))}
          </div>
        )}
        {labsQuery.data && activeLabs.length === 0 && (
          <ClassEmptyState
            title="No active labs"
            description="This class has no active labs ready for students yet."
          />
        )}
      </section>
    </div>
  );
}
