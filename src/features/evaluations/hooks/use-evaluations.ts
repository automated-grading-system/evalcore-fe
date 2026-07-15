"use client";

import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

import {
  getEvaluation,
  getEvaluationMonitorOverview,
  getEvaluationMonitorRecent,
  getEvaluationMonitorSteps,
  getEvaluationReportUrl,
  getLatestEvaluationForSubmission,
} from "@/features/evaluations/api/evaluation-api";
import { evaluationQueryKeys } from "@/features/evaluations/api/evaluation-query-keys";
import { isApiClientError } from "@/lib/api/errors";
import type {
  EvaluationDto,
  EvaluationMonitorFilters,
  EvaluationMonitorRecentParams,
  EvaluationStatus,
} from "@/types/evaluation";

const ACTIVE_EVALUATION_STATUSES = new Set<EvaluationStatus>([
  "queued",
  "running",
]);

const EVALUATION_POLL_INTERVAL_MS = 2_500;
const MONITOR_ACTIVE_POLL_INTERVAL_MS = 1_000;
const MONITOR_IDLE_POLL_INTERVAL_MS = 10_000;
const MONITOR_TRANSIENT_ERROR_POLL_INTERVAL_MS = 30_000;
const MONITOR_RETRY_DELAY_MS = 5_000;
const TRANSIENT_CLIENT_ERROR_STATUSES = new Set([408, 425, 429]);

export interface LatestEvaluationOptions {
  enabled?: boolean;
}

export function isEvaluationActive(
  status: EvaluationStatus | null | undefined,
): boolean {
  return typeof status === "string" && ACTIVE_EVALUATION_STATUSES.has(status);
}

function isNoEvaluationError(error: unknown): boolean {
  return (
    isApiClientError(error) &&
    error.status === 404 &&
    ["EVALUATION_NOT_FOUND", "NOT_FOUND", "HTTP_ERROR"].includes(error.code)
  );
}

function isPermanentMonitorError(error: unknown): boolean {
  return (
    isApiClientError(error) &&
    typeof error.status === "number" &&
    error.status >= 400 &&
    error.status < 500 &&
    !TRANSIENT_CLIENT_ERROR_STATUSES.has(error.status)
  );
}

function monitorRefetchInterval(error: unknown): number | false | null {
  if (!error) return null;
  return isPermanentMonitorError(error)
    ? false
    : MONITOR_TRANSIENT_ERROR_POLL_INTERVAL_MS;
}

function shouldRetryMonitorQuery(failureCount: number, error: unknown) {
  return !isPermanentMonitorError(error) && failureCount < 2;
}

const monitorRetryOptions = {
  retry: shouldRetryMonitorQuery,
  retryDelay: MONITOR_RETRY_DELAY_MS,
};

async function findLatestEvaluation(
  submissionId: string,
): Promise<EvaluationDto | null> {
  try {
    return await getLatestEvaluationForSubmission(submissionId);
  } catch (error) {
    if (isNoEvaluationError(error)) return null;
    throw error;
  }
}

function latestEvaluationQuery(submissionId: string, enabled = true) {
  return {
    queryKey: evaluationQueryKeys.latestForSubmission(submissionId),
    queryFn: () => findLatestEvaluation(submissionId),
    enabled: Boolean(submissionId) && enabled,
    refetchInterval: (query: { state: { data?: EvaluationDto | null } }) =>
      query.state.data === null || isEvaluationActive(query.state.data?.status)
        ? EVALUATION_POLL_INTERVAL_MS
        : false,
    refetchIntervalInBackground: false,
  };
}

export function useLatestEvaluationForSubmission(
  submissionId: string,
  options: LatestEvaluationOptions = {},
) {
  return useQuery(latestEvaluationQuery(submissionId, options.enabled ?? true));
}

export function useLatestEvaluationsForSubmissions(submissionIds: string[]) {
  const uniqueIds = [...new Set(submissionIds.filter(Boolean))];
  const results = useQueries({
    queries: uniqueIds.map((submissionId) =>
      latestEvaluationQuery(submissionId),
    ),
  });

  return Object.fromEntries(
    uniqueIds.map((submissionId, index) => [submissionId, results[index]]),
  );
}

export function useEvaluation(evaluationId: string) {
  return useQuery({
    queryKey: evaluationQueryKeys.detail(evaluationId),
    queryFn: () => getEvaluation(evaluationId),
    enabled: Boolean(evaluationId),
  });
}

export function useEvaluationReportUrl() {
  return useMutation({
    mutationFn: (evaluationId: string) => getEvaluationReportUrl(evaluationId),
  });
}

export function useEvaluationMonitorOverview(
  filters: EvaluationMonitorFilters,
) {
  return useQuery({
    queryKey: evaluationQueryKeys.monitorOverview(filters),
    queryFn: () => getEvaluationMonitorOverview(filters),
    staleTime: 0,
    refetchInterval: (query) => {
      const errorInterval = monitorRefetchInterval(query.state.error);
      if (errorInterval !== null) return errorInterval;
      const overview = query.state.data;
      return overview && overview.queued + overview.running === 0
        ? MONITOR_IDLE_POLL_INTERVAL_MS
        : MONITOR_ACTIVE_POLL_INTERVAL_MS;
    },
    refetchIntervalInBackground: false,
    ...monitorRetryOptions,
  });
}

export function useEvaluationMonitorRecent(
  params: EvaluationMonitorRecentParams,
  hasActiveWork: boolean,
) {
  return useQuery({
    queryKey: evaluationQueryKeys.monitorRecent(params),
    queryFn: () => getEvaluationMonitorRecent(params),
    staleTime: 0,
    refetchInterval: (query) => {
      const errorInterval = monitorRefetchInterval(query.state.error);
      if (errorInterval !== null) return errorInterval;
      const recentStillShowsActiveWork = query.state.data?.some((evaluation) =>
        isEvaluationActive(evaluation.status),
      );
      return hasActiveWork || recentStillShowsActiveWork
        ? MONITOR_ACTIVE_POLL_INTERVAL_MS
        : MONITOR_IDLE_POLL_INTERVAL_MS;
    },
    refetchIntervalInBackground: false,
    ...monitorRetryOptions,
  });
}

export function useEvaluationMonitorSteps(
  evaluationId: string,
  hasActiveWork: boolean,
) {
  return useQuery({
    queryKey: evaluationQueryKeys.monitorSteps(evaluationId),
    queryFn: () => getEvaluationMonitorSteps(evaluationId),
    enabled: Boolean(evaluationId),
    staleTime: 0,
    refetchInterval: (query) => {
      const errorInterval = monitorRefetchInterval(query.state.error);
      if (errorInterval !== null) return errorInterval;
      const stepsStillShowActiveWork = query.state.data?.some((step) =>
        ["pending", "running"].includes(step.status.toLowerCase()),
      );
      return hasActiveWork || stepsStillShowActiveWork
        ? MONITOR_ACTIVE_POLL_INTERVAL_MS
        : false;
    },
    refetchIntervalInBackground: false,
    ...monitorRetryOptions,
  });
}
