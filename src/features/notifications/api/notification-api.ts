import { apiGet, apiPatch } from "@/lib/api/client";
import type { PagedResponse } from "@/types/api";
import type {
  NotificationDto,
  UnreadNotificationCountDto,
} from "@/types/notification";

export interface NotificationListParams {
  page?: number;
  pageSize?: number;
}

function pagingParams(params: NotificationListParams = {}) {
  return {
    page: params.page ?? 1,
    pageSize: params.pageSize ?? 20,
  };
}

export function getMyNotifications(
  params: NotificationListParams = {},
): Promise<PagedResponse<NotificationDto>> {
  return apiGet<PagedResponse<NotificationDto>>("/api/notifications/my", {
    params: pagingParams(params),
  });
}

export function getUnreadNotificationCount(): Promise<UnreadNotificationCountDto> {
  return apiGet<UnreadNotificationCountDto>(
    "/api/notifications/my/unread-count",
  );
}

export function markNotificationRead(notificationId: string): Promise<void> {
  return apiPatch<void>(`/api/notifications/${notificationId}/read`);
}

export function markAllNotificationsRead(): Promise<void> {
  return apiPatch<void>("/api/notifications/my/read-all");
}
