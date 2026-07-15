"use client";

import { useMemo, useState } from "react";
import { ListPlusIcon, SaveIcon, SparklesIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useLabRubric,
  useUpdateLabRubric,
} from "@/features/classes/hooks/use-classes";
import { getApiErrorMessage, isApiClientError } from "@/lib/api/errors";
import type { LabGradingCriterionDto, RubricMatchType } from "@/types/lab";

interface LabRubricEditorProps {
  labId: string;
}

interface EditableCriterion extends LabGradingCriterionDto {
  editorId: string;
}

const MATCH_TYPES: Array<{ value: RubricMatchType; label: string }> = [
  { value: "contains", label: "Contains" },
  { value: "exact", label: "Exact" },
  { value: "prefix", label: "Prefix" },
  { value: "regex", label: "Regular expression" },
];

const PRN232_CHECKLIST_TEMPLATE: LabGradingCriterionDto[] = [
  {
    key: "three_layer_architecture",
    title: "3-layer Architecture",
    description: "API, service, and repository responsibilities are separated.",
    maxScore: 1.2,
    sortOrder: 1,
    matchType: "contains",
    matchPattern: "3-layer Architecture",
    isRequired: true,
  },
  {
    key: "project_naming_convention",
    title: "Project Naming Convention",
    description:
      "Projects and namespaces follow the required PRN232 naming convention.",
    maxScore: 0.4,
    sortOrder: 2,
    matchType: "contains",
    matchPattern: "Project Naming Convention",
    isRequired: true,
  },
  {
    key: "db_schema_seed_data",
    title: "DB Schema & Seed Data",
    description:
      "The database schema starts successfully and required seed data is available.",
    maxScore: 0.8,
    sortOrder: 3,
    matchType: "contains",
    matchPattern: "DB Schema & Seed Data",
    isRequired: true,
  },
  {
    key: "four_model_types",
    title: "4 Model Types",
    description:
      "The solution uses the required entity, business, request, and response model types.",
    maxScore: 1,
    sortOrder: 4,
    matchType: "contains",
    matchPattern: "4 Model Types",
    isRequired: true,
  },
  {
    key: "restful_endpoint_naming",
    title: "RESTful Endpoint Naming",
    description: "Resource routes and HTTP methods follow REST conventions.",
    maxScore: 0.7,
    sortOrder: 5,
    matchType: "contains",
    matchPattern: "RESTful Endpoint Naming",
    isRequired: true,
  },
  {
    key: "get_by_id",
    title: "GET by ID",
    description: "A resource can be retrieved by its stable identifier.",
    maxScore: 0.6,
    sortOrder: 6,
    matchType: "contains",
    matchPattern: "GET by ID",
    isRequired: true,
  },
  {
    key: "list_api_capabilities",
    title: "List API Capabilities",
    description:
      "List APIs support the required searching, sorting, shaping, and expansion behavior.",
    maxScore: 1.5,
    sortOrder: 7,
    matchType: "contains",
    matchPattern: "List API Capabilities",
    isRequired: true,
  },
  {
    key: "pagination_metadata",
    title: "Pagination Metadata",
    description: "Paged responses expose accurate page and total metadata.",
    maxScore: 0.4,
    sortOrder: 8,
    matchType: "contains",
    matchPattern: "Pagination Metadata",
    isRequired: true,
  },
  {
    key: "response_format_http_status",
    title: "Response Format & HTTP Status",
    description:
      "Responses use the required envelope, content type, and HTTP status codes.",
    maxScore: 0.8,
    sortOrder: 9,
    matchType: "contains",
    matchPattern: "Response Format & HTTP Status",
    isRequired: true,
  },
  {
    key: "docker_deployment",
    title: "Docker Deployment",
    description:
      "The submitted application builds and becomes healthy in its isolated Compose stack.",
    maxScore: 1,
    sortOrder: 10,
    matchType: "contains",
    matchPattern: "Docker Deployment",
    isRequired: true,
  },
  {
    key: "swagger_openapi",
    title: "Swagger/OpenAPI",
    description: "The application publishes a usable OpenAPI document.",
    maxScore: 0.5,
    sortOrder: 11,
    matchType: "contains",
    matchPattern: "Swagger/OpenAPI",
    isRequired: true,
  },
  {
    key: "code_quality",
    title: "Code Quality",
    description:
      "Automated runtime checks cover maintainability-related validation and error handling behavior.",
    maxScore: 1.1,
    sortOrder: 12,
    matchType: "contains",
    matchPattern: "Code Quality",
    isRequired: true,
  },
];

let nextEditorId = 0;

function toEditableCriterion(
  criterion: LabGradingCriterionDto,
): EditableCriterion {
  nextEditorId += 1;
  return {
    ...criterion,
    maxScore: Number(criterion.maxScore),
    editorId: `rubric-criterion-${nextEditorId}`,
  };
}

function formatScore(value: number): string {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function normalizeCriteria(
  criteria: EditableCriterion[],
): LabGradingCriterionDto[] {
  return criteria.map((criterion, index) => ({
    key: criterion.key.trim(),
    title: criterion.title.trim(),
    description: criterion.description?.trim() || null,
    maxScore: Number(criterion.maxScore),
    sortOrder: index + 1,
    matchType: criterion.matchType,
    matchPattern: criterion.matchPattern.trim(),
    isRequired: criterion.isRequired,
  }));
}

function validateCriteria(criteria: LabGradingCriterionDto[]): string[] {
  const errors: string[] = [];
  const seenKeys = new Set<string>();

  criteria.forEach((criterion, index) => {
    const label = `Criterion ${index + 1}`;
    const normalizedKey = criterion.key.toLocaleLowerCase();

    if (!criterion.key) errors.push(`${label}: key is required.`);
    if (!criterion.title) errors.push(`${label}: title is required.`);
    if (!Number.isFinite(criterion.maxScore) || criterion.maxScore <= 0) {
      errors.push(`${label}: max score must be greater than zero.`);
    }
    if (!criterion.matchPattern) {
      errors.push(`${label}: match pattern is required.`);
    }
    if (normalizedKey && seenKeys.has(normalizedKey)) {
      errors.push(`${label}: key “${criterion.key}” is duplicated.`);
    }
    seenKeys.add(normalizedKey);
  });

  return errors;
}

function validationDetails(error: unknown): string[] {
  if (!isApiClientError(error) || !error.details) return [];

  return Object.entries(error.details).flatMap(([field, messages]) => {
    if (Array.isArray(messages)) {
      return messages.map((message) => `${field}: ${String(message)}`);
    }
    if (typeof messages === "string") return [`${field}: ${messages}`];
    return [];
  });
}

function nextCriterionKey(criteria: EditableCriterion[]): string {
  const keys = new Set(criteria.map((criterion) => criterion.key));
  let number = criteria.length + 1;
  let key = `criterion_${number}`;

  while (keys.has(key)) {
    number += 1;
    key = `criterion_${number}`;
  }

  return key;
}

export function LabRubricEditor({ labId }: LabRubricEditorProps) {
  const rubricQuery = useLabRubric(labId);

  if (rubricQuery.isLoading) {
    return (
      <Card className="border-border/60 bg-card/60 shadow-sm">
        <CardHeader>
          <CardTitle>Grading rubric</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-40" />
        </CardContent>
      </Card>
    );
  }

  if (rubricQuery.isError) {
    return (
      <Card className="border-border/60 bg-card/60 shadow-sm">
        <CardHeader>
          <CardTitle>Grading rubric</CardTitle>
          <CardDescription>
            Configure weighted criteria for future evaluations of this lab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ApiErrorAlert
            error={rubricQuery.error}
            title="Grading rubric failed to load"
          />
        </CardContent>
      </Card>
    );
  }

  if (!rubricQuery.data) return null;

  return (
    <LabRubricForm
      key={labId}
      labId={labId}
      initialCriteria={rubricQuery.data.criteria}
    />
  );
}

function LabRubricForm({
  labId,
  initialCriteria,
}: LabRubricEditorProps & {
  initialCriteria: LabGradingCriterionDto[];
}) {
  const updateRubricMutation = useUpdateLabRubric(labId);
  const [criteria, setCriteria] = useState<EditableCriterion[]>(() =>
    [...initialCriteria]
      .sort((left, right) => left.sortOrder - right.sortOrder)
      .map(toEditableCriterion),
  );
  const [isDirty, setIsDirty] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [saveError, setSaveError] = useState<unknown>(null);

  const totalScore = useMemo(
    () =>
      criteria.reduce((total, criterion) => {
        const score = Number(criterion.maxScore);
        return Number.isFinite(score) ? total + score : total;
      }, 0),
    [criteria],
  );

  function changeCriterion(
    editorId: string,
    updates: Partial<LabGradingCriterionDto>,
  ) {
    setCriteria((current) =>
      current.map((criterion) =>
        criterion.editorId === editorId
          ? { ...criterion, ...updates }
          : criterion,
      ),
    );
    setIsDirty(true);
    setValidationErrors([]);
    setSaveError(null);
  }

  function addCriterion() {
    setCriteria((current) => [
      ...current,
      toEditableCriterion({
        key: nextCriterionKey(current),
        title: "",
        description: null,
        maxScore: 1,
        sortOrder: current.length + 1,
        matchType: "contains",
        matchPattern: "",
        isRequired: true,
      }),
    ]);
    setIsDirty(true);
    setValidationErrors([]);
    setSaveError(null);
  }

  function removeCriterion(editorId: string) {
    setCriteria((current) =>
      current.filter((criterion) => criterion.editorId !== editorId),
    );
    setIsDirty(true);
    setValidationErrors([]);
    setSaveError(null);
  }

  function loadTemplate() {
    setCriteria(PRN232_CHECKLIST_TEMPLATE.map(toEditableCriterion));
    setIsDirty(true);
    setValidationErrors([]);
    setSaveError(null);
    toast.success("PRN232 checklist template loaded. Save to apply it.");
  }

  async function saveRubric() {
    const normalizedCriteria = normalizeCriteria(criteria);
    const nextErrors = validateCriteria(normalizedCriteria);

    if (nextErrors.length > 0) {
      setValidationErrors(nextErrors);
      return;
    }

    setValidationErrors([]);
    setSaveError(null);

    try {
      await updateRubricMutation.mutateAsync({
        criteria: normalizedCriteria,
      });
      setIsDirty(false);
      toast.success(
        normalizedCriteria.length > 0
          ? "Grading rubric saved."
          : "Rubric cleared. New evaluations will use equal assertion scoring.",
      );
    } catch (error) {
      const serverErrors = validationDetails(error);
      setValidationErrors(serverErrors);
      setSaveError(serverErrors.length > 0 ? null : error);
      toast.error(getApiErrorMessage(error));
    }
  }

  const isSaving = updateRubricMutation.isPending;

  return (
    <Card className="border-border/60 bg-card/60 shadow-sm">
      <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold tracking-tight">
            Grading rubric
          </CardTitle>
          <CardDescription className="mt-1.5 max-w-2xl leading-5">
            Match Newman assertion identities to weighted criteria. With no
            criteria, evaluations keep the equal-assertion scoring policy.
          </CardDescription>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Total
          </span>
          <Badge variant="outline" className="bg-muted/30 tabular-nums">
            {formatScore(totalScore)} points
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {saveError ? (
          <ApiErrorAlert error={saveError} title="Rubric save failed" />
        ) : null}

        {validationErrors.length > 0 ? (
          <div
            role="alert"
            className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
          >
            <p className="font-semibold">Fix the rubric before saving.</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {validationErrors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={loadTemplate}
          >
            <SparklesIcon className="size-4" />
            Load PRN232 checklist template
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSaving}
            onClick={addCriterion}
          >
            <ListPlusIcon className="size-4" />
            Add criterion
          </Button>
        </div>

        {criteria.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm leading-6 text-muted-foreground">
            No weighted criteria are configured. Evaluations for this lab use
            equal-weight Newman assertion scoring with a maximum score of 100.
          </div>
        ) : (
          <div className="space-y-4">
            {criteria.map((criterion, index) => {
              const fieldId = criterion.editorId;

              return (
                <fieldset
                  key={criterion.editorId}
                  disabled={isSaving}
                  className="rounded-xl border border-border bg-muted/15 p-4 disabled:opacity-70"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="tabular-nums">
                        {String(index + 1).padStart(2, "0")}
                      </Badge>
                      <p className="text-sm font-semibold text-foreground">
                        {criterion.title.trim() || "Untitled criterion"}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove criterion ${index + 1}`}
                      onClick={() => removeCriterion(criterion.editorId)}
                    >
                      <Trash2Icon className="size-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-12">
                    <div className="grid gap-2 md:col-span-6">
                      <Label htmlFor={`${fieldId}-title`}>Title</Label>
                      <Input
                        id={`${fieldId}-title`}
                        value={criterion.title}
                        placeholder="Pagination Metadata"
                        onChange={(event) =>
                          changeCriterion(criterion.editorId, {
                            title: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-4">
                      <Label htmlFor={`${fieldId}-key`}>Stable key</Label>
                      <Input
                        id={`${fieldId}-key`}
                        value={criterion.key}
                        className="font-mono text-xs"
                        placeholder="pagination_metadata"
                        onChange={(event) =>
                          changeCriterion(criterion.editorId, {
                            key: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-2">
                      <Label htmlFor={`${fieldId}-max-score`}>Max score</Label>
                      <Input
                        id={`${fieldId}-max-score`}
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={criterion.maxScore}
                        className="tabular-nums"
                        onChange={(event) =>
                          changeCriterion(criterion.editorId, {
                            maxScore: Number(event.target.value),
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-12">
                      <Label htmlFor={`${fieldId}-description`}>
                        Description{" "}
                        <span className="text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <Input
                        id={`${fieldId}-description`}
                        value={criterion.description ?? ""}
                        placeholder="What this criterion verifies"
                        onChange={(event) =>
                          changeCriterion(criterion.editorId, {
                            description: event.target.value || null,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2 md:col-span-3">
                      <Label htmlFor={`${fieldId}-match-type`}>
                        Match type
                      </Label>
                      <Select
                        value={criterion.matchType}
                        onValueChange={(value) =>
                          changeCriterion(criterion.editorId, {
                            matchType: value as RubricMatchType,
                          })
                        }
                      >
                        <SelectTrigger
                          id={`${fieldId}-match-type`}
                          className="h-10 w-full"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MATCH_TYPES.map((matchType) => (
                            <SelectItem
                              key={matchType.value}
                              value={matchType.value}
                            >
                              {matchType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2 md:col-span-7">
                      <Label htmlFor={`${fieldId}-match-pattern`}>
                        Match pattern
                      </Label>
                      <Input
                        id={`${fieldId}-match-pattern`}
                        value={criterion.matchPattern}
                        className="font-mono text-xs"
                        placeholder="Pagination Metadata"
                        onChange={(event) =>
                          changeCriterion(criterion.editorId, {
                            matchPattern: event.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-end md:col-span-2">
                      <label
                        htmlFor={`${fieldId}-required`}
                        className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm font-medium text-foreground"
                      >
                        <input
                          id={`${fieldId}-required`}
                          type="checkbox"
                          checked={criterion.isRequired}
                          className="size-4 accent-primary"
                          onChange={(event) =>
                            changeCriterion(criterion.editorId, {
                              isRequired: event.target.checked,
                            })
                          }
                        />
                        Required
                      </label>
                    </div>
                  </div>
                </fieldset>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <p className="text-xs leading-5 text-muted-foreground">
            Criteria are evaluated in the order shown. Remove every criterion
            and save to restore equal-assertion scoring.
          </p>
          <Button
            type="button"
            disabled={!isDirty || isSaving}
            onClick={saveRubric}
          >
            <SaveIcon className="size-4" />
            {isSaving ? "Saving rubric…" : "Save rubric"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
