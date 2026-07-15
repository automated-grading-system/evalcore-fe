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
import {
  CheckCircle2Icon,
  CircleDotIcon,
  Clock3Icon,
  TerminalSquareIcon,
} from "lucide-react";
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
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-3xl overflow-y-auto p-5 sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Evaluation details</DialogTitle>
          <DialogDescription>
            Attempt {evaluation.attemptNo} completed{" "}
            {formatDateTime(evaluation.completedAt)}.
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
          <div className="rounded-lg border border-destructive/25 bg-destructive/5 p-3 text-sm text-destructive">
            {evaluation.errorCode ? (
              <p className="font-mono text-xs font-semibold">
                {evaluation.errorCode}
              </p>
            ) : null}
            {evaluation.errorMessage ? <p>{evaluation.errorMessage}</p> : null}
          </div>
        ) : null}

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Evaluation steps
          </h3>
          {evaluation.steps.length > 0 ? (
            <div className="relative space-y-0 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-border">
              {evaluation.steps.map((step, index) => (
                <div
                  key={step.id}
                  className="relative flex gap-3 pb-4 last:pb-0"
                >
                  <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm">
                    {step.status === "passed" ? (
                      <CheckCircle2Icon className="size-4 text-success" />
                    ) : step.status === "running" ? (
                      <Clock3Icon className="size-4 animate-pulse text-info" />
                    ) : (
                      <CircleDotIcon className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1 rounded-xl border border-border bg-muted/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold capitalize text-foreground">
                        <span className="mr-2 text-xs text-muted-foreground">
                          {String(index + 1).padStart(2, "0")}
                        </span>
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
                      <div className="mt-3 overflow-hidden rounded-lg border border-slate-800 bg-slate-950">
                        <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2 text-[11px] font-semibold text-slate-400">
                          <TerminalSquareIcon className="size-3.5" /> Step log
                        </div>
                        <pre className="max-h-52 overflow-auto whitespace-pre-wrap p-3 font-mono text-xs leading-relaxed text-slate-300">
                          {step.log}
                        </pre>
                      </div>
                    ) : null}
                  </div>
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
