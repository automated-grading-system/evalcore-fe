import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from "@/lib/api/client";
import { uploadToPresignedUrl } from "@/lib/api/presigned-upload";
import type { PagedResponse } from "@/types/api";
import type {
  ClassDto,
  ClassMemberDto,
  CreateClassRequest,
  UpdateClassRequest,
} from "@/types/class";
import type {
  CompleteLabAssetsRequest,
  CreateLabRequest,
  CreateLabResponse,
  LabDto,
  LabRubricDto,
  LabUploadDto,
  PresignedUrlDto,
  UpdateLabRubricRequest,
  UpdateLabRequest,
} from "@/types/lab";

export interface ClassListParams {
  page?: number;
  pageSize?: number;
}

export interface ClassSearchParams extends ClassListParams {
  name: string;
}

export interface UploadLabAssetsFiles {
  requirementFile: File;
  collectionFile: File;
}

export type UploadStep = "requirement" | "collection";

function pagingParams(params: ClassListParams = {}) {
  return {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  };
}

export function createClass(
  request: CreateClassRequest,
): Promise<ClassDto> {
  return apiPost<ClassDto>("/api/classes", request);
}

export function listLecturerClasses(
  params: ClassListParams = {},
): Promise<PagedResponse<ClassDto>> {
  return apiGet<PagedResponse<ClassDto>>("/api/classes", {
    params: pagingParams(params),
  });
}

export function searchClasses(
  params: ClassSearchParams,
): Promise<PagedResponse<ClassDto>> {
  return apiGet<PagedResponse<ClassDto>>("/api/classes/search", {
    params: {
      ...pagingParams(params),
      name: params.name,
    },
  });
}

export function getClass(classId: string): Promise<ClassDto> {
  return apiGet<ClassDto>(`/api/classes/${classId}`);
}

export function updateClass(
  classId: string,
  request: UpdateClassRequest,
): Promise<ClassDto> {
  return apiPut<ClassDto>(`/api/classes/${classId}`, request);
}

export function deleteClass(classId: string): Promise<void> {
  return apiDelete<void>(`/api/classes/${classId}`);
}

export function joinClass(classId: string): Promise<void> {
  return apiPost<void>(`/api/classes/${classId}/join`);
}

export function getMyClasses(
  params: ClassListParams = {},
): Promise<PagedResponse<ClassDto>> {
  return apiGet<PagedResponse<ClassDto>>("/api/classes/my", {
    params: pagingParams(params),
  });
}

export function getClassMembers(
  classId: string,
  params: ClassListParams = {},
): Promise<PagedResponse<ClassMemberDto>> {
  return apiGet<PagedResponse<ClassMemberDto>>(
    `/api/classes/${classId}/members`,
    {
      params: pagingParams(params),
    },
  );
}

export function createLab(
  classId: string,
  request: CreateLabRequest,
): Promise<CreateLabResponse> {
  return apiPost<CreateLabResponse>(`/api/classes/${classId}/labs`, request);
}

export function listClassLabs(
  classId: string,
  params: ClassListParams = {},
): Promise<PagedResponse<LabDto>> {
  return apiGet<PagedResponse<LabDto>>(`/api/classes/${classId}/labs`, {
    params: pagingParams(params),
  });
}

export function getLab(labId: string): Promise<LabDto> {
  return apiGet<LabDto>(`/api/labs/${labId}`);
}

export function getLabRubric(labId: string): Promise<LabRubricDto> {
  return apiGet<LabRubricDto>(`/api/labs/${labId}/rubric`);
}

export function updateLabRubric(
  labId: string,
  request: UpdateLabRubricRequest,
): Promise<LabRubricDto> {
  return apiPut<LabRubricDto>(`/api/labs/${labId}/rubric`, request);
}

export function updateLab(
  labId: string,
  request: UpdateLabRequest,
): Promise<LabDto> {
  return apiPut<LabDto>(`/api/labs/${labId}`, request);
}

export function deleteLab(labId: string): Promise<void> {
  return apiDelete<void>(`/api/labs/${labId}`);
}

export function completeLabAssets(
  labId: string,
  request: CompleteLabAssetsRequest,
): Promise<void> {
  return apiPost<void>(`/api/labs/${labId}/assets/complete`, request);
}

export function getRequirementUrl(
  labId: string,
): Promise<PresignedUrlDto> {
  return apiGet<PresignedUrlDto>(
    `/api/labs/${labId}/assets/requirement`,
  );
}

export function getCollectionUrl(labId: string): Promise<PresignedUrlDto> {
  return apiGet<PresignedUrlDto>(`/api/labs/${labId}/assets/collection`);
}

export async function uploadLabAssets(
  upload: LabUploadDto,
  files: UploadLabAssetsFiles,
  onStep?: (step: UploadStep) => void,
): Promise<void> {
  onStep?.("requirement");
  await uploadToPresignedUrl(
    upload.requirementUploadUrl,
    files.requirementFile,
  );

  onStep?.("collection");
  await uploadToPresignedUrl(
    upload.collectionUploadUrl,
    files.collectionFile,
  );
}
