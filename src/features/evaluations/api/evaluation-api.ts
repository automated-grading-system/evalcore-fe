import { apiGet } from "@/lib/api/client";
import type {
  EvaluationDto,
  EvaluationReportUrlDto,
} from "@/types/evaluation";

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
