import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function LecturerLabResultsPage() {
  return (
    <PlaceholderPage
      title="Results"
      description="Consolidated grading results for this lab. Export to CSV or Excel."
      endpoints={[
        "GET /api/labs/{labId}/results",
        "GET /api/labs/{labId}/results/export",
      ]}
    />
  );
}
