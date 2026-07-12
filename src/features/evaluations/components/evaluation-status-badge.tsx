import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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

const STATUS_CLASSES: Record<string, string> = {
  queued: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  running: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  passed: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  failed: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  error: "border-red-500/20 bg-red-500/10 text-red-300",
};

export function EvaluationStatusBadge({ status }: EvaluationStatusBadgeProps) {
  const normalizedStatus = typeof status === "string" ? status : "";
  const label = normalizedStatus
    ? STATUS_LABELS[normalizedStatus] ?? normalizedStatus.replaceAll("_", " ")
    : "Unknown";

  return (
    <Badge
      variant="outline"
      className={cn(
        "capitalize",
        STATUS_CLASSES[normalizedStatus] ??
          "border-zinc-700 bg-zinc-800/60 text-zinc-300",
      )}
    >
      {label}
    </Badge>
  );
}
