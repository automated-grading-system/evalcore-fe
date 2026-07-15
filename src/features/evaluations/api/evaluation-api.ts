import { apiGet } from "@/lib/api/client";
import type {
  EvaluationDto,
  EvaluationMonitorFilters,
  EvaluationMonitorOverviewDto,
  EvaluationMonitorRecentItemDto,
  EvaluationMonitorRecentParams,
  EvaluationReportUrlDto,
  EvaluationStepDto,
} from "@/types/evaluation";

function monitorFilterParams(filters: EvaluationMonitorFilters = {}) {
  return {
    classId: filters.classId?.trim() || undefined,
    labId: filters.labId?.trim() || undefined,
  };
}

export function getLatestEvaluationForSubmission(
  submissionId: string,
): Promise<EvaluationDto> {
  return apiGet<EvaluationDto>(
    `/api/submissions/${submissionId}/evaluations/latest`,
  );
}

export function getEvaluation(evaluationId: string): Promise<EvaluationDto> {
  return apiGet<EvaluationDto>(`/api/evaluations/${evaluationId}`);
}

export function getEvaluationReportUrl(
  evaluationId: string,
): Promise<EvaluationReportUrlDto> {
  return apiGet<EvaluationReportUrlDto>(
    `/api/evaluations/${evaluationId}/report`,
  );
}

export function getEvaluationMonitorOverview(
  filters: EvaluationMonitorFilters = {},
): Promise<EvaluationMonitorOverviewDto> {
  return apiGet<EvaluationMonitorOverviewDto>(
    "/api/evaluations/monitor/overview",
    { params: monitorFilterParams(filters) },
  );
}

export function getEvaluationMonitorRecent(
  params: EvaluationMonitorRecentParams = {},
): Promise<EvaluationMonitorRecentItemDto[]> {
  return apiGet<EvaluationMonitorRecentItemDto[]>(
    "/api/evaluations/monitor/recent",
    {
      params: {
        ...monitorFilterParams(params),
        limit: params.limit ?? 30,
      },
    },
  );
}

export function getEvaluationMonitorSteps(
  evaluationId: string,
): Promise<EvaluationStepDto[]> {
  return apiGet<EvaluationStepDto[]>("/api/evaluations/monitor/steps", {
    params: { evaluationId },
  });
}
