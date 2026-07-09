import type { ApiErrorPayload } from "@/types/api";

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly details?: ApiErrorPayload["details"];
  public readonly status?: number;

  constructor(
    code: string,
    message: string,
    details?: ApiErrorPayload["details"],
    status?: number,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

const FRIENDLY_MESSAGES: Record<string, string> = {
  ALREADY_JOINED_CLASS: "You have already joined this class.",
  CLASS_ACCESS_DENIED: "You do not have access to this class.",
  CLASS_NOT_FOUND: "This class could not be found.",
  FORBIDDEN: "You do not have permission to access this resource.",
  GATEWAY_UNAVAILABLE:
    "API Gateway is unavailable. Make sure the Docker stack is running.",
  LAB_ACCESS_DENIED: "You do not have access to this lab.",
  LAB_ASSET_INVALID_FILE_TYPE:
    "One of the selected lab asset files is not supported.",
  LAB_ASSETS_ALREADY_COMPLETED: "Lab assets have already been completed.",
  LAB_ASSETS_NOT_COMPLETED: "Lab assets have not been completed yet.",
  LAB_DEADLINE_INVALID: "The lab deadline must be a future date.",
  LAB_NOT_ACTIVE: "This lab is not active yet.",
  LAB_NOT_FOUND: "This lab could not be found.",
  S3_OBJECT_CHECK_FAILED:
    "The server could not verify uploaded lab assets. Please try again.",
  S3_OBJECT_NOT_FOUND: "The requested lab asset could not be found.",
  S3_PRESIGN_FAILED:
    "The server could not prepare the lab asset download. Please try again.",
  PRESIGNED_UPLOAD_FAILED:
    "Upload URL expired or storage bucket is unavailable. Please try again.",
  PRESIGNED_UPLOAD_NETWORK_ERROR:
    "Browser upload to storage failed. Please try again.",
  STUDENT_NOT_IN_CLASS: "You have not joined this class.",
  SUBMISSION_INVALID_FILE_TYPE: "Please upload a .zip file.",
  SUBMISSION_NOT_SUBMITTED: "Submission has not been completed yet.",
  SUBMISSION_STORAGE_UPLOAD_FAILED:
    "Upload URL expired or storage bucket is unavailable. Please try again.",
  SUBMISSION_UPLOAD_URL_EXPIRED: "Upload URL expired. Please try again.",
  VALIDATION_ERROR: "Please check the form and try again.",
  UNAUTHORIZED: "Session expired. Please log in again.",
};

export function isApiClientError(error: unknown): error is ApiClientError {
  return error instanceof ApiClientError;
}

export function getApiErrorMessage(error: unknown): string {
  if (isApiClientError(error)) {
    return FRIENDLY_MESSAGES[error.code] ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred. Please try again.";
}
