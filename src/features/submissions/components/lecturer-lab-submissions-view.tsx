"use client";

import { RefreshCwIcon, DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/features/classes/components/formatters";
import { SubmissionStatusBadge } from "@/features/submissions/components/submission-status-badge";
import {
  useLabSubmissions,
  useSubmissionSourceUrl,
} from "@/features/submissions/hooks/use-submissions";
import { getApiErrorMessage } from "@/lib/api/errors";

interface LecturerLabSubmissionsViewProps {
  labId: string;
}

function openPresignedUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function LecturerLabSubmissionsView({
  labId,
}: LecturerLabSubmissionsViewProps) {
  const submissionsQuery = useLabSubmissions(labId, {
    page: 1,
    pageSize: 20,
  });
  const sourceUrlMutation = useSubmissionSourceUrl();

  async function handleDownload(submissionId: string) {
    try {
      const response = await sourceUrlMutation.mutateAsync(submissionId);
      openPresignedUrl(response.url);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Lab submissions"
        description="Review student project ZIP uploads for this lab."
      >
        {
          <Button
            type="button"
            variant="outline"
            disabled={submissionsQuery.isFetching}
            onClick={() => submissionsQuery.refetch()}
          >
            <RefreshCwIcon className="size-4" />
            Refresh
          </Button>
        }
      </PageHeader>

      {submissionsQuery.isLoading ? (
        <Skeleton className="h-72 bg-zinc-900" />
      ) : null}

      {submissionsQuery.isError ? (
        <ApiErrorAlert error={submissionsQuery.error} />
      ) : null}

      {sourceUrlMutation.isError ? (
        <ApiErrorAlert
          error={sourceUrlMutation.error}
          title="Source download failed"
        />
      ) : null}

      {submissionsQuery.data ? (
        <Card className="border-zinc-800/70 bg-zinc-900/35">
          <CardHeader>
            <CardTitle>
              Submissions ({submissionsQuery.data.totalItems})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissionsQuery.data.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead>Student</TableHead>
                    <TableHead>Attempt</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionsQuery.data.items.map((submission) => (
                    <TableRow
                      key={submission.id}
                      className="border-zinc-800 hover:bg-zinc-900/80"
                    >
                      <TableCell>{submission.studentEmail}</TableCell>
                      <TableCell>{submission.attemptNo}</TableCell>
                      <TableCell className="max-w-72 whitespace-normal break-all">
                        {submission.projectFileName}
                      </TableCell>
                      <TableCell>
                        <SubmissionStatusBadge status={submission.status} />
                      </TableCell>
                      <TableCell>
                        {formatDateTime(submission.createdAt)}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(submission.submittedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={
                            sourceUrlMutation.isPending ||
                            submission.status === "pending_assets"
                          }
                          onClick={() => handleDownload(submission.id)}
                        >
                          <DownloadIcon className="size-4" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="rounded-lg border border-zinc-800 bg-zinc-950/35 p-5 text-sm text-zinc-400">
                No student submissions have been completed for this lab yet.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
