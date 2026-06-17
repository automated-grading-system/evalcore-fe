"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateClass } from "@/features/classes/hooks/use-classes";
import { getApiErrorMessage } from "@/lib/api/errors";

export default function NewLecturerClassPage() {
  const router = useRouter();
  const createClassMutation = useCreateClass();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<unknown>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Name is required.");
      return;
    }

    if (trimmedName.length > 150) {
      setNameError("Name must be 150 characters or fewer.");
      return;
    }

    setNameError(null);

    try {
      const createdClass = await createClassMutation.mutateAsync({
        name: trimmedName,
        description: description.trim() || null,
      });
      toast.success("Class created.");
      router.push(`/lecturer/classes/${createdClass.id}`);
    } catch (error) {
      setSubmitError(error);
      toast.error(getApiErrorMessage(error));
    }
  }

  return (
    <div className="flex max-w-4xl flex-col gap-6">
      <PageHeader
        title="New class"
        description="Create a class through the API Gateway-backed Class Service."
      />

      <Card className="border-zinc-800/70 bg-zinc-900/35">
        <CardHeader>
          <CardTitle>Class details</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleSubmit}>
            {submitError ? <ApiErrorAlert error={submitError} /> : null}

            <div className="grid gap-2">
              <Label htmlFor="class-name">Name</Label>
              <Input
                id="class-name"
                value={name}
                maxLength={150}
                disabled={createClassMutation.isPending}
                onChange={(event) => setName(event.target.value)}
                placeholder="PRN232 - ASP.NET Core Web API"
                aria-invalid={Boolean(nameError)}
              />
              <div className="flex items-center justify-between gap-3">
                {nameError ? (
                  <p className="text-xs text-destructive">{nameError}</p>
                ) : (
                  <p className="text-xs text-zinc-500">
                    Use the official course or section name.
                  </p>
                )}
                <span className="font-mono text-[11px] text-zinc-600">
                  {name.length}/150
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="class-description">Description</Label>
              <Textarea
                id="class-description"
                value={description}
                disabled={createClassMutation.isPending}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Short scope, cohort note, or semester context."
                className="min-h-28"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                disabled={createClassMutation.isPending}
                onClick={() => router.push("/lecturer/classes")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createClassMutation.isPending}>
                {createClassMutation.isPending ? "Creating..." : "Create class"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
