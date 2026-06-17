import { StudentLabDetailView } from "@/features/classes/components/student-lab-detail-view";

interface StudentLabDetailPageProps {
  params: Promise<{
    labId: string;
  }>;
}

export default async function StudentLabDetailPage({
  params,
}: StudentLabDetailPageProps) {
  const { labId } = await params;
  return <StudentLabDetailView labId={labId} />;
}
