import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TONES = {
  neutral: "border-border bg-muted text-muted-foreground",
  success:
    "border-emerald-600/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning:
    "border-amber-600/25 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger: "border-red-600/25 bg-red-500/10 text-red-700 dark:text-red-300",
  info: "border-blue-600/25 bg-blue-500/10 text-blue-700 dark:text-blue-300",
} as const;

export type StatusTone = keyof typeof TONES;

export function StatusBadge({
  children,
  tone = "neutral",
  pulse,
  className,
}: {
  children: React.ReactNode;
  tone?: StatusTone;
  pulse?: boolean;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-semibold", TONES[tone], className)}
    >
      <span className="relative flex size-1.5" aria-hidden="true">
        {pulse ? (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-50" />
        ) : null}
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      {children}
    </Badge>
  );
}
