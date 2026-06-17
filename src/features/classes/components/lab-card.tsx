import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { LabDto } from "@/types/lab";
import { formatDateTime } from "@/features/classes/components/formatters";
import { LabStatusBadge } from "@/features/classes/components/lab-status-badge";

interface LabCardProps {
  lab: LabDto;
  href: string;
  actionLabel?: string;
}

export function LabCard({
  lab,
  href,
  actionLabel = "Open lab",
}: LabCardProps) {
  return (
    <Card className="border-zinc-800/70 bg-zinc-900/35">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={href}
              className="text-base font-medium text-zinc-100 transition-colors hover:text-white"
            >
              {lab.title}
            </Link>
            <LabStatusBadge status={lab.status} />
          </div>
          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {lab.description ?? "No description provided."}
          </p>
          <p className="mt-4 text-xs text-zinc-500">
            Deadline {formatDateTime(lab.deadline)}
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link href={href}>{actionLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
