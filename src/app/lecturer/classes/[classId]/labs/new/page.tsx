import { LecturerCreateLabView } from "@/features/classes/components/lecturer-create-lab-view";

interface LecturerCreateLabPageProps {
  params: Promise<{
    classId: string;
  }>;
}

export default async function LecturerCreateLabPage({
  params,
}: LecturerCreateLabPageProps) {
  const { classId } = await params;
  return <LecturerCreateLabView classId={classId} />;
}
