"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  useCompleteLabAssets,
  useCreateLab,
  useUploadLabAssets,
} from "@/features/classes/hooks/use-classes";
import { FileDropField } from "@/features/classes/components/file-drop-field";
import { getApiErrorMessage } from "@/lib/api/errors";

type LabFlowStep =
  | "idle"
  | "metadata"
  | "requirement"
  | "collection"
  | "complete"
  | "done";

const STEP_LABELS: Record<Exclude<LabFlowStep, "idle">, string> = {
  metadata: "Creating lab metadata",
  requirement: "Uploading requirement PDF",
  collection: "Uploading Postman collection",
  complete: "Completing lab assets",
  done: "Lab assets completed",
};

interface LabAssetUploadFormProps {
  classId: string;
}

interface LabFormErrors {
  title?: string;
  deadline?: string;
  requirement?: string;
  collection?: string;
}

export function LabAssetUploadForm({ classId }: LabAssetUploadFormProps) {
  const router = useRouter();
  const createLabMutation = useCreateLab(classId);
  const uploadMutation = useUploadLabAssets();
  const completeMutation = useCompleteLabAssets();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [requirementFile, setRequirementFile] = useState<File | null>(null);
  const [collectionFile, setCollectionFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<LabFormErrors>({});
  const [flowStep, setFlowStep] = useState<LabFlowStep>("idle");
  const [submitError, setSubmitError] = useState<unknown>(null);

  const isSubmitting =
    createLabMutation.isPending ||
    uploadMutation.isPending ||
    completeMutation.isPending;

  const progress = {
    idle: 0,
    metadata: 25,
    requirement: 50,
    collection: 75,
    complete: 92,
    done: 100,
  }[flowStep];

  function validate(): boolean {
    const nextErrors: LabFormErrors = {};
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      nextErrors.title = "Title is required.";
    }

    if (!deadline) {
      nextErrors.deadline = "Deadline is required.";
    } else if (new Date(deadline) <= new Date()) {
      nextErrors.deadline = "Deadline must be a future date.";
    }

    if (!requirementFile) {
      nextErrors.requirement = "Requirement PDF is required.";
    } else if (!requirementFile.name.toLowerCase().endsWith(".pdf")) {
      nextErrors.requirement = "Requirement file must be a .pdf file.";
    }

    if (!collectionFile) {
      nextErrors.collection = "Postman collection JSON is required.";
    } else if (!collectionFile.name.toLowerCase().endsWith(".json")) {
      nextErrors.collection = "Collection file must be a .json file.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    if (!validate() || !requirementFile || !collectionFile) return;

    try {
      setFlowStep("metadata");
      const created = await createLabMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || null,
        deadline: new Date(deadline).toISOString(),
        requirementFileName: requirementFile.name,
        collectionFileName: collectionFile.name,
      });

      await uploadMutation.mutateAsync({
        upload: created.upload,
        files: {
          requirementFile,
          collectionFile,
        },
        onStep: (step) => setFlowStep(step),
      });

      setFlowStep("complete");
      await completeMutation.mutateAsync({
        labId: created.lab.id,
        request: {
          requirementUploaded: true,
          collectionUploaded: true,
        },
      });

      setFlowStep("done");
      toast.success("Lab created and assets uploaded.");
      router.push(`/lecturer/labs/${created.lab.id}`);
    } catch (error) {
      setSubmitError(error);
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <Card className="max-w-3xl border-border/60 bg-card/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Create lab</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {submitError ? <ApiErrorAlert error={submitError} /> : null}

          <div className="grid gap-2">
            <Label htmlFor="lab-title" className="text-foreground/90 font-medium">Title</Label>
            <Input
              id="lab-title"
              value={title}
              disabled={isSubmitting}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Lab 01 - REST API Basics"
              aria-invalid={Boolean(errors.title)}
            />
            {errors.title && (
              <p className="text-xs text-destructive font-medium">{errors.title}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lab-description" className="text-foreground/90 font-medium">Description</Label>
            <Textarea
              id="lab-description"
              value={description}
              disabled={isSubmitting}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Scope, grading notes, or lecturer instructions."
              className="min-h-28"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lab-deadline" className="text-foreground/90 font-medium">Deadline</Label>
            <Input
              id="lab-deadline"
              type="datetime-local"
              value={deadline}
              disabled={isSubmitting}
              onChange={(event) => setDeadline(event.target.value)}
              aria-invalid={Boolean(errors.deadline)}
            />
            {errors.deadline && (
              <p className="text-xs text-destructive font-medium">{errors.deadline}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FileDropField
              label="Requirement PDF"
              description="Select the lab requirement document."
              accept="application/pdf,.pdf"
              value={requirementFile}
              error={errors.requirement}
              disabled={isSubmitting}
              onChange={setRequirementFile}
            />
            <FileDropField
              label="Postman collection JSON"
              description="Select the Postman collection export."
              accept="application/json,.json"
              value={collectionFile}
              error={errors.collection}
              disabled={isSubmitting}
              onChange={setCollectionFile}
            />
          </div>

          {flowStep !== "idle" && (
            <div className="rounded-xl border border-border/80 bg-zinc-950/50 p-4 shadow-2xs">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-foreground">
                  {STEP_LABELS[flowStep as Exclude<LabFlowStep, "idle">]}
                </p>
                <span className="font-mono text-xs text-muted-foreground font-semibold">
                  {progress}%
                </span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              disabled={isSubmitting}
              onClick={() => router.push(`/lecturer/classes/${classId}`)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating lab..." : "Create and upload assets"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
