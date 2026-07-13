export interface NotificationDto {
  id: string;
  userId?: string | null;
  userEmail?: string | null;
  userFullName?: string | null;
  type?: string | null;
  title?: string | null;
  message?: string | null;
  referenceType?: string | null;
  referenceId?: string | null;
  evaluationId?: string | null;
  submissionId?: string | null;
  labId?: string | null;
  classId?: string | null;
  status?: string | null;
  isRead?: boolean | null;
  readAt?: string | null;
  createdAt?: string | null;
}

export interface UnreadNotificationCountDto {
  count: number;
}
