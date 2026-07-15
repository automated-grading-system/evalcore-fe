import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import type { SubmissionStatus } from "@/types/submission";

interface SubmissionStatusBadgeProps {
  status: SubmissionStatus;
}

const STATUS_LABELS: Record<string, string> = {
  pending_assets: "Pending assets",
  submitted: "Submitted",
  queued: "Queued",
  running: "Running",
  passed: "Passed",
  failed: "Failed",
  error: "Error",
};

const STATUS_TONES: Record<string, StatusTone> = {
  pending_assets: "warning",
  submitted: "success",
  queued: "info",
  running: "info",
  passed: "success",
  failed: "danger",
  error: "danger",
};

export function SubmissionStatusBadge({ status }: SubmissionStatusBadgeProps) {
  const label =
    typeof status === "string" && status.length > 0
      ? (STATUS_LABELS[status] ?? status.replaceAll("_", " "))
      : "Unknown";

  return (
    <StatusBadge
      tone={STATUS_TONES[status] ?? "neutral"}
      pulse={status === "running"}
      className="capitalize"
    >
      {label}
    </StatusBadge>
  );
}
