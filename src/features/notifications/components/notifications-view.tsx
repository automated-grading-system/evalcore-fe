"use client";

import Link from "next/link";
import { CheckCheck, ExternalLink, RefreshCw } from "lucide-react";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/features/classes/components/formatters";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useMyNotifications,
  useUnreadNotificationCount,
} from "@/features/notifications/hooks/use-notifications";
import { useAuth } from "@/lib/auth/auth-context";
import type { NotificationDto } from "@/types/notification";

function notificationReference(notification: NotificationDto): string | null {
  if (notification.evaluationId)
    return `Evaluation ${notification.evaluationId}`;
  if (notification.submissionId)
    return `Submission ${notification.submissionId}`;
  if (notification.labId) return `Lab ${notification.labId}`;
  if (notification.classId) return `Class ${notification.classId}`;
  if (notification.referenceType && notification.referenceId) {
    return `${notification.referenceType} ${notification.referenceId}`;
  }
  return null;
}

function relatedHref(
  notification: NotificationDto,
  role?: string,
): string | null {
  if (role === "student" && notification.submissionId) {
    return `/student/submissions/${notification.submissionId}`;
  }
  return null;
}

export function NotificationsView() {
  const { user } = useAuth();
  const notificationsQuery = useMyNotifications();
  const unreadCountQuery = useUnreadNotificationCount();
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const notifications = notificationsQuery.data?.items ?? [];
  const unreadCount = unreadCountQuery.data?.count ?? 0;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Keep up with evaluation and submission updates."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={unreadCount > 0 ? "default" : "secondary"}>
            {unreadCount} unread
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              Promise.all([
                notificationsQuery.refetch(),
                unreadCountQuery.refetch(),
              ])
            }
            disabled={notificationsQuery.isFetching}
          >
            <RefreshCw
              className={notificationsQuery.isFetching ? "animate-spin" : ""}
            />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={() => markAllReadMutation.mutate()}
            disabled={unreadCount === 0 || markAllReadMutation.isPending}
          >
            <CheckCheck />
            Mark all as read
          </Button>
        </div>
      </PageHeader>

      {notificationsQuery.isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : null}

      {notificationsQuery.isError ? (
        <ApiErrorAlert
          error={notificationsQuery.error}
          title="Notifications could not be loaded"
        />
      ) : null}

      {!notificationsQuery.isLoading &&
      !notificationsQuery.isError &&
      notifications.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No notifications yet.
          </CardContent>
        </Card>
      ) : null}

      {!notificationsQuery.isLoading &&
      !notificationsQuery.isError &&
      notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const isUnread = notification.isRead !== true;
            const href = relatedHref(notification, user?.role);
            const reference = notificationReference(notification);

            return (
              <Card
                key={notification.id}
                className={
                  isUnread ? "border-primary/40 bg-primary/[0.04]" : ""
                }
              >
                <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold text-foreground">
                        {notification.title || "Notification"}
                      </h2>
                      <Badge variant={isUnread ? "default" : "secondary"}>
                        {isUnread ? "Unread" : "Read"}
                      </Badge>
                    </div>
                    {notification.message ? (
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {notification.message}
                      </p>
                    ) : null}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{formatDateTime(notification.createdAt)}</span>
                      {reference ? <span>{reference}</span> : null}
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {href ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={href}>
                          View submission
                          <ExternalLink />
                        </Link>
                      </Button>
                    ) : null}
                    {isUnread ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markReadMutation.mutate(notification.id)}
                        disabled={markReadMutation.isPending}
                      >
                        Mark as read
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
