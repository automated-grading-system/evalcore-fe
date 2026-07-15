"use client";

import { Clock3Icon, LoaderCircleIcon, TrophyIcon } from "lucide-react";

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
import { EvaluationScoringModeBadge } from "@/features/evaluations/components/evaluation-scoring-mode-badge";
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
    <Card>
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

        {!evaluationQuery.isLoading &&
        !evaluationQuery.isError &&
        !evaluation ? (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/25 p-4 text-sm text-muted-foreground">
            <Clock3Icon className="size-4" /> Waiting for the evaluation worker
            to begin…
          </div>
        ) : null}

        {evaluation ? (
          <div className="space-y-5 rounded-xl border border-border bg-muted/25 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <EvaluationStatusBadge status={evaluation.status} />
                  <EvaluationScoringModeBadge
                    scoringMode={evaluation.scoringMode}
                  />
                  {evaluation.status === "running" ? (
                    <LoaderCircleIcon className="size-4 animate-spin text-info" />
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">
                  {evaluationMessage(evaluation)}
                </p>
              </div>
              {evaluation.score !== null && evaluation.score !== undefined ? (
                <div className="flex min-w-32 items-center justify-end gap-3 rounded-xl border border-border bg-card px-4 py-3 text-right shadow-sm">
                  <TrophyIcon className="size-5 text-warning" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Score
                    </p>
                    <p className="mt-0.5 text-xl font-bold tracking-tight text-foreground">
                      {evaluation.score}
                      <span className="text-sm font-medium text-muted-foreground">
                        {" "}
                        / {evaluation.maxScore ?? "—"}
                      </span>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            {evaluation.status === "error" &&
            (evaluation.errorCode || evaluation.errorMessage) ? (
              <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
                {evaluation.errorCode ? (
                  <p className="font-mono text-xs font-semibold">
                    {evaluation.errorCode}
                  </p>
                ) : null}
                {evaluation.errorMessage ? (
                  <p>{evaluation.errorMessage}</p>
                ) : null}
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
