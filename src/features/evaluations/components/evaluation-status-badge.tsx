import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import type { EvaluationStatus } from "@/types/evaluation";

interface EvaluationStatusBadgeProps {
  status: EvaluationStatus | null | undefined;
}

const STATUS_LABELS: Record<string, string> = {
  queued: "Queued",
  running: "Running",
  passed: "Passed",
  failed: "Failed",
  error: "Error",
};

const STATUS_TONES: Record<string, StatusTone> = {
  queued: "info",
  running: "info",
  passed: "success",
  failed: "danger",
  error: "danger",
};

export function EvaluationStatusBadge({ status }: EvaluationStatusBadgeProps) {
  const normalizedStatus = typeof status === "string" ? status : "";
  const label = normalizedStatus
    ? (STATUS_LABELS[normalizedStatus] ?? normalizedStatus.replaceAll("_", " "))
    : "Unknown";

  return (
    <StatusBadge
      tone={STATUS_TONES[normalizedStatus] ?? "neutral"}
      pulse={normalizedStatus === "running"}
      className="capitalize"
    >
      {label}
    </StatusBadge>
  );
}
