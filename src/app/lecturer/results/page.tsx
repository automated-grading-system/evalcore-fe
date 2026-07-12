import Link from "next/link";

import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LecturerResultsPage() {
  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <PageHeader
        title="Results"
        description="Evaluation results are shown with each lab submission, including score, status, errors, and step details."
      />
      <Card className="border-border/60 bg-card/60 shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-sm text-muted-foreground">
            Open a lab to review the latest evaluation for every student submission.
            Active evaluations refresh automatically until they finish.
          </p>
          <Button asChild>
            <Link href="/lecturer/labs">Open labs</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
