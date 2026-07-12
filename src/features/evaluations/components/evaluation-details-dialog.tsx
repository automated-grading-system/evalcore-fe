"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/features/classes/components/formatters";
import { EvaluationReportButton } from "@/features/evaluations/components/evaluation-report-button";
import { EvaluationStatusBadge } from "@/features/evaluations/components/evaluation-status-badge";
import type { EvaluationDto } from "@/types/evaluation";

interface EvaluationDetailsDialogProps {
  evaluation: EvaluationDto;
}

export function EvaluationDetailsDialog({
  evaluation,
}: EvaluationDetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          View details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-2xl overflow-y-auto p-5 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Evaluation details</DialogTitle>
          <DialogDescription>
            Attempt {evaluation.attemptNo} completed {formatDateTime(evaluation.completedAt)}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-3">
          <EvaluationStatusBadge status={evaluation.status} />
          {evaluation.score !== null && evaluation.score !== undefined ? (
            <span className="text-sm font-semibold text-foreground">
              Score: {evaluation.score} / {evaluation.maxScore ?? "-"}
            </span>
          ) : null}
        </div>

        {evaluation.errorCode || evaluation.errorMessage ? (
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-200">
            {evaluation.errorCode ? (
              <p className="font-mono text-xs font-semibold">
                {evaluation.errorCode}
              </p>
            ) : null}
            {evaluation.errorMessage ? <p>{evaluation.errorMessage}</p> : null}
          </div>
        ) : null}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Evaluation steps</h3>
          {evaluation.steps.length > 0 ? (
            <div className="space-y-2">
              {evaluation.steps.map((step) => (
                <div
                  key={step.id}
                  className="rounded-lg border border-border/60 bg-muted/20 p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium text-foreground">
                      {step.stepName.replaceAll("_", " ")}
                    </p>
                    <EvaluationStatusBadge status={step.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDateTime(step.completedAt ?? step.startedAt)}
                    {step.exitCode !== null && step.exitCode !== undefined
                      ? ` · Exit code ${step.exitCode}`
                      : ""}
                  </p>
                  {step.log ? (
                    <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap rounded-md bg-zinc-950/60 p-2 text-xs leading-relaxed text-zinc-300">
                      {step.log}
                    </pre>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Step details are not available yet.
            </p>
          )}
        </div>

        <DialogFooter showCloseButton>
          {evaluation.reportObjectKey ? (
            <EvaluationReportButton evaluationId={evaluation.id} />
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
