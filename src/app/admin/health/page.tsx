import { PlaceholderPage } from "@/components/layout/placeholder-page";

export default function AdminHealthPage() {
  return (
    <PlaceholderPage
      title="Service Health"
      description="Monitor evaluation service uptime, resource usage, and microservice status."
      endpoints={[
        "GET /api/admin/health",
        "GET /api/admin/evaluation-health",
      ]}
    />
  );
}
