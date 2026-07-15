"use client";

import Link from "next/link";
import { BellOffIcon, CheckCheck, ExternalLink, RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { EmptyState } from "@/components/layout/states";
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
import { getApiErrorMessage } from "@/lib/api/errors";
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

  function markOneRead(notificationId: string) {
    markReadMutation.mutate(notificationId, {
      onSuccess: () => toast.success("Notification marked as read."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  }

  function markAllRead() {
    markAllReadMutation.mutate(undefined, {
      onSuccess: () => toast.success("All notifications marked as read."),
      onError: (error) => toast.error(getApiErrorMessage(error)),
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Keep up with evaluation and submission updates."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={unreadCount > 0 ? "default" : "secondary"}
            className="h-8 px-3"
          >
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
            onClick={markAllRead}
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
        <EmptyState
          title="You’re all caught up"
          description="Evaluation and submission updates will appear here when they arrive."
          icon={<BellOffIcon className="size-5" />}
        />
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
                  isUnread
                    ? "border-primary/30 bg-primary/[0.045] shadow-sm"
                    : "bg-card/70"
                }
              >
                <CardContent className="flex flex-col gap-4 py-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <span
                      className={`mt-2 size-2 shrink-0 rounded-full ${isUnread ? "bg-primary ring-4 ring-primary/10" : "bg-border"}`}
                      aria-hidden="true"
                    />
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
                        onClick={() => markOneRead(notification.id)}
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
