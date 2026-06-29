import type { SubmissionListParams } from "@/features/submissions/api/submission-api";

export const submissionQueryKeys = {
  all: ["submissions"] as const,
  myLists: () => [...submissionQueryKeys.all, "my"] as const,
  myList: (params: SubmissionListParams) =>
    [...submissionQueryKeys.myLists(), params] as const,
  myForLab: (labId: string) =>
    [...submissionQueryKeys.myLists(), "lab", labId] as const,
  labLists: () => [...submissionQueryKeys.all, "lab"] as const,
  labRoot: (labId: string) =>
    [...submissionQueryKeys.labLists(), labId] as const,
  labList: (labId: string, params: SubmissionListParams) =>
    [...submissionQueryKeys.labRoot(labId), params] as const,
  details: () => [...submissionQueryKeys.all, "detail"] as const,
  detail: (submissionId: string) =>
    [...submissionQueryKeys.details(), submissionId] as const,
};
