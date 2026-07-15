export type LabStatus = "pending_assets" | "active" | "archived";

export type RubricMatchType = "exact" | "contains" | "prefix" | "regex";

export interface LabGradingCriterionDto {
  key: string;
  title: string;
  description: string | null;
  maxScore: number;
  sortOrder: number;
  matchType: RubricMatchType;
  matchPattern: string;
  isRequired: boolean;
}

export interface LabRubricDto {
  labId: string;
  totalScore: number;
  criteria: LabGradingCriterionDto[];
}

export interface UpdateLabRubricRequest {
  criteria: LabGradingCriterionDto[];
}

export interface LabDto {
  id: string;
  classId: string;
  title: string;
  description: string | null;
  requirementObjectKey: string;
  collectionObjectKey: string;
  status: LabStatus;
  deadline: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  assetsCompletedAt: string | null;
}

export interface CreateLabRequest {
  title: string;
  description?: string | null;
  deadline: string;
  requirementFileName: string;
  collectionFileName: string;
}

export interface UpdateLabRequest {
  title: string;
  description?: string | null;
  deadline: string;
}

export interface LabUploadDto {
  requirementUploadUrl: string;
  collectionUploadUrl: string;
  expiresAt: string;
}

export interface CreateLabResponse {
  lab: LabDto;
  upload: LabUploadDto;
}

export interface CompleteLabAssetsRequest {
  requirementUploaded: boolean;
  collectionUploaded: boolean;
}

export interface PresignedUrlDto {
  url: string;
  expiresAt: string;
}
