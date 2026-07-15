import type {
  EvaluationMonitorFilters,
  EvaluationMonitorRecentParams,
} from "@/types/evaluation";

export const evaluationQueryKeys = {
  all: ["evaluations"] as const,
  details: () => [...evaluationQueryKeys.all, "detail"] as const,
  detail: (evaluationId: string) =>
    [...evaluationQueryKeys.details(), evaluationId] as const,
  latest: () => [...evaluationQueryKeys.all, "latest"] as const,
  latestForSubmission: (submissionId: string) =>
    [...evaluationQueryKeys.latest(), submissionId] as const,
  monitor: () => [...evaluationQueryKeys.all, "monitor"] as const,
  monitorOverview: (filters: EvaluationMonitorFilters) =>
    [...evaluationQueryKeys.monitor(), "overview", filters] as const,
  monitorRecent: (params: EvaluationMonitorRecentParams) =>
    [...evaluationQueryKeys.monitor(), "recent", params] as const,
  monitorSteps: (evaluationId: string) =>
    [...evaluationQueryKeys.monitor(), "steps", evaluationId] as const,
};
