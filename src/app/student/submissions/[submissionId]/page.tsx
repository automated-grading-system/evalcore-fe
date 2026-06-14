import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function StudentSubmissionDetailPage() {
  return (
    <PlaceholderPage
      title="Submission Detail"
      description="Detailed evaluation results, test logs, and score breakdown."
      endpoints={[
        "GET /api/submissions/{submissionId}",
        "GET /api/evaluations/submissions/{submissionId}",
      ]}
    />
  );
}
