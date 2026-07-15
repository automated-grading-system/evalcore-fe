"use client";

import {
  ActivityIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  Clock3Icon,
  InfoIcon,
  Layers3Icon,
  ListChecksIcon,
  LoaderCircleIcon,
  RefreshCwIcon,
  ServerCogIcon,
  TerminalSquareIcon,
  TimerIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useState, type ReactNode } from "react";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import {
  isEvaluationActive,
  useEvaluationMonitorOverview,
  useEvaluationMonitorRecent,
  useEvaluationMonitorSteps,
} from "@/features/evaluations/hooks/use-evaluations";
import { cn } from "@/lib/utils";
import type {
  EvaluationMonitorFilters,
  EvaluationMonitorOverviewDto,
  EvaluationMonitorRecentItemDto,
  EvaluationStepDto,
} from "@/types/evaluation";

const RECENT_LIMIT = 30;
const MAX_VISUAL_RUNNER_SLOTS = 12;

interface LiveGradingMonitorViewProps {
  filters: EvaluationMonitorFilters;
}

type StatTone = "neutral" | "info" | "success" | "warning" | "danger";

const STAT_TONE_CLASSES: Record<StatTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  danger: "bg-destructive/10 text-destructive",
};

function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "Unavailable";
  }

  return new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(
    value,
  );
}

function formatCount(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(
    value,
  );
}

function formatNullableDate(value: string | null | undefined): string {
  return value ? formatDateTime(value) : "Unavailable";
}

function formatDuration(
  startedAt: string | null,
  completedAt: string | null,
): string {
  if (!startedAt) return "—";

  const start = new Date(startedAt).getTime();
  const end = completedAt ? new Date(completedAt).getTime() : Date.now();
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return "Unavailable";
  }

  const totalSeconds = Math.floor((end - start) / 1_000);
  if (totalSeconds < 60) return `${totalSeconds}s`;

  const totalMinutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (totalMinutes < 60) return `${totalMinutes}m ${seconds}s`;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function formatStepName(value: string | null | undefined): string {
  if (!value) return "No active step";
  return value.replaceAll("_", " ").replaceAll("-", " ");
}

function explainEvaluationError(errorCode: string | null | undefined) {
  if (errorCode === "APP_READINESS_FAILED") {
    return "The submitted app did not become healthy before the timeout. This usually means the app failed to start or its dependencies were not ready.";
  }

  return null;
}

function shortId(value: string): string {
  return value.length > 16 ? `${value.slice(0, 8)}…${value.slice(-4)}` : value;
}

function MonitorStatCard({
  label,
  value,
  note,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: number | string | null | undefined;
  note: string;
  icon: ReactNode;
  tone?: StatTone;
}) {
  return (
    <div className="flex min-h-32 flex-col justify-between rounded-xl border border-border/80 bg-card p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors duration-300">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-bold uppercase tracking-[0.11em] text-muted-foreground">
          {label}
        </p>
        <span
          className={cn(
            "flex size-8 items-center justify-center rounded-lg",
            STAT_TONE_CLASSES[tone],
          )}
        >
          {icon}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold tracking-[-0.035em] text-foreground tabular-nums">
          {typeof value === "number" ? formatCount(value) : (value ?? "—")}
        </p>
        <p className="mt-1.5 text-xs leading-4 text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}

function ScopeBadge({ label, value }: { label: string; value: string }) {
  return (
    <Badge variant="outline" className="max-w-full gap-1.5 bg-card px-2.5 py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="truncate font-mono" title={value}>
        {value}
      </span>
    </Badge>
  );
}

function DemoNarrativeHero({
  filters,
  overview,
  hasActiveWork,
  hasMonitorError,
}: {
  filters: EvaluationMonitorFilters;
  overview: EvaluationMonitorOverviewDto | undefined;
  hasActiveWork: boolean;
  hasMonitorError: boolean;
}) {
  const scopeIsFiltered = Boolean(filters.classId || filters.labId);
  const failureTotal = overview ? overview.failed + overview.error : undefined;
  const capacityValue = overview
    ? overview.runnerConcurrency === null
      ? formatCount(overview.activeSlots)
      : `${formatCount(overview.activeSlots)} / ${formatCount(overview.runnerConcurrency)}`
    : "—";
  const capacityStatement = overview
    ? overview.runnerConcurrency === null
      ? `${formatCount(overview.activeSlots)} runner ${overview.activeSlots === 1 ? "slot is" : "slots are"} active now; the configured limit is unavailable.`
      : `Only ${formatCount(overview.runnerConcurrency)} evaluations run at once.`
    : "Loading the configured runner capacity…";

  return (
    <section className="overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-[0_12px_36px_rgba(15,23,42,0.06)]">
      <div className="h-1 bg-primary" />
      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.55fr)] lg:items-end lg:p-8">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-2 px-2.5 py-1">
              <span
                className="relative flex size-1.5 text-info"
                aria-hidden="true"
              >
                {hasActiveWork && !hasMonitorError ? (
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-50 motion-reduce:animate-none" />
                ) : null}
                <span className="relative inline-flex size-1.5 rounded-full bg-current" />
              </span>
              {hasMonitorError
                ? "Monitor error · polling reduced"
                : !overview
                  ? "Connecting · loading live data"
                  : hasActiveWork
                    ? "Live · refreshes every 1s"
                    : "Settled · checks every 10s"}
            </Badge>
            {overview && overview.total > 0 ? (
              <Badge variant="success" className="px-2.5 py-1">
                Burst accepted
              </Badge>
            ) : null}
          </div>
          <h2 className="mt-5 max-w-3xl text-pretty text-2xl font-bold tracking-[-0.035em] text-foreground sm:text-3xl">
            From burst submission to controlled execution
          </h2>
          <p className="mt-3 max-w-3xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
            EvalCore accepts submissions immediately, puts evaluations into a
            waiting room, and runs only a controlled number of isolated Docker
            sandboxes at once.
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/80">
            For the demo script, each generated student submits one real ZIP.
            The live count below reports submissions, not a derived unique
            student count.
          </p>
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">
            <ServerCogIcon className="size-4" /> Controlled concurrency
          </p>
          <p className="mt-3 text-xl font-bold tracking-tight text-foreground">
            {capacityStatement}
          </p>
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            RabbitMQ absorbs the burst while the Evaluation DB keeps accepted
            work visible in the waiting room.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border/70 bg-muted/25 px-5 py-3 sm:px-6 lg:px-8">
        {filters.classId ? (
          <ScopeBadge label="Class" value={filters.classId} />
        ) : null}
        {filters.labId ? (
          <ScopeBadge label="Lab" value={filters.labId} />
        ) : null}
        {!scopeIsFiltered ? (
          <Badge variant="outline" className="bg-card px-2.5 py-1">
            All managed classes
          </Badge>
        ) : null}
        <span className="ml-auto hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
          <InfoIcon className="size-3.5" /> Real evaluation records
        </span>
      </div>

      <div className="grid gap-3 border-t border-border/70 bg-muted/25 p-3 sm:grid-cols-2 lg:grid-cols-4 lg:p-4 2xl:grid-cols-7">
        <MonitorStatCard
          label="Submissions accepted"
          value={overview?.total}
          note={
            !overview
              ? "Loading real submissions"
              : overview.total > 0
                ? "Burst accepted"
                : "Waiting for the first submission"
          }
          icon={<Layers3Icon className="size-4" />}
        />
        <MonitorStatCard
          label="Waiting room"
          value={overview?.queued}
          note="Persisted and ready for a runner"
          icon={<Clock3Icon className="size-4" />}
          tone="info"
        />
        <MonitorStatCard
          label="Running now"
          value={overview?.running}
          note="Evaluations in this monitor scope"
          icon={
            <LoaderCircleIcon
              className={cn(
                "size-4",
                overview?.running && "animate-spin motion-reduce:animate-none",
              )}
            />
          }
          tone="info"
        />
        <MonitorStatCard
          label="Active runner slots"
          value={capacityValue}
          note={
            !overview
              ? "Loading runner capacity"
              : overview.runnerConcurrency === null
                ? "Global slots active now"
                : "Global occupancy / capacity"
          }
          icon={<ServerCogIcon className="size-4" />}
          tone="info"
        />
        <MonitorStatCard
          label="Completed"
          value={overview?.terminal}
          note="All terminal evaluations"
          icon={<ListChecksIcon className="size-4" />}
        />
        <MonitorStatCard
          label="Passed"
          value={overview?.passed}
          note="Completed successfully"
          icon={<CheckCircle2Icon className="size-4" />}
          tone="success"
        />
        <MonitorStatCard
          label="Failed / error"
          value={failureTotal}
          note={
            overview
              ? `${formatCount(overview.failed)} failed · ${formatCount(overview.error)} error`
              : "Failures remain visible"
          }
          icon={<TriangleAlertIcon className="size-4" />}
          tone={failureTotal ? "danger" : "neutral"}
        />
      </div>
    </section>
  );
}

function RunnerSlots({
  overview,
}: {
  overview: EvaluationMonitorOverviewDto | undefined;
}) {
  const activeSlots = overview?.activeSlots;
  const concurrency = overview?.runnerConcurrency;
  const safeConcurrency =
    concurrency === null || concurrency === undefined
      ? null
      : Math.max(0, Math.floor(concurrency));
  const visibleSlots =
    safeConcurrency === null
      ? 0
      : Math.min(safeConcurrency, MAX_VISUAL_RUNNER_SLOTS);
  const hasCapacityMismatch =
    activeSlots !== undefined &&
    safeConcurrency !== null &&
    activeSlots > safeConcurrency;

  return (
    <Card className="h-full">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ServerCogIcon className="size-4 text-primary" /> Runner capacity
          </CardTitle>
          <CardDescription className="mt-1.5">
            Global slot occupancy across all labs. Active sandboxes pulse while
            they work.
          </CardDescription>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="text-2xl font-bold tracking-tight tabular-nums">
            {activeSlots === undefined ? "—" : activeSlots}
            <span className="text-sm font-medium text-muted-foreground">
              {safeConcurrency === null ? " active" : ` / ${safeConcurrency}`}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">active slots</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {overview === undefined ? <Skeleton className="h-24" /> : null}

        {overview && safeConcurrency === null ? (
          <div className="flex min-h-24 items-center gap-3 rounded-xl border border-dashed border-border bg-muted/25 p-4">
            <ServerCogIcon className="size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold text-foreground">
                Configured capacity unavailable
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                The API reports {overview.activeSlots} active evaluation
                {overview.activeSlots === 1 ? "" : "s"}, but this API process
                cannot reliably report runner concurrency.
              </p>
            </div>
          </div>
        ) : null}

        {overview && safeConcurrency === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/25 p-5 text-sm text-muted-foreground">
            No runner slots are configured.
          </div>
        ) : null}

        {overview && visibleSlots > 0 ? (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: visibleSlots }, (_, index) => {
              const active = index < overview.activeSlots;
              return (
                <div
                  key={index}
                  className={cn(
                    "relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 transition-all duration-300",
                    active
                      ? "border-info/35 bg-info/5 shadow-sm shadow-info/5"
                      : "border-border bg-muted/20",
                  )}
                  aria-label={`Runner slot ${index + 1}: ${active ? "active" : "available"}`}
                >
                  {active ? (
                    <span className="absolute inset-y-0 left-0 w-0.5 animate-pulse bg-info motion-reduce:animate-none" />
                  ) : null}
                  <span
                    className={cn(
                      "relative flex size-8 shrink-0 items-center justify-center rounded-lg",
                      active
                        ? "bg-info/10 text-info"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {active ? (
                      <>
                        <span className="absolute inset-0 animate-ping rounded-lg border border-info/35 opacity-50 motion-reduce:animate-none" />
                        <LoaderCircleIcon className="size-4 animate-spin motion-reduce:animate-none" />
                      </>
                    ) : (
                      <CircleDotIcon className="size-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Slot {index + 1}</p>
                    <p className="text-xs text-muted-foreground">
                      {active ? "Evaluation running" : "Available"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {safeConcurrency !== null &&
        safeConcurrency > MAX_VISUAL_RUNNER_SLOTS ? (
          <p className="text-xs text-muted-foreground">
            Showing {MAX_VISUAL_RUNNER_SLOTS} of {safeConcurrency} configured
            slots. Counts above remain exact.
          </p>
        ) : null}

        {hasCapacityMismatch ? (
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertDescription>
              The API reports more active evaluations than configured slots.
              Check runner configuration before relying on this capacity value.
            </AlertDescription>
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
}

function WaitingRoom({
  queuedCount,
  items,
  onSelect,
}: {
  queuedCount: number | undefined;
  items: EvaluationMonitorRecentItemDto[];
  onSelect: (evaluationId: string) => void;
}) {
  return (
    <Card className="h-full">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <ListChecksIcon className="size-4 text-primary" /> Waiting room
          </CardTitle>
          <CardDescription className="mt-1.5">
            Database-backed work accepted immediately and waiting safely for a
            runner.
          </CardDescription>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="text-2xl font-bold tracking-tight tabular-nums">
            {queuedCount === undefined ? "—" : queuedCount}
          </p>
          <p className="text-xs text-muted-foreground">queued in database</p>
        </div>
      </CardHeader>
      <CardContent>
        {queuedCount === undefined ? <Skeleton className="h-32" /> : null}

        {queuedCount === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center text-sm text-muted-foreground">
            The waiting room is empty.
          </div>
        ) : null}

        {queuedCount !== undefined && queuedCount > 0 && items.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center text-sm leading-6 text-muted-foreground">
            Queued evaluations exist outside the latest {RECENT_LIMIT} records.
          </div>
        ) : null}

        {items.length > 0 ? (
          <div className="space-y-2">
            {items.slice(0, 6).map((item) => (
              <button
                key={item.evaluationId}
                type="button"
                className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-muted/20 p-3 text-left transition-all duration-200 hover:-translate-y-px hover:border-primary/30 hover:bg-accent/50 active:translate-y-0 motion-reduce:transform-none"
                onClick={() => onSelect(item.evaluationId)}
              >
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs font-semibold text-foreground">
                    Student {shortId(item.studentId)}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    Attempt {item.attemptNo} · accepted{" "}
                    {formatNullableDate(item.createdAt)}
                  </span>
                </span>
                <EvaluationStatusBadge status={item.status} />
              </button>
            ))}
            {items.length > 6 ? (
              <p className="pt-1 text-center text-xs text-muted-foreground">
                +{items.length - 6} more in the recent result window
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function StepStateIcon({ step }: { step: EvaluationStepDto }) {
  if (step.status === "passed") {
    return <CheckCircle2Icon className="size-4 text-success" />;
  }
  if (step.status === "running") {
    return (
      <LoaderCircleIcon className="size-4 animate-spin text-info motion-reduce:animate-none" />
    );
  }
  if (step.status === "failed" || step.status === "error") {
    return <TriangleAlertIcon className="size-4 text-destructive" />;
  }
  return <CircleDotIcon className="size-4 text-muted-foreground" />;
}

function DetailSummaryItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border/75 bg-muted/25 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 min-w-0 text-sm font-semibold text-foreground">
        {children}
      </div>
    </div>
  );
}

function SelectedEvaluationDetails({
  evaluationId,
  evaluation,
  steps,
  isLoading,
  error,
}: {
  evaluationId: string;
  evaluation: EvaluationMonitorRecentItemDto | undefined;
  steps: EvaluationStepDto[] | undefined;
  isLoading: boolean;
  error: unknown;
}) {
  const errorExplanation = explainEvaluationError(evaluation?.errorCode);
  const stepsWithLogs = steps?.filter((step) => Boolean(step.log)) ?? [];
  const currentStep = evaluation?.currentStepName
    ? formatStepName(evaluation.currentStepName)
    : evaluation?.status === "queued"
      ? "Waiting for runner"
      : evaluation && ["passed", "failed", "error"].includes(evaluation.status)
        ? "Evaluation complete"
        : "No active step";

  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <TerminalSquareIcon className="size-4 text-primary" /> Evaluation
            detail
          </span>
          {evaluation ? (
            <EvaluationStatusBadge status={evaluation.status} />
          ) : null}
        </CardTitle>
        <CardDescription>
          {evaluationId ? (
            <span title={evaluationId}>
              Steps and real runner logs for {shortId(evaluationId)}.
            </span>
          ) : (
            "Select a recent evaluation to inspect its grading steps."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!evaluationId ? (
          <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center text-sm text-muted-foreground">
            No evaluation is selected.
          </div>
        ) : null}

        {evaluation ? (
          <section aria-label="Evaluation summary">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
              Summary
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <DetailSummaryItem label="Status">
                <EvaluationStatusBadge status={evaluation.status} />
              </DetailSummaryItem>
              <DetailSummaryItem label="Score">
                <span className="tabular-nums">
                  {evaluation.score === null
                    ? "Not scored"
                    : formatNumber(evaluation.score)}
                </span>
              </DetailSummaryItem>
              <DetailSummaryItem label="Current step">
                <span className="block truncate capitalize" title={currentStep}>
                  {currentStep}
                </span>
              </DetailSummaryItem>
              <DetailSummaryItem label="Duration">
                <span className="tabular-nums">
                  {formatDuration(evaluation.startedAt, evaluation.completedAt)}
                </span>
              </DetailSummaryItem>
            </div>
          </section>
        ) : null}

        {evaluation?.errorCode || evaluation?.errorMessage ? (
          <section
            aria-label="Evaluation failure"
            className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <p className="mb-2 flex items-center gap-2 font-semibold text-foreground">
              <TriangleAlertIcon className="size-4 text-destructive" /> Failure
              details
            </p>
            {evaluation.errorCode ? (
              <p className="font-mono text-xs font-semibold">
                {evaluation.errorCode}
              </p>
            ) : null}
            {evaluation.errorMessage ? (
              <p className="mt-1 leading-5">{evaluation.errorMessage}</p>
            ) : null}
            {errorExplanation ? (
              <p className="mt-2 border-t border-destructive/15 pt-2 leading-5 text-foreground/80">
                {errorExplanation}
              </p>
            ) : null}
          </section>
        ) : null}

        {error ? (
          <ApiErrorAlert error={error} title="Evaluation steps failed" />
        ) : null}

        {evaluationId && isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : null}

        {evaluationId && !isLoading && !error && steps?.length === 0 ? (
          <div className="flex min-h-32 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center text-sm leading-6 text-muted-foreground">
            {evaluation?.status === "queued"
              ? "No runner step has started. This evaluation remains safely queued in the waiting room."
              : "No grading steps or logs are available for this evaluation yet."}
          </div>
        ) : null}

        {steps && steps.length > 0 ? (
          <section aria-labelledby="evaluation-steps-heading">
            <div className="mb-3">
              <p
                id="evaluation-steps-heading"
                className="text-sm font-semibold text-foreground"
              >
                Evaluation steps
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Runner lifecycle in execution order.
              </p>
            </div>
            <div className="relative space-y-0 before:absolute before:bottom-5 before:left-[17px] before:top-5 before:w-px before:bg-border">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="relative flex gap-3 pb-3 last:pb-0"
                >
                  <span className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card shadow-sm">
                    <StepStateIcon step={step} />
                  </span>
                  <div className="min-w-0 flex-1 rounded-xl border border-border bg-muted/20 p-3.5">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="min-w-0 font-semibold capitalize text-foreground">
                        <span className="mr-2 text-xs text-muted-foreground tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {formatStepName(step.stepName)}
                      </p>
                      <EvaluationStatusBadge status={step.status} />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {step.completedAt
                        ? `Completed ${formatNullableDate(step.completedAt)}`
                        : step.startedAt
                          ? `Started ${formatNullableDate(step.startedAt)}`
                          : "Timing unavailable"}
                      {step.exitCode !== null && step.exitCode !== undefined
                        ? ` · Exit code ${step.exitCode}`
                        : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {stepsWithLogs.length > 0 ? (
          <section aria-labelledby="runner-logs-heading">
            <div className="mb-3 border-t border-border/70 pt-4">
              <p
                id="runner-logs-heading"
                className="flex items-center gap-2 text-sm font-semibold text-foreground"
              >
                <TerminalSquareIcon className="size-4 text-primary" /> Runner
                logs
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Expand a step to inspect its raw, scrollable runner output.
              </p>
            </div>
            <div className="space-y-2">
              {stepsWithLogs.map((step) => (
                <details
                  key={step.id}
                  className="group overflow-hidden rounded-xl border border-border bg-muted/15"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold capitalize text-foreground transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-inset [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 items-center gap-2">
                      <TerminalSquareIcon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate">
                        {formatStepName(step.stepName)} log
                      </span>
                    </span>
                    <span className="text-xs font-medium text-muted-foreground group-open:hidden">
                      Show
                    </span>
                    <span className="hidden text-xs font-medium text-muted-foreground group-open:inline">
                      Hide
                    </span>
                  </summary>
                  <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words border-t border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-300">
                    {step.log}
                  </pre>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </CardContent>
    </Card>
  );
}

function RecentEvaluationsTable({
  items,
  selectedEvaluationId,
  onSelect,
}: {
  items: EvaluationMonitorRecentItemDto[];
  selectedEvaluationId: string;
  onSelect: (evaluationId: string) => void;
}) {
  return (
    <Card className="min-w-0">
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle>Recent evaluations</CardTitle>
          <CardDescription className="mt-1.5">
            Active work first, then the newest real evaluation records in this
            scope.
          </CardDescription>
        </div>
        <Badge variant="outline" className="w-fit bg-muted/30 tabular-nums">
          {items.length} shown · max {RECENT_LIMIT}
        </Badge>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-5 text-center text-sm text-muted-foreground">
            No evaluations match this monitor scope yet.
          </div>
        ) : (
          <Table className="min-w-[880px]">
            <TableHeader>
              <TableRow className="bg-muted/45 hover:bg-muted/45">
                <TableHead>Student / submission</TableHead>
                <TableHead>Attempt</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current step</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Detail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => {
                const hasFailed = ["failed", "error"].includes(item.status);
                return (
                  <TableRow
                    key={item.evaluationId}
                    className={cn(
                      selectedEvaluationId === item.evaluationId &&
                        "border-l-2 border-l-primary bg-primary/5 hover:bg-primary/10",
                      hasFailed &&
                        "border-l-2 border-l-destructive bg-destructive/5 hover:bg-destructive/10",
                    )}
                    data-state={
                      selectedEvaluationId === item.evaluationId
                        ? "selected"
                        : undefined
                    }
                  >
                    <TableCell>
                      <div className="min-w-36">
                        <p
                          className="font-mono text-xs font-semibold"
                          title={item.studentId}
                        >
                          {shortId(item.studentId)}
                        </p>
                        <p
                          className="mt-1 truncate font-mono text-[10px] text-muted-foreground"
                          title={item.submissionId}
                        >
                          ZIP · {shortId(item.submissionId)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {item.attemptNo}
                    </TableCell>
                    <TableCell className="max-w-56 whitespace-normal">
                      <div className="space-y-1.5">
                        <EvaluationStatusBadge status={item.status} />
                        {item.errorCode ? (
                          <p
                            className="truncate font-mono text-[10px] font-semibold text-destructive"
                            title={item.errorCode}
                          >
                            {item.errorCode}
                          </p>
                        ) : null}
                        {item.errorMessage ? (
                          <p
                            className="line-clamp-2 text-[11px] leading-4 text-destructive"
                            title={item.errorMessage}
                          >
                            {item.errorMessage}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-52 whitespace-normal">
                      <p
                        className="truncate text-sm capitalize"
                        title={item.currentStepName ?? undefined}
                      >
                        {item.currentStepName
                          ? formatStepName(item.currentStepName)
                          : item.status === "queued"
                            ? "Waiting for runner"
                            : "—"}
                      </p>
                      {item.currentStepStatus ? (
                        <p className="mt-0.5 text-[11px] capitalize text-muted-foreground">
                          {formatStepName(item.currentStepStatus)}
                        </p>
                      ) : null}
                    </TableCell>
                    <TableCell className="font-medium tabular-nums">
                      {item.score === null ? "—" : formatNumber(item.score)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground tabular-nums">
                      {formatDuration(item.startedAt, item.completedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          selectedEvaluationId === item.evaluationId
                            ? "secondary"
                            : "outline"
                        }
                        aria-pressed={
                          selectedEvaluationId === item.evaluationId
                        }
                        onClick={() => onSelect(item.evaluationId)}
                      >
                        {selectedEvaluationId === item.evaluationId
                          ? "Viewing"
                          : "Inspect"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export function LiveGradingMonitorView({
  filters,
}: LiveGradingMonitorViewProps) {
  const [chosenEvaluationId, setChosenEvaluationId] = useState<string | null>(
    null,
  );
  const [isManualRefreshing, setIsManualRefreshing] = useState(false);
  const overviewQuery = useEvaluationMonitorOverview(filters);
  const overview = overviewQuery.data;
  const hasActiveWork = overview
    ? overview.queued + overview.running > 0
    : true;
  const recentQuery = useEvaluationMonitorRecent(
    { ...filters, limit: RECENT_LIMIT },
    hasActiveWork,
  );
  const hasMonitorError = Boolean(overviewQuery.error || recentQuery.error);
  const recentItems = recentQuery.data ?? [];
  const defaultSelectedItem =
    recentItems.find((item) => item.status === "running") ?? recentItems[0];
  const selectedEvaluationId =
    chosenEvaluationId ?? defaultSelectedItem?.evaluationId ?? "";
  const selectedEvaluation = recentItems.find(
    (item) => item.evaluationId === selectedEvaluationId,
  );
  const selectedHasActiveWork = selectedEvaluation
    ? isEvaluationActive(selectedEvaluation.status)
    : hasActiveWork;
  const stepsQuery = useEvaluationMonitorSteps(
    selectedEvaluationId,
    selectedHasActiveWork,
  );
  const queuedItems = recentItems.filter((item) => item.status === "queued");
  const completionPercent = overview?.total
    ? Math.min(100, Math.max(0, (overview.terminal / overview.total) * 100))
    : 0;

  async function refreshMonitor() {
    setIsManualRefreshing(true);
    try {
      const requests: Promise<unknown>[] = [
        overviewQuery.refetch(),
        recentQuery.refetch(),
      ];
      if (selectedEvaluationId) requests.push(stepsQuery.refetch());
      await Promise.all(requests);
    } finally {
      setIsManualRefreshing(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Evaluation operations"
        title="Live grading monitor"
        description="Follow each real ZIP from acceptance through the waiting room, isolated execution, and final result."
      >
        <Button
          type="button"
          variant="outline"
          disabled={isManualRefreshing}
          onClick={() => void refreshMonitor()}
        >
          <RefreshCwIcon
            className={cn(
              "size-4",
              isManualRefreshing && "animate-spin motion-reduce:animate-none",
            )}
          />
          Refresh
        </Button>
      </PageHeader>

      <DemoNarrativeHero
        filters={filters}
        overview={overview}
        hasActiveWork={hasActiveWork}
        hasMonitorError={hasMonitorError}
      />

      {overviewQuery.error ? (
        <ApiErrorAlert
          error={overviewQuery.error}
          title="Monitor overview failed"
        />
      ) : null}
      {recentQuery.error ? (
        <ApiErrorAlert
          error={recentQuery.error}
          title="Recent evaluations failed"
        />
      ) : null}

      <Card className="overflow-hidden">
        <CardContent className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.3fr)_repeat(4,minmax(0,0.55fr))] lg:items-center">
          <div className="min-w-0">
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">Terminal progress</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Terminal evaluations out of all accepted evaluations
                </p>
              </div>
              <p className="shrink-0 text-sm font-bold tabular-nums">
                {overview ? `${overview.terminal} / ${overview.total}` : "—"}
              </p>
            </div>
            <Progress
              value={completionPercent}
              className="h-2"
              aria-label="Evaluation completion progress"
            />
            <p className="mt-2 text-right text-xs font-medium text-muted-foreground tabular-nums">
              {overview
                ? `${formatNumber(completionPercent)}% complete`
                : "Loading"}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <ActivityIcon className="size-3.5" /> Throughput
            </p>
            <p className="mt-1 text-sm font-bold tabular-nums">
              {overview?.throughputPerMinute === null || !overview
                ? "Unavailable"
                : `${formatNumber(overview.throughputPerMinute)} / min`}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <TimerIcon className="size-3.5" /> Estimated remaining
            </p>
            <p className="mt-1 text-sm font-bold tabular-nums">
              {overview?.estimatedRemainingMinutes === null || !overview
                ? "Unavailable"
                : `${formatNumber(overview.estimatedRemainingMinutes)} min`}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Window started
            </p>
            <p className="mt-1 text-xs font-medium">
              {formatNullableDate(overview?.startedAt)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Last database update
            </p>
            <p className="mt-1 text-xs font-medium">
              {formatNullableDate(overview?.updatedAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <RunnerSlots overview={overview} />
        <WaitingRoom
          queuedCount={overview?.queued}
          items={queuedItems}
          onSelect={setChosenEvaluationId}
        />
      </div>

      <div className="grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.75fr)]">
        {recentQuery.isLoading ? (
          <Skeleton className="h-96" />
        ) : (
          <RecentEvaluationsTable
            items={recentItems}
            selectedEvaluationId={selectedEvaluationId}
            onSelect={setChosenEvaluationId}
          />
        )}
        <SelectedEvaluationDetails
          evaluationId={selectedEvaluationId}
          evaluation={selectedEvaluation}
          steps={stepsQuery.data}
          isLoading={stepsQuery.isLoading}
          error={stepsQuery.error}
        />
      </div>
    </div>
  );
}
