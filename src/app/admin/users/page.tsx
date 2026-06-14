import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function AdminUsersPage() {
  return (
    <PlaceholderPage
      title="Users"
      description="Manage user accounts, roles, and access restrictions."
      endpoints={[
        "GET /api/admin/users",
        "PATCH /api/admin/users/{userId}/lock",
        "PATCH /api/admin/users/{userId}/unlock",
      ]}
    />
  );
}
