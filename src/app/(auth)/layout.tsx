import { CheckCircle2Icon, ShieldCheckIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-[minmax(0,1fr)_minmax(480px,0.78fr)]">
      <section className="relative hidden overflow-hidden border-r border-border bg-[#111426] p-10 text-white lg:flex lg:flex-col dark:bg-[#0c0e16]">
        <div className="absolute -left-24 top-1/4 size-96 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 size-80 rounded-full bg-cyan-400/10 blur-3xl" />
        <Link href="/" className="relative z-10 w-fit">
          <Brand className="[&_span]:text-white [&_span_span:last-child]:text-white/55" />
        </Link>
        <div className="relative z-10 my-auto max-w-xl py-16">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-indigo-200">
            <SparklesIcon className="size-3.5" /> Evaluation, without the
            busywork
          </span>
          <h1 className="text-4xl font-bold leading-tight tracking-[-0.04em] xl:text-5xl">
            Build, submit, and evaluate with confidence.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-slate-300">
            EvalCore gives lecturers and students one clear workspace for lab
            assets, project submissions, automated tests, and results.
          </p>
          <div className="mt-10 grid gap-4 text-sm text-slate-200 sm:grid-cols-2">
            <div className="flex items-center gap-3">
              <CheckCircle2Icon className="size-4 text-emerald-400" /> Traceable
              evaluation steps
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="size-4 text-indigo-300" /> Role-aware
              access
            </div>
          </div>
        </div>
        <p className="relative z-10 text-xs text-slate-500">
          Automated ASP.NET project evaluation
        </p>
      </section>

      <section className="flex min-h-dvh flex-col">
        <header className="flex h-18 items-center justify-between border-b border-border/70 px-5 sm:px-8">
          <Link href="/" className="lg:hidden">
            <Brand />
          </Link>
          <span className="hidden text-xs font-medium text-muted-foreground lg:block">
            Secure workspace access
          </span>
          <ThemeToggle />
        </header>
        <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          {children}
        </main>
      </section>
    </div>
  );
}
