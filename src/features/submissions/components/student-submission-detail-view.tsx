"use client";

import Link from "next/link";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateTime } from "@/features/classes/components/formatters";
import { EvaluationCard } from "@/features/evaluations/components/evaluation-card";
import { SubmissionStatusBadge } from "@/features/submissions/components/submission-status-badge";
import { useSubmissionDetail } from "@/features/submissions/hooks/use-submissions";

interface StudentSubmissionDetailViewProps {
  submissionId: string;
}

export function StudentSubmissionDetailView({
  submissionId,
}: StudentSubmissionDetailViewProps) {
  const submissionQuery = useSubmissionDetail(submissionId);

  if (submissionQuery.isLoading) {
    return (
      <div className="flex max-w-5xl flex-col gap-6">
        <Skeleton className="h-24" />
        <Skeleton className="h-56" />
      </div>
    );
  }

  if (submissionQuery.isError) {
    return <ApiErrorAlert error={submissionQuery.error} />;
  }

  if (!submissionQuery.data) return null;

  const submission = submissionQuery.data;

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Submission evaluation"
        description="Review your submitted project and its automated evaluation result."
      >
        <Button asChild variant="outline">
          <Link href={`/student/labs/${submission.labId}`}>Open lab</Link>
        </Button>
      </PageHeader>

      <Card className="border-border/60 bg-card/60 shadow-sm">
        <CardContent className="grid gap-5 p-5 sm:grid-cols-4">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Submission status
            </p>
            <div className="mt-2">
              <SubmissionStatusBadge status={submission.status} />
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Attempt
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {submission.attemptNo}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              File
            </p>
            <p className="mt-1 break-all text-sm font-medium text-foreground">
              {submission.projectFileName}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Submitted
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {formatDateTime(submission.submittedAt)}
            </p>
          </div>
        </CardContent>
      </Card>

      <EvaluationCard submissionId={submission.id} />
    </div>
  );
}
