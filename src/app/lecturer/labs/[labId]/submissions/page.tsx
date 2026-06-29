import { LecturerLabSubmissionsView } from "@/features/submissions/components/lecturer-lab-submissions-view";

interface LecturerLabSubmissionsPageProps {
  params: Promise<{
    labId: string;
  }>;
}

export default async function LecturerLabSubmissionsPage({
  params,
}: LecturerLabSubmissionsPageProps) {
  const { labId } = await params;
  return <LecturerLabSubmissionsView labId={labId} />;
}
