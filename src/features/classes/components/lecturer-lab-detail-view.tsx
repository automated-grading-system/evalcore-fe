"use client";

import { useState } from "react";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/features/classes/components/formatters";
import { LabRubricEditor } from "@/features/classes/components/lab-rubric-editor";
import { LabStatusBadge } from "@/features/classes/components/lab-status-badge";
import {
  useCollectionUrl,
  useLabDetail,
  useRequirementUrl,
} from "@/features/classes/hooks/use-classes";
import { LecturerLabSubmissionsView } from "@/features/submissions/components/lecturer-lab-submissions-view";
import { getApiErrorMessage } from "@/lib/api/errors";

interface LecturerLabDetailViewProps {
  labId: string;
}

function openPresignedUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function LecturerLabDetailView({ labId }: LecturerLabDetailViewProps) {
  const labQuery = useLabDetail(labId);
  const requirementUrlMutation = useRequirementUrl();
  const collectionUrlMutation = useCollectionUrl();
  const [assetError, setAssetError] = useState<unknown>(null);

  async function handleRequirementDownload() {
    setAssetError(null);
    try {
      const response = await requirementUrlMutation.mutateAsync(labId);
      openPresignedUrl(response.url);
    } catch (error) {
      setAssetError(error);
      toast.error(getApiErrorMessage(error));
    }
  }

  async function handleCollectionDownload() {
    setAssetError(null);
    try {
      const response = await collectionUrlMutation.mutateAsync(labId);
      openPresignedUrl(response.url);
    } catch (error) {
      setAssetError(error);
      toast.error(getApiErrorMessage(error));
    }
  }

  if (labQuery.isLoading) {
    return (
      <div className="flex max-w-5xl flex-col gap-6">
        <Skeleton className="h-24" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (labQuery.isError) {
    return (
      <div className="max-w-4xl">
        <ApiErrorAlert error={labQuery.error} />
      </div>
    );
  }

  if (!labQuery.data) return null;

  const lab = labQuery.data;

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title={lab.title}
        description={lab.description ?? "No description provided for this lab."}
      />

      {assetError ? (
        <ApiErrorAlert error={assetError} title="Asset request failed" />
      ) : null}

      <Card className="border-border/60 bg-card/60 shadow-sm">
        <CardContent className="grid gap-5 p-5 sm:grid-cols-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Status
            </p>
            <div className="mt-2">
              <LabStatusBadge status={lab.status} />
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Deadline
            </p>
            <p className="mt-1 text-sm text-foreground font-medium">
              {formatDateTime(lab.deadline)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Assets completed
            </p>
            <p className="mt-1 text-sm text-foreground font-medium">
              {formatDateTime(lab.assetsCompletedAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-card/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Lab assets
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            disabled={requirementUrlMutation.isPending}
            onClick={handleRequirementDownload}
          >
            <DownloadIcon className="size-4" />
            Requirement PDF
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={collectionUrlMutation.isPending}
            onClick={handleCollectionDownload}
          >
            <DownloadIcon className="size-4" />
            Postman collection
          </Button>
        </CardContent>
      </Card>

      <LabRubricEditor labId={labId} />

      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Technical object keys
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Requirement
            </p>
            <p className="mt-1 break-all font-mono text-xs text-foreground/80 font-medium">
              {lab.requirementObjectKey}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Collection
            </p>
            <p className="mt-1 break-all font-mono text-xs text-foreground/80 font-medium">
              {lab.collectionObjectKey}
            </p>
          </div>
        </CardContent>
      </Card>

      <LecturerLabSubmissionsView labId={labId} />
    </div>
  );
}
