export const evaluationQueryKeys = {
  all: ["evaluations"] as const,
  details: () => [...evaluationQueryKeys.all, "detail"] as const,
  detail: (evaluationId: string) =>
    [...evaluationQueryKeys.details(), evaluationId] as const,
  latest: () => [...evaluationQueryKeys.all, "latest"] as const,
  latestForSubmission: (submissionId: string) =>
    [...evaluationQueryKeys.latest(), submissionId] as const,
};
