import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function StudentClassDetailPage() {
  return (
    <PlaceholderPage
      title="Class Detail"
      description="View lab assignments and submission history for this class."
      endpoints={[
        "GET /api/classes/{classId}",
        "GET /api/classes/{classId}/labs",
      ]}
    />
  );
}
