"use client";

import { useState } from "react";
import {
  CheckCircle2Icon,
  FileArchiveIcon,
  UploadCloudIcon,
} from "lucide-react";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { FileDropField } from "@/features/classes/components/file-drop-field";
import { formatDateTime } from "@/features/classes/components/formatters";
import { SubmissionStatusBadge } from "@/features/submissions/components/submission-status-badge";
import { EvaluationCard } from "@/features/evaluations/components/evaluation-card";
import {
  useMySubmissionForLab,
  useSubmitSubmissionZip,
} from "@/features/submissions/hooks/use-submissions";
import { getApiErrorMessage, isApiClientError } from "@/lib/api/errors";

interface StudentSubmissionPanelProps {
  labId: string;
  disabled?: boolean;
}

type SubmitStep = "idle" | "creating" | "uploading" | "completing" | "done";

const STEP_LABELS: Record<SubmitStep, string> = {
  idle: "Submit ZIP",
  creating: "Creating submission...",
  uploading: "Uploading ZIP...",
  completing: "Completing submission...",
  done: "Submitted",
};

const STEP_PROGRESS: Record<SubmitStep, number> = {
  idle: 0,
  creating: 20,
  uploading: 60,
  completing: 90,
  done: 100,
};

function isNoSubmissionError(error: unknown): boolean {
  return (
    isApiClientError(error) &&
    ["SUBMISSION_NOT_FOUND", "NOT_FOUND", "HTTP_ERROR"].includes(error.code) &&
    error.status === 404
  );
}

function validateZip(file: File | null): string | null {
  if (!file) return "Please select a ZIP file.";
  if (!file.name.toLowerCase().endsWith(".zip")) {
    return "Please upload a .zip file.";
  }
  return null;
}

export function StudentSubmissionPanel({
  labId,
  disabled,
}: StudentSubmissionPanelProps) {
  const submissionQuery = useMySubmissionForLab(labId);
  const submitMutation = useSubmitSubmissionZip(labId);
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [fileError, setFileError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<unknown>(null);
  const [step, setStep] = useState<SubmitStep>("idle");

  const hasSubmissionStatusError =
    submissionQuery.isError && !isNoSubmissionError(submissionQuery.error);
  const existingSubmission = submissionQuery.isSuccess
    ? submissionQuery.data
    : null;
  const isSubmitting = submitMutation.isPending;
  const buttonLabel =
    step === "done"
      ? STEP_LABELS.done
      : isSubmitting
        ? STEP_LABELS[step]
        : STEP_LABELS.idle;

  async function handleSubmit() {
    const validationError = validateZip(file);
    setFileError(validationError ?? undefined);
    setSubmitError(null);

    if (validationError || !file) {
      setStep("idle");
      return;
    }

    try {
      await submitMutation.mutateAsync({
        file,
        notes,
        onStep: setStep,
      });
      setStep("done");
      setFile(null);
      setNotes("");
      toast.success("Submitted");
    } catch (error) {
      setStep("idle");
      setSubmitError(error);
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">
          Project submission
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload your ASP.NET project as a ZIP archive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {submissionQuery.isLoading ? <Skeleton className="h-24" /> : null}

        {hasSubmissionStatusError ? (
          <ApiErrorAlert
            error={submissionQuery.error}
            title="Submission status failed"
          />
        ) : null}

        {!submissionQuery.isLoading &&
        !hasSubmissionStatusError &&
        existingSubmission ? (
          <>
            <div className="grid gap-4 rounded-xl border border-border bg-muted/30 p-5 sm:grid-cols-4">
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </p>
                <div className="mt-2">
                  <SubmissionStatusBadge status={existingSubmission.status} />
                </div>
              </div>
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Attempt
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {existingSubmission.attemptNo}
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  File
                </p>
                <p className="mt-1 break-all text-sm font-medium text-foreground">
                  {existingSubmission.projectFileName}
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Submitted
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {formatDateTime(
                    existingSubmission.submittedAt ??
                      existingSubmission.updatedAt,
                  )}
                </p>
              </div>
            </div>
            <EvaluationCard submissionId={existingSubmission.id} />
          </>
        ) : null}

        {!submissionQuery.isLoading &&
        !hasSubmissionStatusError &&
        !existingSubmission ? (
          <div className="flex items-center gap-3 rounded-xl border border-dashed border-border bg-muted/25 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-muted-foreground shadow-sm">
              <FileArchiveIcon className="size-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-foreground">
                No completed attempt
              </p>
              <p className="text-xs text-muted-foreground">
                Your first ZIP upload will appear here.
              </p>
            </div>
          </div>
        ) : null}

        {submitError ? (
          <ApiErrorAlert error={submitError} title="Submission failed" />
        ) : null}

        <div className="grid gap-4">
          {step !== "idle" ? (
            <div
              className="rounded-xl border border-primary/20 bg-primary/5 p-4"
              role="status"
              aria-live="polite"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  {step === "done" ? (
                    <CheckCircle2Icon className="size-4 text-success" />
                  ) : (
                    <UploadCloudIcon className="size-4 text-primary" />
                  )}
                  {STEP_LABELS[step]}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  {STEP_PROGRESS[step]}%
                </span>
              </div>
              <Progress value={STEP_PROGRESS[step]} />
              <p className="mt-2 text-xs text-muted-foreground">
                Keep this page open until the upload is complete.
              </p>
            </div>
          ) : null}
          <FileDropField
            label="Project ZIP"
            description="Drop your project ZIP here"
            accept=".zip,application/zip,application/x-zip-compressed"
            value={file}
            error={fileError}
            disabled={disabled || isSubmitting}
            onChange={(nextFile) => {
              setFile(nextFile);
              setStep("idle");
              setFileError(validateZip(nextFile) ?? undefined);
            }}
          />

          <div className="space-y-2">
            <Label
              htmlFor="submission-notes"
              className="text-foreground/90 font-medium"
            >
              Notes
            </Label>
            <Textarea
              id="submission-notes"
              value={notes}
              disabled={disabled || isSubmitting}
              placeholder="Optional notes for your lecturer"
              className="min-h-24"
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              disabled={disabled || isSubmitting}
              onClick={handleSubmit}
              className="w-full px-6 sm:w-auto"
            >
              <UploadCloudIcon />
              {buttonLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
