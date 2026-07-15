"use client";

import {
  ArrowRightIcon,
  BookOpenIcon,
  FlaskConicalIcon,
  PlusIcon,
} from "lucide-react";
import Link from "next/link";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import {
  PageHeader,
  SectionHeader,
  StatCard,
  StatsGrid,
} from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClassCard } from "@/features/classes/components/class-card";
import { ClassEmptyState } from "@/features/classes/components/class-empty-state";
import { useLecturerClasses } from "@/features/classes/hooks/use-classes";
import { useAuth } from "@/lib/auth/auth-context";

export default function LecturerDashboardPage() {
  const { user } = useAuth();
  const classesQuery = useLecturerClasses({ page: 1, pageSize: 4 });
  const firstName = user?.fullName.split(/\s+/)[0] ?? "there";

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Lecturer workspace"
        title={`Welcome back, ${firstName}`}
        description="Manage course spaces, publish lab assets, and inspect automated evaluation results."
      >
        <Button asChild>
          <Link href="/lecturer/classes/new">
            <PlusIcon />
            New class
          </Link>
        </Button>
      </PageHeader>

      <StatsGrid>
        <StatCard
          label="Classes"
          value={
            classesQuery.isLoading ? "…" : (classesQuery.data?.totalItems ?? 0)
          }
          note="Created by your account"
          icon={<BookOpenIcon className="size-4" />}
        />
        <Card className="flex min-h-32 flex-col justify-between p-5 sm:col-span-1 xl:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Evaluation workflow
              </p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Open a class, select a lab, then review real student submissions
                and their latest evaluation details.
              </p>
            </div>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FlaskConicalIcon className="size-4" />
            </span>
          </div>
          <Button asChild variant="link" className="mt-2 h-auto w-fit p-0">
            <Link href="/lecturer/classes">
              Open class workspace <ArrowRightIcon />
            </Link>
          </Button>
        </Card>
      </StatsGrid>

      {classesQuery.isError ? (
        <ApiErrorAlert error={classesQuery.error} />
      ) : null}

      <section className="space-y-4">
        <SectionHeader
          title="Recent classes"
          description="Manage labs and student access."
        >
          <Button asChild variant="ghost" size="sm">
            <Link href="/lecturer/classes">
              View all <ArrowRightIcon />
            </Link>
          </Button>
        </SectionHeader>
        {classesQuery.isLoading ? (
          <div className="grid gap-3 lg:grid-cols-2">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
          </div>
        ) : null}
        {classesQuery.data?.items.length ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {classesQuery.data.items.map((item) => (
              <ClassCard
                key={item.id}
                classItem={item}
                href={`/lecturer/classes/${item.id}`}
              />
            ))}
          </div>
        ) : null}
        {classesQuery.data && classesQuery.data.items.length === 0 ? (
          <ClassEmptyState
            title="No classes yet"
            description="Create a class before publishing lab assets or enrolling students."
            actionHref="/lecturer/classes/new"
            actionLabel="Create a class"
          />
        ) : null}
      </section>

      <section className="space-y-4">
        <SectionHeader
          title="Quick actions"
          description="Start with a class, then add and evaluate labs."
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-bold">Create a class</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Set up a new course workspace.
                </p>
              </div>
              <Button asChild variant="outline" size="icon">
                <Link href="/lecturer/classes/new" aria-label="Create a class">
                  <PlusIcon />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <h3 className="font-bold">Review results</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Navigate to lab submissions.
                </p>
              </div>
              <Button asChild variant="outline" size="icon">
                <Link href="/lecturer/results" aria-label="Review results">
                  <ArrowRightIcon />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
