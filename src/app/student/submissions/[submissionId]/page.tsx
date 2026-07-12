import { StudentSubmissionDetailView } from "@/features/submissions/components/student-submission-detail-view";

interface StudentSubmissionDetailPageProps {
  params: Promise<{ submissionId: string }>;
}

export default async function StudentSubmissionDetailPage({
  params,
}: StudentSubmissionDetailPageProps) {
  const { submissionId } = await params;
  return <StudentSubmissionDetailView submissionId={submissionId} />;
}
