import { ProtectedLayout } from "@/components/auth/protected-layout";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <DashboardShell role="admin" title="Admin Dashboard">
        {children}
      </DashboardShell>
    </ProtectedLayout>
  );
}
