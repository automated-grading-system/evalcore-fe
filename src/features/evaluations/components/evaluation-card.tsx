"use client";

import { LoaderCircleIcon } from "lucide-react";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/features/classes/components/formatters";
import { EvaluationDetailsDialog } from "@/features/evaluations/components/evaluation-details-dialog";
import { EvaluationReportButton } from "@/features/evaluations/components/evaluation-report-button";
import { EvaluationStatusBadge } from "@/features/evaluations/components/evaluation-status-badge";
import { useLatestEvaluationForSubmission } from "@/features/evaluations/hooks/use-evaluations";
import type { EvaluationDto } from "@/types/evaluation";

interface EvaluationCardProps {
  submissionId: string;
}

function evaluationMessage(evaluation: EvaluationDto): string {
  switch (evaluation.status) {
    case "queued":
      return "Your submission is waiting to be graded.";
    case "running":
      return "Evaluation is running in an isolated sandbox.";
    case "passed":
      return "Your submission passed evaluation.";
    case "failed":
      return "Evaluation completed, but one or more tests failed.";
    case "error":
      return "Evaluation could not finish because the grading infrastructure or submission package failed.";
    default:
      return "Evaluation status is being updated.";
  }
}

export function EvaluationCard({ submissionId }: EvaluationCardProps) {
  const evaluationQuery = useLatestEvaluationForSubmission(submissionId);
  const evaluation = evaluationQuery.data;

  return (
    <Card className="border-border/60 bg-card/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Evaluation
        </CardTitle>
        <CardDescription>
          Results update automatically while grading is in progress.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {evaluationQuery.isLoading ? <Skeleton className="h-24" /> : null}

        {evaluationQuery.isError ? (
          <ApiErrorAlert
            error={evaluationQuery.error}
            title="Evaluation status failed"
          />
        ) : null}

        {!evaluationQuery.isLoading && !evaluationQuery.isError && !evaluation ? (
          <p className="rounded-lg border border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
            Waiting for evaluation...
          </p>
        ) : null}

        {evaluation ? (
          <div className="space-y-4 rounded-xl border border-border/80 bg-zinc-950/30 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <EvaluationStatusBadge status={evaluation.status} />
                  {evaluation.status === "running" ? (
                    <LoaderCircleIcon className="size-4 animate-spin text-blue-300" />
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {evaluationMessage(evaluation)}
                </p>
              </div>
              {evaluation.score !== null && evaluation.score !== undefined ? (
                <div className="text-right">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    Score
                  </p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {evaluation.score} / {evaluation.maxScore ?? "-"}
                  </p>
                </div>
              ) : null}
            </div>

            {evaluation.status === "error" &&
            (evaluation.errorCode || evaluation.errorMessage) ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-200">
                {evaluation.errorCode ? (
                  <p className="font-mono text-xs font-semibold">
                    {evaluation.errorCode}
                  </p>
                ) : null}
                {evaluation.errorMessage ? <p>{evaluation.errorMessage}</p> : null}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <p className="text-muted-foreground">
                Completed: {formatDateTime(evaluation.completedAt)}
              </p>
              <div className="flex flex-wrap gap-2">
                <EvaluationDetailsDialog evaluation={evaluation} />
                {evaluation.reportObjectKey ? (
                  <EvaluationReportButton evaluationId={evaluation.id} />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
