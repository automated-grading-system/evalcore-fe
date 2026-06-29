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
        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight">
              Submissions ({submissionsQuery.data.totalItems})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {submissionsQuery.data.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/80 bg-zinc-950/20 hover:bg-transparent">
                    <TableHead className="font-semibold text-muted-foreground">Student</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Attempt</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">File</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Created</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Submitted</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionsQuery.data.items.map((submission) => (
                    <TableRow
                      key={submission.id}
                      className="border-border/50 hover:bg-zinc-800/45 transition-colors"
                    >
                      <TableCell className="text-foreground font-medium">{submission.studentEmail}</TableCell>
                      <TableCell className="text-foreground font-medium">{submission.attemptNo}</TableCell>
                      <TableCell className="max-w-72 whitespace-normal break-all font-mono text-xs text-foreground/80">
                        {submission.projectFileName}
                      </TableCell>
                      <TableCell>
                        <SubmissionStatusBadge status={submission.status} />
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatDateTime(submission.createdAt)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
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
              <p className="rounded-xl border border-border/50 bg-zinc-950/30 p-6 text-sm text-muted-foreground text-center">
                No student submissions have been completed for this lab yet.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
