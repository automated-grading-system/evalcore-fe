import { cn } from "@/lib/utils";

// ============================================================
// Skeleton — shape-matching placeholder for loading states.
// Use these to match the final layout, not generic spinners.
// ============================================================

type SkeletonProps = React.ComponentProps<"div">;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}
