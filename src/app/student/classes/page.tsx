import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function StudentClassesPage() {
  return (
    <PlaceholderPage
      title="My Classes"
      description="All classes you have joined will appear here."
      endpoints={["GET /api/classes/my"]}
    />
  );
}
