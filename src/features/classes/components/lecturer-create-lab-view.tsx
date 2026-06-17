"use client";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { LabAssetUploadForm } from "@/features/classes/components/lab-asset-upload-form";
import { useClassDetail } from "@/features/classes/hooks/use-classes";

interface LecturerCreateLabViewProps {
  classId: string;
}

export function LecturerCreateLabView({
  classId,
}: LecturerCreateLabViewProps) {
  const classQuery = useClassDetail(classId);

  if (classQuery.isLoading) {
    return (
      <div className="max-w-4xl">
        <Skeleton className="h-24 bg-zinc-900" />
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

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="New lab"
        description={`Create lab metadata and upload assets for ${classQuery.data.name}.`}
      />
      <LabAssetUploadForm classId={classId} />
    </div>
  );
}
