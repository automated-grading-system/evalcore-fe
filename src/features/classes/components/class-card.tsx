import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ClassDto } from "@/types/class";
import { formatDate } from "@/features/classes/components/formatters";

interface ClassCardProps {
  classItem: ClassDto;
  href: string;
  actionLabel?: string;
  children?: React.ReactNode;
}

export function ClassCard({
  classItem,
  href,
  actionLabel = "Open",
  children,
}: ClassCardProps) {
  return (
    <Card className="border-zinc-800/70 bg-zinc-900/35">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <Link
            href={href}
            className="text-base font-medium text-zinc-100 transition-colors hover:text-white"
          >
            {classItem.name}
          </Link>
          <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
            {classItem.description ?? "No description provided."}
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500">
            <span>Created {formatDate(classItem.createdAt)}</span>
            <span>Updated {formatDate(classItem.updatedAt)}</span>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {children}
          <Button asChild variant="outline" size="sm">
            <Link href={href}>{actionLabel}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
