"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassEmptyState } from "@/features/classes/components/class-empty-state";
import { ClassTable } from "@/features/classes/components/class-table";
import { useLecturerClasses } from "@/features/classes/hooks/use-classes";

export default function LecturerClassesPage() {
  const classesQuery = useLecturerClasses({ page: 1, pageSize: 20 });

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Classes"
        description="Create and manage classes before assigning lab requirements and Postman collections."
      >
        <Button asChild>
          <Link href="/lecturer/classes/new">
            <PlusIcon className="size-4" />
            New class
          </Link>
        </Button>
      </PageHeader>

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
          getHref={(classItem) => `/lecturer/classes/${classItem.id}`}
        />
      )}

      {classesQuery.data && classesQuery.data.items.length === 0 && (
        <ClassEmptyState
          title="No classes yet"
          description="Create a class to enroll students and publish lab assets through MinIO presigned uploads."
          actionHref="/lecturer/classes/new"
          actionLabel="Create class"
        />
      )}
    </div>
  );
}
