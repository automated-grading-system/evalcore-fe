import { apiGet, apiPost } from "@/lib/api/client";
import { uploadToPresignedUrl } from "@/lib/api/presigned-upload";
import type { PagedResponse } from "@/types/api";
import type {
  CompleteSubmissionAssetsRequest,
  CreateSubmissionRequest,
  CreateSubmissionResponse,
  SubmissionDto,
  SubmissionSourceUrlDto,
} from "@/types/submission";

export interface SubmissionListParams {
  page?: number;
  pageSize?: number;
}

export type SubmissionUploadStep = "creating" | "uploading" | "completing";

function pagingParams(params: SubmissionListParams = {}) {
  return {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  };
}

export function createSubmission(
  labId: string,
  payload: CreateSubmissionRequest,
): Promise<CreateSubmissionResponse> {
  return apiPost<CreateSubmissionResponse>(
    `/api/labs/${labId}/submissions`,
    payload,
  );
}

export async function uploadSubmissionZip(
  projectUploadUrl: string,
  file: File,
): Promise<void> {
  await uploadToPresignedUrl(projectUploadUrl, file);
}

export function completeSubmissionAssets(
  submissionId: string,
  payload: CompleteSubmissionAssetsRequest = { projectUploaded: true },
): Promise<void> {
  return apiPost<void>(
    `/api/submissions/${submissionId}/assets/complete`,
    payload,
  );
}

export function getMySubmissions(
  params: SubmissionListParams = {},
): Promise<PagedResponse<SubmissionDto>> {
  return apiGet<PagedResponse<SubmissionDto>>("/api/submissions/my", {
    params: pagingParams(params),
  });
}

export function getMySubmissionForLab(
  labId: string,
): Promise<SubmissionDto | null> {
  return apiGet<PagedResponse<SubmissionDto>>(
    `/api/labs/${labId}/submissions/my`,
  ).then((response) => response.items[0] ?? null);
}

export function getLabSubmissions(
  labId: string,
  params: SubmissionListParams = {},
): Promise<PagedResponse<SubmissionDto>> {
  return apiGet<PagedResponse<SubmissionDto>>(
    `/api/labs/${labId}/submissions`,
    {
      params: pagingParams(params),
    },
  );
}

export function getSubmissionDetail(
  submissionId: string,
): Promise<SubmissionDto> {
  return apiGet<SubmissionDto>(`/api/submissions/${submissionId}`);
}

export function getSubmissionSourceUrl(
  submissionId: string,
): Promise<SubmissionSourceUrlDto> {
  return apiGet<SubmissionSourceUrlDto>(
    `/api/submissions/${submissionId}/assets/source`,
  );
}
