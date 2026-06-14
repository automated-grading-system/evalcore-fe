import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function StudentSubmissionsPage() {
  return (
    <PlaceholderPage
      title="Submissions"
      description="History of all your project submissions and evaluation results."
      endpoints={["GET /api/submissions/my"]}
    />
  );
}
