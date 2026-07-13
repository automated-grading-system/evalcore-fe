"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationListParams,
} from "@/features/notifications/api/notification-api";
import { notificationQueryKeys } from "@/features/notifications/api/notification-query-keys";

const DEFAULT_PAGE: Required<NotificationListParams> = {
  page: 1,
  pageSize: 20,
};

const UNREAD_COUNT_POLL_INTERVAL_MS = 30_000;

export function useMyNotifications(
  params: NotificationListParams = DEFAULT_PAGE,
) {
  return useQuery({
    queryKey: notificationQueryKeys.myList(params),
    queryFn: () => getMyNotifications(params),
  });
}

export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
    refetchInterval: UNREAD_COUNT_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}

function invalidateNotificationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.invalidateQueries({ queryKey: notificationQueryKeys.myLists() });
  queryClient.invalidateQueries({
    queryKey: notificationQueryKeys.unreadCount(),
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => invalidateNotificationQueries(queryClient),
  });
}
