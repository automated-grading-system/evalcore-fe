import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function LecturerResultsPage() {
  return (
    <PlaceholderPage
      title="Results"
      description="Overall results across all your labs and classes."
      endpoints={[
        "GET /api/lecturer/results",
      ]}
    />
  );
}
