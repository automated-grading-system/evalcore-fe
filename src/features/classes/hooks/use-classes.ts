"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  completeLabAssets,
  createClass,
  createLab,
  deleteClass,
  deleteLab,
  getClass,
  getClassMembers,
  getCollectionUrl,
  getLab,
  getMyClasses,
  getRequirementUrl,
  joinClass,
  listClassLabs,
  listLecturerClasses,
  searchClasses,
  updateClass,
  updateLab,
  uploadLabAssets,
  type ClassListParams,
  type ClassSearchParams,
  type UploadStep,
} from "@/features/classes/api/class-api";
import {
  classQueryKeys,
  labQueryKeys,
} from "@/features/classes/api/class-query-keys";
import type { CreateClassRequest, UpdateClassRequest } from "@/types/class";
import type {
  CompleteLabAssetsRequest,
  CreateLabRequest,
  LabUploadDto,
  UpdateLabRequest,
} from "@/types/lab";

const DEFAULT_PAGE: Required<ClassListParams> = {
  page: 1,
  pageSize: 20,
};

export function useLecturerClasses(params: ClassListParams = DEFAULT_PAGE) {
  return useQuery({
    queryKey: classQueryKeys.lecturerList(params),
    queryFn: () => listLecturerClasses(params),
  });
}

export function useSearchClasses(
  params: ClassSearchParams,
  enabled = true,
) {
  return useQuery({
    queryKey: classQueryKeys.search(params),
    queryFn: () => searchClasses(params),
    enabled: enabled && params.name.trim().length > 0,
  });
}

export function useMyClasses(params: ClassListParams = DEFAULT_PAGE) {
  return useQuery({
    queryKey: classQueryKeys.myList(params),
    queryFn: () => getMyClasses(params),
  });
}

export function useClassDetail(classId: string) {
  return useQuery({
    queryKey: classQueryKeys.detail(classId),
    queryFn: () => getClass(classId),
    enabled: Boolean(classId),
  });
}

export function useClassMembers(
  classId: string,
  params: ClassListParams = DEFAULT_PAGE,
) {
  return useQuery({
    queryKey: classQueryKeys.members(classId, params),
    queryFn: () => getClassMembers(classId, params),
    enabled: Boolean(classId),
  });
}

export function useClassLabs(
  classId: string,
  params: ClassListParams = DEFAULT_PAGE,
) {
  return useQuery({
    queryKey: classQueryKeys.labs(classId, params),
    queryFn: () => listClassLabs(classId, params),
    enabled: Boolean(classId),
  });
}

export function useLabDetail(labId: string) {
  return useQuery({
    queryKey: labQueryKeys.detail(labId),
    queryFn: () => getLab(labId),
    enabled: Boolean(labId),
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateClassRequest) => createClass(request),
    onSuccess: (createdClass) => {
      queryClient.invalidateQueries({
        queryKey: classQueryKeys.lecturerLists(),
      });
      queryClient.setQueryData(
        classQueryKeys.detail(createdClass.id),
        createdClass,
      );
    },
  });
}

export function useUpdateClass(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateClassRequest) =>
      updateClass(classId, request),
    onSuccess: (updatedClass) => {
      queryClient.invalidateQueries({
        queryKey: classQueryKeys.lecturerLists(),
      });
      queryClient.setQueryData(classQueryKeys.detail(classId), updatedClass);
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => deleteClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: classQueryKeys.lecturerLists(),
      });
    },
  });
}

export function useJoinClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (classId: string) => joinClass(classId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classQueryKeys.myLists() });
      queryClient.invalidateQueries({ queryKey: classQueryKeys.searches() });
    },
  });
}

export function useCreateLab(classId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateLabRequest) => createLab(classId, request),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: classQueryKeys.labsRoot(classId),
      });
      queryClient.setQueryData(
        labQueryKeys.detail(response.lab.id),
        response.lab,
      );
    },
  });
}

export function useUpdateLab(labId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: UpdateLabRequest) => updateLab(labId, request),
    onSuccess: (updatedLab) => {
      queryClient.setQueryData(labQueryKeys.detail(labId), updatedLab);
      queryClient.invalidateQueries({
        queryKey: classQueryKeys.labsRoot(updatedLab.classId),
      });
    },
  });
}

export function useDeleteLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (labId: string) => deleteLab(labId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: classQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: labQueryKeys.all });
    },
  });
}

type CompleteLabAssetsMutationInput =
  | CompleteLabAssetsRequest
  | {
      labId: string;
      request: CompleteLabAssetsRequest;
    };

function resolveCompleteLabAssetsInput(
  defaultLabId: string | undefined,
  input: CompleteLabAssetsMutationInput,
) {
  if ("request" in input) {
    return {
      labId: input.labId,
      request: input.request,
    };
  }

  if (!defaultLabId) {
    throw new Error("A lab id is required to complete lab assets.");
  }

  return {
    labId: defaultLabId,
    request: input,
  };
}

export function useCompleteLabAssets(labId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CompleteLabAssetsMutationInput) => {
      const resolved = resolveCompleteLabAssetsInput(labId, input);
      return completeLabAssets(resolved.labId, resolved.request);
    },
    onSuccess: (_data, input) => {
      const resolved = resolveCompleteLabAssetsInput(labId, input);
      queryClient.invalidateQueries({
        queryKey: labQueryKeys.detail(resolved.labId),
      });
      queryClient.invalidateQueries({ queryKey: classQueryKeys.all });
    },
  });
}

export function useUploadLabAssets() {
  return useMutation({
    mutationFn: ({
      upload,
      files,
      onStep,
    }: {
      upload: LabUploadDto;
      files: Parameters<typeof uploadLabAssets>[1];
      onStep?: (step: UploadStep) => void;
    }) => uploadLabAssets(upload, files, onStep),
  });
}

export function useRequirementUrl() {
  return useMutation({
    mutationFn: (labId: string) => getRequirementUrl(labId),
  });
}

export function useCollectionUrl() {
  return useMutation({
    mutationFn: (labId: string) => getCollectionUrl(labId),
  });
}
