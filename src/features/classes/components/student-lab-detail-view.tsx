"use client";

import { useState } from "react";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatDateTime,
} from "@/features/classes/components/formatters";
import { LabStatusBadge } from "@/features/classes/components/lab-status-badge";
import {
  useLabDetail,
  useRequirementUrl,
} from "@/features/classes/hooks/use-classes";
import { StudentSubmissionPanel } from "@/features/submissions/components/student-submission-panel";
import {
  getApiErrorMessage,
  isApiClientError,
} from "@/lib/api/errors";

interface StudentLabDetailViewProps {
  labId: string;
}

function openPresignedUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function isRestrictedLabError(error: unknown): boolean {
  return (
    isApiClientError(error) &&
    ["LAB_NOT_ACTIVE", "LAB_ACCESS_DENIED", "FORBIDDEN"].includes(error.code)
  );
}

export function StudentLabDetailView({ labId }: StudentLabDetailViewProps) {
  const labQuery = useLabDetail(labId);
  const requirementUrlMutation = useRequirementUrl();
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

  if (labQuery.isLoading) {
    return (
      <div className="flex max-w-5xl flex-col gap-6">
        <Skeleton className="h-24 bg-zinc-900" />
        <Skeleton className="h-64 bg-zinc-900" />
      </div>
    );
  }

  if (labQuery.isError) {
    if (isRestrictedLabError(labQuery.error)) {
      return (
        <div className="max-w-4xl">
          <PageHeader
            title="Lab restricted"
            description={getApiErrorMessage(labQuery.error)}
          />
          <Card className="border-border/60 bg-card/60 shadow-sm">
            <CardContent className="p-5 text-sm leading-relaxed text-muted-foreground">
              Your account cannot access this lab right now. Open the joined
              class page to see active labs available to you.
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-4xl">
        <ApiErrorAlert error={labQuery.error} />
      </div>
    );
  }

  if (!labQuery.data) return null;

  const lab = labQuery.data;
  const isActive = lab.status === "active";

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title={lab.title}
        description={lab.description ?? "Download the lab requirement PDF."}
      />

      {assetError ? (
        <ApiErrorAlert
          error={assetError}
          title="Requirement request failed"
        />
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
              Requirement
            </p>
            <p className="mt-1 text-sm text-foreground font-medium">
              {isActive ? "Available" : "Not active yet"}
            </p>
          </div>
        </CardContent>
      </Card>

      {!isActive && (
        <Card className="border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-5 text-sm text-amber-200">
            This lab is not active yet.
          </CardContent>
        </Card>
      )}

      <div>
        <Button
          type="button"
          variant="outline"
          disabled={!isActive || requirementUrlMutation.isPending}
          onClick={handleRequirementDownload}
        >
          <DownloadIcon className="size-4" />
          Download requirement PDF
        </Button>
      </div>

      <StudentSubmissionPanel labId={labId} disabled={!isActive} />
    </div>
  );
}
