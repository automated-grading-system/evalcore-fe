export type EvaluationStatus =
  | "queued"
  | "running"
  | "passed"
  | "failed"
  | "error"
  | (string & {});

export interface EvaluationStepDto {
  id: string;
  stepName: string;
  status: EvaluationStatus;
  startedAt?: string | null;
  completedAt?: string | null;
  exitCode?: number | null;
  log?: string | null;
  metadata?: string | null;
}

export interface EvaluationDto {
  id: string;
  submissionId: string;
  labId: string;
  classId: string;
  studentId: string;
  attemptNo: number;
  status: EvaluationStatus;
  score?: number | null;
  maxScore?: number | null;
  passed?: boolean | null;
  projectObjectKey: string;
  collectionObjectKey?: string | null;
  reportObjectKey?: string | null;
  newmanReportObjectKey?: string | null;
  logsObjectKey?: string | null;
  errorCode?: string | null;
  errorMessage?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  steps: EvaluationStepDto[];
}

export interface EvaluationReportUrlDto {
  reportUrl: string;
  expiresAt: string;
}
