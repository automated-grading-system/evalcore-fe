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
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/45 hover:bg-muted/45">
            <TableHead className="h-11 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Class
            </TableHead>
            <TableHead className="hidden h-11 text-xs font-bold uppercase tracking-wider text-muted-foreground md:table-cell">
              Updated
            </TableHead>
            <TableHead className="h-11 px-4 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow key={classItem.id} className="hover:bg-muted/35">
              <TableCell className="max-w-[28rem] px-4 py-3.5">
                <Link
                  href={getHref(classItem)}
                  className="font-semibold text-foreground transition-colors hover:text-primary"
                >
                  {classItem.name}
                </Link>
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {classItem.description ?? "No description provided."}
                </p>
              </TableCell>
              <TableCell className="hidden text-muted-foreground md:table-cell">
                {formatDate(classItem.updatedAt)}
              </TableCell>
              <TableCell className="px-4 text-right">
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
