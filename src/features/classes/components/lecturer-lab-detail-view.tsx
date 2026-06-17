"use client";

import { useState } from "react";
import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatDateTime,
} from "@/features/classes/components/formatters";
import { LabStatusBadge } from "@/features/classes/components/lab-status-badge";
import {
  useCollectionUrl,
  useLabDetail,
  useRequirementUrl,
} from "@/features/classes/hooks/use-classes";
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
        <Skeleton className="h-24 bg-zinc-900" />
        <Skeleton className="h-72 bg-zinc-900" />
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

      <Card className="border-zinc-800/70 bg-zinc-900/35">
        <CardContent className="grid gap-5 p-5 sm:grid-cols-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Status
            </p>
            <div className="mt-2">
              <LabStatusBadge status={lab.status} />
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Deadline
            </p>
            <p className="mt-1 text-sm text-zinc-200">
              {formatDateTime(lab.deadline)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Assets completed
            </p>
            <p className="mt-1 text-sm text-zinc-200">
              {formatDateTime(lab.assetsCompletedAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800/70 bg-zinc-900/35">
        <CardHeader>
          <CardTitle>Lab assets</CardTitle>
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

      <Card className="border-zinc-800/70 bg-zinc-950/45">
        <CardHeader>
          <CardTitle>Technical object keys</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Requirement
            </p>
            <p className="mt-1 break-all font-mono text-xs text-zinc-300">
              {lab.requirementObjectKey}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
              Collection
            </p>
            <p className="mt-1 break-all font-mono text-xs text-zinc-300">
              {lab.collectionObjectKey}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
