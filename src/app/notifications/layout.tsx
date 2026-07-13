"use client";

import { ProtectedLayout } from "@/components/auth/protected-layout";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuth } from "@/lib/auth/auth-context";

export default function NotificationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <ProtectedLayout>
      <DashboardShell role={user?.role ?? "student"} title="Notifications">
        {children}
      </DashboardShell>
    </ProtectedLayout>
  );
}
