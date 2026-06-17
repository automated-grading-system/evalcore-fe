export interface ClassDto {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClassMemberDto {
  id: string;
  classId: string;
  studentId: string;
  studentName: string | null;
  studentEmail: string | null;
  joinedAt: string;
}

export interface CreateClassRequest {
  name: string;
  description?: string | null;
}

export interface UpdateClassRequest {
  name: string;
  description?: string | null;
}
