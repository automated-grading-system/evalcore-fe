import { StudentClassDetailView } from "@/features/classes/components/student-class-detail-view";

interface StudentClassDetailPageProps {
  params: Promise<{
    classId: string;
  }>;
}

export default async function StudentClassDetailPage({
  params,
}: StudentClassDetailPageProps) {
  const { classId } = await params;
  return <StudentClassDetailView classId={classId} />;
}
