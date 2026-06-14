import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function LecturerClassDetailPage() {
  return (
    <PlaceholderPage
      title="Class Detail"
      description="Manage enrolled students, assign labs, and view class-level results."
      endpoints={[
        "GET /api/classes/{classId}",
        "GET /api/classes/{classId}/students",
        "POST /api/classes/{classId}/students",
      ]}
    />
  );
}
