"use client";

import Link from "next/link";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
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
import { EvaluationStatusBadge } from "@/features/evaluations/components/evaluation-status-badge";
import { useLatestEvaluationsForSubmissions } from "@/features/evaluations/hooks/use-evaluations";
import { SubmissionStatusBadge } from "@/features/submissions/components/submission-status-badge";
import { useMySubmissions } from "@/features/submissions/hooks/use-submissions";

export function StudentSubmissionsView() {
  const submissionsQuery = useMySubmissions({ page: 1, pageSize: 20 });
  const evaluationQueries = useLatestEvaluationsForSubmissions(
    submissionsQuery.data?.items.map((submission) => submission.id) ?? [],
  );

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Submissions"
        description="History of your project ZIP submissions."
      />

      {submissionsQuery.isLoading ? (
        <Skeleton className="h-72 bg-zinc-900" />
      ) : null}

      {submissionsQuery.isError ? (
        <ApiErrorAlert error={submissionsQuery.error} />
      ) : null}

      {submissionsQuery.data ? (
        <Card className="border-border/60 bg-card/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold tracking-tight">Recent submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissionsQuery.data.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-border/80 bg-zinc-950/20 hover:bg-transparent">
                    <TableHead className="font-semibold text-muted-foreground">File</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Attempt</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Evaluation</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Score</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Submitted</TableHead>
                    <TableHead className="font-semibold text-muted-foreground">Updated</TableHead>
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
                        <TableCell className="max-w-72 whitespace-normal">
                          <Link
                            href={`/student/submissions/${submission.id}`}
                            className="break-all text-sm font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {submission.projectFileName}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {submission.attemptNo}
                        </TableCell>
                        <TableCell>
                          <SubmissionStatusBadge status={submission.status} />
                        </TableCell>
                        <TableCell>
                          {evaluationQuery?.isLoading ? (
                            <span className="text-xs text-muted-foreground">Loading</span>
                          ) : evaluation ? (
                            <EvaluationStatusBadge status={evaluation.status} />
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
                          {formatDateTime(submission.submittedAt)}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatDateTime(submission.updatedAt)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="rounded-xl border border-border/50 bg-zinc-950/30 p-6 text-sm text-muted-foreground text-center">
                You have not submitted any project ZIP files yet.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
