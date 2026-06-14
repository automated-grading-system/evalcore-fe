import { Badge } from "@/components/ui/badge";

// ============================================================
// PlaceholderPage — standard shell for routes not yet
// connected to real data. Clearly signals integration status.
// ============================================================

interface PlaceholderPageProps {
  title: string;
  description: string;
  endpoints?: string[];
}

export function PlaceholderPage({
  title,
  description,
  endpoints = [],
}: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
            <Badge variant="warning">Integration pending</Badge>
          </div>
          <p className="text-sm text-muted-foreground max-w-[60ch]">
            {description}
          </p>
        </div>
      </div>

      {endpoints.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
            Expected API endpoints
          </p>
          <ul className="space-y-1.5">
            {endpoints.map((ep) => (
              <li
                key={ep}
                className="font-mono text-xs text-foreground bg-muted rounded px-2 py-1"
              >
                {ep}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 gap-3">
        <div className="h-8 w-8 rounded-lg border-2 border-border flex items-center justify-center">
          <span className="text-muted-foreground text-xs">—</span>
        </div>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Data will appear here once the backend service is integrated.
        </p>
      </div>
    </div>
  );
}
