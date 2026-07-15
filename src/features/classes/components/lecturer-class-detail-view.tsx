"use client";

import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { ApiErrorAlert } from "@/components/data/api-error-alert";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClassEmptyState } from "@/features/classes/components/class-empty-state";
import { LabCard } from "@/features/classes/components/lab-card";
import { formatDateTime } from "@/features/classes/components/formatters";
import {
  useClassDetail,
  useClassLabs,
  useClassMembers,
} from "@/features/classes/hooks/use-classes";

interface LecturerClassDetailViewProps {
  classId: string;
}

export function LecturerClassDetailView({
  classId,
}: LecturerClassDetailViewProps) {
  const classQuery = useClassDetail(classId);
  const membersQuery = useClassMembers(classId, { page: 1, pageSize: 50 });
  const labsQuery = useClassLabs(classId, { page: 1, pageSize: 50 });

  if (classQuery.isLoading) {
    return (
      <div className="flex max-w-6xl flex-col gap-6">
        <Skeleton className="h-24" />
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (classQuery.isError) {
    return (
      <div className="max-w-4xl">
        <ApiErrorAlert error={classQuery.error} />
      </div>
    );
  }

  if (!classQuery.data) return null;

  const classItem = classQuery.data;

  return (
    <div className="flex max-w-6xl flex-col gap-6">
      <PageHeader
        title={classItem.name}
        description={
          classItem.description ?? "No description provided for this class."
        }
      >
        <Button asChild>
          <Link href={`/lecturer/classes/${classId}/labs/new`}>
            <PlusIcon className="size-4" />
            New lab
          </Link>
        </Button>
      </PageHeader>

      <Card className="border-border/60 bg-card/60 shadow-sm">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Created
            </p>
            <p className="mt-1 text-sm text-foreground font-medium">
              {formatDateTime(classItem.createdAt)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Updated
            </p>
            <p className="mt-1 text-sm text-foreground font-medium">
              {formatDateTime(classItem.updatedAt)}
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
              Class id
            </p>
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
              {classItem.id}
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="labs" className="gap-5">
        <TabsList className="border border-border bg-muted/70 p-1">
          <TabsTrigger value="labs">Labs</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
        </TabsList>

        <TabsContent value="labs" className="space-y-4">
          {labsQuery.isLoading && (
            <div className="grid gap-3">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
          )}
          {labsQuery.isError && <ApiErrorAlert error={labsQuery.error} />}
          {labsQuery.data && labsQuery.data.items.length > 0 && (
            <div className="grid gap-3">
              {labsQuery.data.items.map((lab) => (
                <LabCard
                  key={lab.id}
                  lab={lab}
                  href={`/lecturer/labs/${lab.id}`}
                />
              ))}
            </div>
          )}
          {labsQuery.data && labsQuery.data.items.length === 0 && (
            <ClassEmptyState
              title="No labs in this class"
              description="Create a lab and upload its requirement PDF plus Postman collection to activate it."
              actionHref={`/lecturer/classes/${classId}/labs/new`}
              actionLabel="Create lab"
            />
          )}
        </TabsContent>

        <TabsContent value="members">
          {membersQuery.isLoading && <Skeleton className="h-64" />}
          {membersQuery.isError && <ApiErrorAlert error={membersQuery.error} />}
          {membersQuery.data && membersQuery.data.items.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-border/60 bg-card/45 shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/45 hover:bg-muted/45">
                    <TableHead className="font-semibold text-muted-foreground">
                      Student
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground">
                      Email
                    </TableHead>
                    <TableHead className="font-semibold text-muted-foreground">
                      Joined
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {membersQuery.data.items.map((member) => (
                    <TableRow
                      key={member.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-semibold text-foreground">
                        {member.studentName ?? member.studentId}
                      </TableCell>
                      <TableCell className="text-foreground/80 font-medium">
                        {member.studentEmail ?? "Not provided"}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        {formatDateTime(member.joinedAt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {membersQuery.data && membersQuery.data.items.length === 0 && (
            <ClassEmptyState
              title="No students joined"
              description="Students can find this class from the search page and join through the Gateway API."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
