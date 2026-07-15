import Link from "next/link";
import { BookOpenIcon } from "lucide-react";

import { EmptyState } from "@/components/layout/states";
import { Button } from "@/components/ui/button";

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
    <EmptyState
      title={title}
      description={description}
      icon={<BookOpenIcon className="size-5" />}
      action={
        actionHref && actionLabel ? (
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : undefined
      }
    />
  );
}
