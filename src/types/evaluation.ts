export type EvaluationStatus =
  | "queued"
  | "running"
  | "passed"
  | "failed"
  | "error"
  | (string & {});

export type EvaluationStepStatus =
  | "pending"
  | "running"
  | "passed"
  | "failed"
  | "skipped"
  | (string & {});

export interface EvaluationStepDto {
  id: string;
  stepName: string;
  status: EvaluationStepStatus;
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

export interface EvaluationMonitorFilters {
  classId?: string;
  labId?: string;
}

export interface EvaluationMonitorOverviewDto {
  total: number;
  queued: number;
  running: number;
  passed: number;
  failed: number;
  error: number;
  terminal: number;
  activeSlots: number;
  runnerConcurrency: number | null;
  startedAt: string | null;
  updatedAt: string | null;
  throughputPerMinute: number | null;
  estimatedRemainingMinutes: number | null;
}

export interface EvaluationMonitorRecentItemDto {
  evaluationId: string;
  submissionId: string;
  studentId: string;
  attemptNo: number;
  status: EvaluationStatus;
  score: number | null;
  passed: boolean | null;
  errorCode: string | null;
  errorMessage: string | null;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  currentStepName: string | null;
  currentStepStatus: EvaluationStepStatus | null;
}

export interface EvaluationMonitorRecentParams extends EvaluationMonitorFilters {
  limit?: number;
}
