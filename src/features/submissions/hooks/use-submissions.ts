"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  completeSubmissionAssets,
  createSubmission,
  getLabSubmissions,
  getMySubmissionForLab,
  getMySubmissions,
  getSubmissionDetail,
  getSubmissionSourceUrl,
  uploadSubmissionZip,
  type SubmissionListParams,
} from "@/features/submissions/api/submission-api";
import { submissionQueryKeys } from "@/features/submissions/api/submission-query-keys";
import type {
  CreateSubmissionRequest,
  SubmissionDto,
} from "@/types/submission";

const DEFAULT_PAGE: Required<SubmissionListParams> = {
  page: 1,
  pageSize: 20,
};

export function useMySubmissions(
  params: SubmissionListParams = DEFAULT_PAGE,
) {
  return useQuery({
    queryKey: submissionQueryKeys.myList(params),
    queryFn: () => getMySubmissions(params),
  });
}

export function useMySubmissionForLab(labId: string) {
  return useQuery({
    queryKey: submissionQueryKeys.myForLab(labId),
    queryFn: () => getMySubmissionForLab(labId),
    enabled: Boolean(labId),
    retry: (failureCount, error) => {
      if (
        error instanceof Error &&
        "status" in error &&
        (error as { status?: number }).status === 404
      ) {
        return false;
      }
      return failureCount < 2;
    },
  });
}

export function useLabSubmissions(
  labId: string,
  params: SubmissionListParams = DEFAULT_PAGE,
) {
  return useQuery({
    queryKey: submissionQueryKeys.labList(labId, params),
    queryFn: () => getLabSubmissions(labId, params),
    enabled: Boolean(labId),
  });
}

export function useSubmissionDetail(submissionId: string) {
  return useQuery({
    queryKey: submissionQueryKeys.detail(submissionId),
    queryFn: () => getSubmissionDetail(submissionId),
    enabled: Boolean(submissionId),
  });
}

export function useSubmitSubmissionZip(labId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      notes,
      onStep,
    }: {
      file: File;
      notes?: string;
      onStep?: (step: "creating" | "uploading" | "completing") => void;
    }): Promise<SubmissionDto> => {
      const request: CreateSubmissionRequest = {
        projectFileName: file.name,
        notes: notes?.trim() ? notes.trim() : null,
      };

      onStep?.("creating");
      const created = await createSubmission(labId, request);

      onStep?.("uploading");
      await uploadSubmissionZip(created.upload.projectUploadUrl, file);

      onStep?.("completing");
      await completeSubmissionAssets(created.submission.id, {
        projectUploaded: true,
      });

      return {
        ...created.submission,
        status: "submitted",
        updatedAt: new Date().toISOString(),
      };
    },
    onSuccess: (submission) => {
      queryClient.setQueryData(
        submissionQueryKeys.myForLab(labId),
        submission,
      );
      queryClient.setQueryData(
        submissionQueryKeys.detail(submission.id),
        submission,
      );
      queryClient.invalidateQueries({
        queryKey: submissionQueryKeys.myLists(),
      });
      queryClient.invalidateQueries({
        queryKey: submissionQueryKeys.myForLab(labId),
      });
      queryClient.invalidateQueries({
        queryKey: submissionQueryKeys.labRoot(labId),
      });
    },
  });
}

export function useSubmissionSourceUrl() {
  return useMutation({
    mutationFn: (submissionId: string) => getSubmissionSourceUrl(submissionId),
  });
}
