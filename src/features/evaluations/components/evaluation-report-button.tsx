"use client";

import { DownloadIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useEvaluationReportUrl } from "@/features/evaluations/hooks/use-evaluations";
import { getApiErrorMessage } from "@/lib/api/errors";

interface EvaluationReportButtonProps {
  evaluationId: string;
}

export function EvaluationReportButton({
  evaluationId,
}: EvaluationReportButtonProps) {
  const reportUrlMutation = useEvaluationReportUrl();

  async function handleDownload() {
    try {
      const { reportUrl } = await reportUrlMutation.mutateAsync(evaluationId);
      window.open(reportUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={reportUrlMutation.isPending}
      onClick={handleDownload}
    >
      <DownloadIcon className="size-3.5" />
      Download report
    </Button>
  );
}
