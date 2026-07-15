import { BracesIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function Brand({
  compact,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/20">
        <BracesIcon className="size-4.5" aria-hidden="true" />
      </span>
      {!compact ? (
        <span className="min-w-0">
          <span className="block text-sm font-bold tracking-tight text-foreground">
            EvalCore
          </span>
          <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Automated evaluation
          </span>
        </span>
      ) : null}
    </div>
  );
}
