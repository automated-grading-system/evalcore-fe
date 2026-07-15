import type { ClassListParams, ClassSearchParams } from "@/features/classes/api/class-api";

export const classQueryKeys = {
  all: ["classes"] as const,
  lecturerLists: () => [...classQueryKeys.all, "lecturer"] as const,
  lecturerList: (params: ClassListParams) =>
    [...classQueryKeys.lecturerLists(), params] as const,
  myLists: () => [...classQueryKeys.all, "my"] as const,
  myList: (params: ClassListParams) =>
    [...classQueryKeys.myLists(), params] as const,
  searches: () => [...classQueryKeys.all, "search"] as const,
  search: (params: ClassSearchParams) =>
    [...classQueryKeys.searches(), params] as const,
  details: () => [...classQueryKeys.all, "detail"] as const,
  detail: (classId: string) => [...classQueryKeys.details(), classId] as const,
  membersRoot: (classId: string) =>
    [...classQueryKeys.detail(classId), "members"] as const,
  members: (classId: string, params: ClassListParams) =>
    [...classQueryKeys.membersRoot(classId), params] as const,
  labsRoot: (classId: string) =>
    [...classQueryKeys.detail(classId), "labs"] as const,
  labs: (classId: string, params: ClassListParams) =>
    [...classQueryKeys.labsRoot(classId), params] as const,
};

export const labQueryKeys = {
  all: ["labs"] as const,
  details: () => [...labQueryKeys.all, "detail"] as const,
  detail: (labId: string) => [...labQueryKeys.details(), labId] as const,
  rubrics: () => [...labQueryKeys.all, "rubric"] as const,
  rubric: (labId: string) => [...labQueryKeys.rubrics(), labId] as const,
};
