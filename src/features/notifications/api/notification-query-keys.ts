import type { NotificationListParams } from "@/features/notifications/api/notification-api";

export const notificationQueryKeys = {
  all: ["notifications"] as const,
  myLists: () => [...notificationQueryKeys.all, "my"] as const,
  myList: (params: NotificationListParams) =>
    [...notificationQueryKeys.myLists(), params] as const,
  unreadCount: () => [...notificationQueryKeys.all, "unread-count"] as const,
};
