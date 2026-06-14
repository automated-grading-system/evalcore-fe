import { ProtectedLayout } from "@/components/auth/protected-layout";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <DashboardShell role="student" title="Student Dashboard">
        {children}
      </DashboardShell>
    </ProtectedLayout>
  );
}
