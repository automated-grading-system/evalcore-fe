import { InboxIcon, LoaderCircleIcon, TriangleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-56 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/55 px-6 py-12 text-center",
        className,
      )}
    >
      <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        {icon ?? <InboxIcon className="size-5" />}
      </span>
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function LoadingState({
  label = "Loading",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-40 items-center justify-center gap-3 rounded-xl border border-border/70 bg-card/50 text-sm text-muted-foreground",
        className,
      )}
      role="status"
    >
      <LoaderCircleIcon className="size-4 animate-spin text-primary" />
      <span>{label}</span>
    </div>
  );
}

export function InlineErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive sm:flex-row sm:items-center sm:justify-between">
      <span className="flex items-center gap-2">
        <TriangleAlertIcon className="size-4 shrink-0" />
        {message}
      </span>
      {onRetry ? (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}
