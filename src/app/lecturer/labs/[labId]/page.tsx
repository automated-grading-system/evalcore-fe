import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function LecturerLabDetailPage() {
  return (
    <PlaceholderPage
      title="Lab Detail"
      description="Configure lab requirements and Postman collection for automated evaluation."
      endpoints={[
        "GET /api/labs/{labId}",
        "PUT /api/labs/{labId}",
      ]}
    />
  );
}
