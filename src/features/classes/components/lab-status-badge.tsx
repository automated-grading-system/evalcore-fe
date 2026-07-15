import { StatusBadge, type StatusTone } from "@/components/ui/status-badge";
import type { LabStatus } from "@/types/lab";

const STATUS_LABELS: Record<LabStatus, string> = {
  active: "Active",
  archived: "Archived",
  pending_assets: "Pending assets",
};

const STATUS_TONES: Record<LabStatus, StatusTone> = {
  active: "success",
  archived: "neutral",
  pending_assets: "warning",
};

export function LabStatusBadge({ status }: { status: LabStatus }) {
  return (
    <StatusBadge tone={STATUS_TONES[status]}>
      {STATUS_LABELS[status]}
    </StatusBadge>
  );
}
