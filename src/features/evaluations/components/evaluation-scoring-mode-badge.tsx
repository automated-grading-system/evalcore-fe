import { Badge } from "@/components/ui/badge";
import type { EvaluationScoringMode } from "@/types/evaluation";

export function formatScoringMode(
  scoringMode: EvaluationScoringMode | null | undefined,
): string | null {
  if (!scoringMode) return null;
  if (scoringMode === "weighted_rubric") return "Weighted rubric";
  if (scoringMode === "equal_assertions") return "Equal assertions";

  return scoringMode
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function EvaluationScoringModeBadge({
  scoringMode,
}: {
  scoringMode: EvaluationScoringMode | null | undefined;
}) {
  const label = formatScoringMode(scoringMode);
  if (!label) return null;

  return (
    <Badge variant="outline" className="bg-muted/30 font-medium">
      {label}
    </Badge>
  );
}
