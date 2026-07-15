import { LiveGradingMonitorView } from "@/features/evaluations/components/live-grading-monitor-view";

interface LiveGradingPageProps {
  searchParams: Promise<{
    classId?: string | string[];
    labId?: string | string[];
  }>;
}

function firstQueryValue(value: string | string[] | undefined) {
  const resolved = Array.isArray(value) ? value[0] : value;
  return resolved?.trim() || undefined;
}

export default async function LiveGradingPage({
  searchParams,
}: LiveGradingPageProps) {
  const params = await searchParams;
  const filters = {
    classId: firstQueryValue(params.classId),
    labId: firstQueryValue(params.labId),
  };

  return <LiveGradingMonitorView filters={filters} />;
}
