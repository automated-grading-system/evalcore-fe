export type SubmissionStatus =
  | "pending_assets"
  | "submitted"
  | "queued"
  | "running"
  | "passed"
  | "failed"
  | "error"
  | (string & {});

export interface SubmissionDto {
  id: string;
  labId: string;
  classId: string;
  studentId: string;
  studentEmail: string;
  attemptNo: number;
  projectFileName: string;
  projectObjectKey: string;
  status: SubmissionStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string | null;
}

export interface CreateSubmissionRequest {
  projectFileName: string;
  notes?: string | null;
}

export interface SubmissionUploadDto {
  projectUploadUrl: string;
  expiresAt: string;
}

export interface CreateSubmissionResponse {
  submission: SubmissionDto;
  upload: SubmissionUploadDto;
}

export interface CompleteSubmissionAssetsRequest {
  projectUploaded: boolean;
}

export interface SubmissionSourceUrlDto {
  url: string;
  expiresAt: string;
}
