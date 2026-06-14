import * as React from "react";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types/api";

// ============================================================
// RoleBadge — displays role label with role-specific color.
// ============================================================

const ROLE_LABELS: Record<Role, string> = {
  student: "Student",
  lecturer: "Lecturer",
  admin: "Admin",
};

const ROLE_CLASSES: Record<Role, string> = {
  student:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  lecturer:
    "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  admin:
    "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
};

interface RoleBadgeProps {
  role: Role;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        ROLE_CLASSES[role],
        className,
      )}
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
