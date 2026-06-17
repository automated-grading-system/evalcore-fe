import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ClassEmptyStateProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function ClassEmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: ClassEmptyStateProps) {
  return (
    <Card className="flex flex-col items-center justify-center gap-4 border-dashed border-zinc-800/80 bg-zinc-950/40 px-6 py-14 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900/70">
        <span className="font-mono text-xs text-zinc-500">EC</span>
      </div>
      <div>
        <h3 className="text-base font-medium text-zinc-100">{title}</h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
          {description}
        </p>
      </div>
      {actionHref && actionLabel && (
        <Button asChild className="mt-1">
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </Card>
  );
}
