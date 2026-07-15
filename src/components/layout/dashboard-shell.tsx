"use client";

import { ArrowDownRightIcon, ArrowUpRightIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { Role } from "@/lib/types/api";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  role: Role;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardShell({
  role,
  title,
  children,
  className,
}: DashboardShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div className="flex min-h-dvh bg-background text-foreground">
      <Sidebar role={role} />
      {mobileOpen ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Dismiss navigation"
          />
          <Sidebar role={role} mobile onClose={() => setMobileOpen(false)} />
        </>
      ) : null}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} onOpenMenu={() => setMobileOpen(true)} />
        <main
          className={cn(
            "min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8",
            className,
          )}
        >
          <div className="mx-auto w-full max-w-[1440px]">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  eyebrow,
  children,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-2xl font-bold tracking-[-0.025em] text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function SectionHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-base font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}

export function StatsGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{children}</div>
  );
}

export interface StatCardProps {
  label: string;
  value: string | number;
  note?: string;
  trend?: "up" | "down";
  icon?: React.ReactNode;
}

export function StatCard({ label, value, note, trend, icon }: StatCardProps) {
  return (
    <div className="surface-panel flex min-h-32 flex-col justify-between p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        {icon ? (
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold tracking-[-0.035em] text-foreground">
          {value}
        </p>
        {note ? (
          <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            {trend === "up" ? (
              <ArrowUpRightIcon className="size-3.5 text-success" />
            ) : null}
            {trend === "down" ? (
              <ArrowDownRightIcon className="size-3.5 text-destructive" />
            ) : null}
            {note}
          </p>
        ) : null}
      </div>
    </div>
  );
}
