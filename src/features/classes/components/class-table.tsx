import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClassDto } from "@/types/class";
import { formatDate } from "@/features/classes/components/formatters";

interface ClassTableProps {
  classes: ClassDto[];
  getHref: (classItem: ClassDto) => string;
  actionLabel?: string;
  renderAction?: (classItem: ClassDto) => React.ReactNode;
}

export function ClassTable({
  classes,
  getHref,
  actionLabel = "Open",
  renderAction,
}: ClassTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800/70 bg-zinc-900/30">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800/70 hover:bg-transparent">
            <TableHead className="text-zinc-400">Class</TableHead>
            <TableHead className="hidden text-zinc-400 md:table-cell">
              Updated
            </TableHead>
            <TableHead className="text-right text-zinc-400">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow
              key={classItem.id}
              className="border-zinc-800/70 hover:bg-zinc-800/30"
            >
              <TableCell className="max-w-[28rem]">
                <Link
                  href={getHref(classItem)}
                  className="font-medium text-zinc-100 transition-colors hover:text-white"
                >
                  {classItem.name}
                </Link>
                <p className="mt-1 line-clamp-1 text-xs text-zinc-500">
                  {classItem.description ?? "No description provided."}
                </p>
              </TableCell>
              <TableCell className="hidden text-zinc-500 md:table-cell">
                {formatDate(classItem.updatedAt)}
              </TableCell>
              <TableCell className="text-right">
                {renderAction ? (
                  renderAction(classItem)
                ) : (
                  <Button asChild variant="outline" size="sm">
                    <Link href={getHref(classItem)}>{actionLabel}</Link>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
