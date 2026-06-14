import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function SearchClassesPage() {
  return (
    <PlaceholderPage
      title="Search Classes"
      description="Find and join classes by name or code."
      endpoints={[
        "GET /api/classes/search",
        "POST /api/classes/{classId}/join",
      ]}
    />
  );
}
