import axios from "axios";

import {
  apiDelete,
  apiGet,
  apiPost,
  apiPut,
} from "@/lib/api/client";
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
  LabUploadDto,
  PresignedUrlDto,
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
  await axios.put(upload.requirementUploadUrl, files.requirementFile, {
    headers: {
      "Content-Type":
        files.requirementFile.type || "application/octet-stream",
    },
  });

  onStep?.("collection");
  await axios.put(upload.collectionUploadUrl, files.collectionFile, {
    headers: {
      "Content-Type":
        files.collectionFile.type || "application/octet-stream",
    },
  });
}
