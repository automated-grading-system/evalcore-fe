import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function StudentLabPage() {
  return (
    <PlaceholderPage
      title="Lab Detail"
      description="View lab instructions, requirements, and submit your project ZIP."
      endpoints={[
        "GET /api/labs/{labId}",
        "POST /api/labs/{labId}/submissions",
      ]}
    />
  );
}
