import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function AdminLogsPage() {
  return (
    <PlaceholderPage
      title="System Logs"
      description="Audit trail of grading events, API calls, and system exceptions."
      endpoints={[
        "GET /api/admin/logs",
        "GET /api/admin/logs/evaluation",
      ]}
    />
  );
}
