"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { FileDropField } from "@/features/classes/components/file-drop-field";
import { formatDateTime } from "@/features/classes/components/formatters";
import { SubmissionStatusBadge } from "@/features/submissions/components/submission-status-badge";
import { EvaluationCard } from "@/features/evaluations/components/evaluation-card";
import {
  useMySubmissionForLab,
  useSubmitSubmissionZip,
} from "@/features/submissions/hooks/use-submissions";
import {
  getApiErrorMessage,
  isApiClientError,
} from "@/lib/api/errors";

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
    <Card className="border-border/60 bg-card/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Project submission</CardTitle>
        <CardDescription className="text-muted-foreground">
          Upload your ASP.NET project as a ZIP archive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {submissionQuery.isLoading ? (
          <Skeleton className="h-24 bg-zinc-950/50" />
        ) : null}

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
            <div className="grid gap-4 rounded-xl border border-border/80 bg-zinc-950/50 p-5 shadow-2xs sm:grid-cols-4">
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
          <p className="rounded-xl border border-border/50 bg-zinc-950/30 p-4 text-sm text-muted-foreground text-center">
            No submission has been completed for this lab yet.
          </p>
        ) : null}

        {submitError ? (
          <ApiErrorAlert error={submitError} title="Submission failed" />
        ) : null}

        <div className="grid gap-4">
          <FileDropField
            label="Project ZIP"
            description="Select StudentProject.zip"
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
            <Label htmlFor="submission-notes" className="text-foreground/90 font-medium">
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
              className="w-full sm:w-auto font-semibold px-6"
            >
              {buttonLabel}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
