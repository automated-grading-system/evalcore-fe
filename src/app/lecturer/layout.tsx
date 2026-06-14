import { ProtectedLayout } from "@/components/auth/protected-layout";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedLayout>
      <DashboardShell role="lecturer" title="Lecturer Dashboard">
        {children}
      </DashboardShell>
    </ProtectedLayout>
  );
}
