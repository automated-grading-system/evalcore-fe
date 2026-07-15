import {
  ArrowRightIcon,
  BellRingIcon,
  CheckCircle2Icon,
  FileArchiveIcon,
  FlaskConicalIcon,
  GaugeIcon,
  ShieldCheckIcon,
  UploadCloudIcon,
} from "lucide-react";
import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";

const FEATURES = [
  {
    icon: UploadCloudIcon,
    title: "Contract-safe uploads",
    description:
      "Presigned asset and project uploads flow directly to storage.",
  },
  {
    icon: FlaskConicalIcon,
    title: "Transparent evaluation",
    description: "Follow each grading step, terminal state, score, and report.",
  },
  {
    icon: BellRingIcon,
    title: "Timely notifications",
    description:
      "Students and lecturers stay current without hunting for updates.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/75 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" aria-label="EvalCore home">
            <Brand />
          </Link>
          <nav
            className="flex items-center gap-1 sm:gap-2"
            aria-label="Account"
          >
            <ThemeToggle />
            <Button asChild variant="ghost" className="hidden sm:inline-flex">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">
                Get started <ArrowRightIcon />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-border/70">
          <div className="absolute inset-x-0 top-0 -z-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.14),transparent_68%)]" />
          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1fr_0.9fr] lg:py-32">
            <div>
              <StatusBadge tone="info">Built for ASP.NET education</StatusBadge>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.05] tracking-[-0.05em] sm:text-6xl">
                Automated evaluation, made clear.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                EvalCore connects classes, lab assets, project submissions,
                automated tests, results, and notifications in one focused
                workspace.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/login">
                    Open your workspace <ArrowRightIcon />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/register">Create an account</Link>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheckIcon className="size-4 text-success" /> Role-aware
                  access
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2Icon className="size-4 text-success" /> Real
                  backend data
                </span>
                <span className="flex items-center gap-2">
                  <GaugeIcon className="size-4 text-success" /> Live evaluation
                  polling
                </span>
              </div>
            </div>
            <ProductPreview />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              A complete workflow
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-[-0.035em]">
              Less friction from brief to result.
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Purpose-built interactions keep every role focused on the next
              meaningful action.
            </p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 font-bold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Brand />
          <p className="text-xs text-muted-foreground">
            Automated ASP.NET project evaluation
          </p>
        </div>
      </footer>
    </div>
  );
}

function ProductPreview() {
  const steps = [
    {
      label: "Project archive received",
      icon: FileArchiveIcon,
      state: "complete",
    },
    {
      label: "Environment prepared",
      icon: CheckCircle2Icon,
      state: "complete",
    },
    {
      label: "API collection executed",
      icon: FlaskConicalIcon,
      state: "active",
    },
  ];

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-primary/10 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-slate-950/10 dark:shadow-black/30">
        <div className="flex items-center justify-between border-b border-border bg-muted/45 px-5 py-4">
          <div>
            <p className="text-sm font-bold">Evaluation progress</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Automated grading workflow
            </p>
          </div>
          <StatusBadge tone="info" pulse>
            Running
          </StatusBadge>
        </div>
        <div className="p-5 sm:p-6">
          <div className="space-y-3">
            {steps.map(({ label, icon: Icon, state }, index) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3.5"
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-lg ${state === "complete" ? "bg-emerald-500/10 text-success" : "bg-blue-500/10 text-info"}`}
                >
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Step {index + 1} of {steps.length}
                  </p>
                </div>
                {state === "complete" ? (
                  <CheckCircle2Icon className="size-4 text-success" />
                ) : (
                  <span className="size-2 animate-pulse rounded-full bg-info" />
                )}
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs leading-6 text-slate-300">
            <p className="text-slate-500">evaluation-runner</p>
            <p>
              <span className="text-emerald-400">✓</span> workspace ready
            </p>
            <p>
              <span className="text-blue-400">›</span> executing collection…
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
