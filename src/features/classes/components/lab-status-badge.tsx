import { Badge } from "@/components/ui/badge";
import type { LabStatus } from "@/types/lab";

const STATUS_LABELS: Record<LabStatus, string> = {
  active: "Active",
  archived: "Archived",
  pending_assets: "Pending assets",
};

const STATUS_CLASSES: Record<LabStatus, string> = {
  active: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
  archived: "border-zinc-700 bg-zinc-800/70 text-zinc-300",
  pending_assets: "border-amber-500/20 bg-amber-500/10 text-amber-300",
};

export function LabStatusBadge({ status }: { status: LabStatus }) {
  return (
    <Badge variant="outline" className={STATUS_CLASSES[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
