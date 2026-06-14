import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function LecturerLabsPage() {
  return (
    <PlaceholderPage
      title="Labs"
      description="Create and manage lab assignments with Postman test collections."
      endpoints={[
        "GET /api/labs",
        "POST /api/labs",
      ]}
    />
  );
}
