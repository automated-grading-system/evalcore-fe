"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassEmptyState } from "@/features/classes/components/class-empty-state";
import { ClassTable } from "@/features/classes/components/class-table";
import {
  useJoinClass,
  useSearchClasses,
} from "@/features/classes/hooks/use-classes";
import { getApiErrorMessage } from "@/lib/api/errors";
import type { ClassDto } from "@/types/class";

export default function SearchClassesPage() {
  const [term, setTerm] = useState("");
  const [submittedTerm, setSubmittedTerm] = useState("");
  const [joinError, setJoinError] = useState<unknown>(null);
  const [joiningClassId, setJoiningClassId] = useState<string | null>(null);

  const searchQuery = useSearchClasses(
    {
      name: submittedTerm,
      page: 1,
      pageSize: 20,
    },
    submittedTerm.trim().length > 0,
  );
  const joinClassMutation = useJoinClass();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setJoinError(null);
    setSubmittedTerm(term.trim());
  }

  async function handleJoin(classItem: ClassDto) {
    setJoinError(null);
    setJoiningClassId(classItem.id);
    try {
      await joinClassMutation.mutateAsync(classItem.id);
      toast.success(`Joined ${classItem.name}.`);
    } catch (error) {
      setJoinError(error);
      toast.error(getApiErrorMessage(error));
    } finally {
      setJoiningClassId(null);
    }
  }

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <PageHeader
        title="Search Classes"
        description="Find lecturer-created classes by name and join through the API Gateway."
      />

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-border bg-card p-5 shadow-sm"
      >
        <div className="grid gap-2">
          <Label htmlFor="class-search">Class name</Label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="class-search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="PRN232"
              className="sm:max-w-md"
            />
            <Button type="submit">Search</Button>
          </div>
        </div>
      </form>

      {joinError ? (
        <ApiErrorAlert error={joinError} title="Join failed" />
      ) : null}
      {searchQuery.isError && <ApiErrorAlert error={searchQuery.error} />}

      {searchQuery.isLoading && (
        <div className="grid gap-3">
          <Skeleton className="h-12" />
          <Skeleton className="h-56" />
        </div>
      )}

      {!submittedTerm && (
        <ClassEmptyState
          title="Search by class name"
          description="Enter a course keyword such as PRN232 to find available classes."
        />
      )}

      {searchQuery.data && searchQuery.data.items.length > 0 && (
        <ClassTable
          classes={searchQuery.data.items}
          getHref={(classItem) => `/student/classes/${classItem.id}`}
          renderAction={(classItem) => (
            <Button
              type="button"
              size="sm"
              disabled={joiningClassId === classItem.id}
              onClick={() => void handleJoin(classItem)}
            >
              {joiningClassId === classItem.id ? "Joining..." : "Join"}
            </Button>
          )}
        />
      )}

      {searchQuery.data && searchQuery.data.items.length === 0 && (
        <ClassEmptyState
          title="No matching classes"
          description="Try a shorter course keyword or confirm the lecturer has created the class."
        />
      )}
    </div>
  );
}
