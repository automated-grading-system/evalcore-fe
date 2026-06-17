import { LecturerClassDetailView } from "@/features/classes/components/lecturer-class-detail-view";

interface LecturerClassDetailPageProps {
  params: Promise<{
    classId: string;
  }>;
}

export default async function LecturerClassDetailPage({
  params,
}: LecturerClassDetailPageProps) {
  const { classId } = await params;
  return <LecturerClassDetailView classId={classId} />;
}
