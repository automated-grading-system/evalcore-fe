import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function LecturerClassesPage() {
  return (
    <PlaceholderPage
      title="Classes"
      description="Create and manage your classes. Add students and assign labs."
      endpoints={["GET /api/classes", "POST /api/classes"]}
    />
  );
}
