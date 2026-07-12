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
import { EvaluationDetailsDialog } from "@/features/evaluations/components/evaluation-details-dialog";
import { EvaluationStatusBadge } from "@/features/evaluations/components/evaluation-status-badge";
import { useLatestEvaluationsForSubmissions } from "@/features/evaluations/hooks/use-evaluations";
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
  const evaluationQueries = useLatestEvaluationsForSubmissions(
    submissionsQuery.data?.items.map((submission) => submission.id) ?? [],
  );
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
                    <TableHead className="font-semibold text-muted-foreground">Evaluation</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Score</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Completed</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Created</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Submitted</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Details</TableHead>
                    <TableHead className="text-right font-semibold text-muted-foreground">Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionsQuery.data.items.map((submission) => {
                    const evaluationQuery = evaluationQueries[submission.id];
                    const evaluation = evaluationQuery?.data;

                    return (
                      <TableRow
                        key={submission.id}
                        className="border-border/50 transition-colors hover:bg-zinc-800/45"
                      >
                        <TableCell className="font-medium text-foreground">
                          {submission.studentEmail}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {submission.attemptNo}
                        </TableCell>
                        <TableCell className="max-w-72 break-all whitespace-normal font-mono text-xs text-foreground/80">
                          {submission.projectFileName}
                        </TableCell>
                        <TableCell>
                          <SubmissionStatusBadge status={submission.status} />
                        </TableCell>
                        <TableCell>
                          {evaluationQuery?.isLoading ? (
                            <span className="text-xs text-muted-foreground">Loading</span>
                          ) : evaluation ? (
                            <div className="space-y-1">
                              <EvaluationStatusBadge status={evaluation.status} />
                              {evaluation.status === "error" && evaluation.errorCode ? (
                                <p className="font-mono text-[11px] text-red-300">
                                  {evaluation.errorCode}
                                </p>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Waiting</span>
                          )}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {evaluation?.score !== null && evaluation?.score !== undefined
                            ? `${evaluation.score} / ${evaluation.maxScore ?? "-"}`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTime(evaluation?.completedAt)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTime(submission.createdAt)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTime(submission.submittedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          {evaluation ? (
                            <EvaluationDetailsDialog evaluation={evaluation} />
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
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
                    );
                  })}
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
