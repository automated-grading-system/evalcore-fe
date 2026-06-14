import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function LecturerLabSubmissionsPage() {
  return (
    <PlaceholderPage
      title="Submissions"
      description="Review student project submissions for this lab."
      endpoints={[
        "GET /api/labs/{labId}/submissions",
      ]}
    />
  );
}
