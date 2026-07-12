"use client";

import { useMutation, useQueries, useQuery } from "@tanstack/react-query";

import {
  getEvaluation,
  getEvaluationReportUrl,
  getLatestEvaluationForSubmission,
} from "@/features/evaluations/api/evaluation-api";
import { evaluationQueryKeys } from "@/features/evaluations/api/evaluation-query-keys";
import { isApiClientError } from "@/lib/api/errors";
import type { EvaluationDto, EvaluationStatus } from "@/types/evaluation";

const ACTIVE_EVALUATION_STATUSES = new Set<EvaluationStatus>([
  "queued",
  "running",
]);

const EVALUATION_POLL_INTERVAL_MS = 2_500;

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
    queries: uniqueIds.map((submissionId) => latestEvaluationQuery(submissionId)),
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
