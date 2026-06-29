"use client";

import Link from "next/link";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/features/classes/components/formatters";
import { SubmissionStatusBadge } from "@/features/submissions/components/submission-status-badge";
import { useMySubmissions } from "@/features/submissions/hooks/use-submissions";

export function StudentSubmissionsView() {
  const submissionsQuery = useMySubmissions({ page: 1, pageSize: 20 });

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Submissions"
        description="History of your project ZIP submissions."
      />

      {submissionsQuery.isLoading ? (
        <Skeleton className="h-72 bg-zinc-900" />
      ) : null}

      {submissionsQuery.isError ? (
        <ApiErrorAlert error={submissionsQuery.error} />
      ) : null}

      {submissionsQuery.data ? (
        <Card className="border-zinc-800/70 bg-zinc-900/35">
          <CardHeader>
            <CardTitle>Recent submissions</CardTitle>
          </CardHeader>
          <CardContent>
            {submissionsQuery.data.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead>File</TableHead>
                    <TableHead>Attempt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissionsQuery.data.items.map((submission) => (
                    <TableRow
                      key={submission.id}
                      className="border-zinc-800 hover:bg-zinc-900/80"
                    >
                      <TableCell className="max-w-72 whitespace-normal">
                        <Link
                          href={`/student/labs/${submission.labId}`}
                          className="break-all text-zinc-100 hover:text-zinc-300"
                        >
                          {submission.projectFileName}
                        </Link>
                      </TableCell>
                      <TableCell>{submission.attemptNo}</TableCell>
                      <TableCell>
                        <SubmissionStatusBadge status={submission.status} />
                      </TableCell>
                      <TableCell>
                        {formatDateTime(submission.submittedAt)}
                      </TableCell>
                      <TableCell>
                        {formatDateTime(submission.updatedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="rounded-lg border border-zinc-800 bg-zinc-950/35 p-5 text-sm text-zinc-400">
                You have not submitted any project ZIP files yet.
              </p>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
