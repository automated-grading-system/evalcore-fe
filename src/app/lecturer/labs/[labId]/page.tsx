import { LecturerLabDetailView } from "@/features/classes/components/lecturer-lab-detail-view";

interface LecturerLabDetailPageProps {
  params: Promise<{
    labId: string;
  }>;
}

export default async function LecturerLabDetailPage({
  params,
}: LecturerLabDetailPageProps) {
  const { labId } = await params;
  return <LecturerLabDetailView labId={labId} />;
}
