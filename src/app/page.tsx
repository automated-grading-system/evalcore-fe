import Link from "next/link";
import { Button } from "@/components/ui/button";

// ============================================================
// EvalCore Landing Page
//
// Taste Skill design read:
// B2B institutional tool, university technical audience,
// trust-first aesthetic, serious SaaS language.
//
// Dials: DESIGN_VARIANCE=5, MOTION_INTENSITY=3, VISUAL_DENSITY=5
//
// Decisions:
// - Dark base (#0a0a0a) with zinc neutrals — no warm beige/brass.
// - Single accent: zinc-50 (near white) on dark bg — no AI purple.
// - Geist font (already loaded via layout.tsx).
// - Split hero: left content / right visual panel.
// - Max 4 hero text elements (eyebrow stripped, CTA visible).
// - No decorative blobs, gradients, or glassmorphism.
// - Four distinct section layouts: hero split, bento, workflow, cta strip.
// - One eyebrow only (workflow section) in 4 sections = within limit.
// - Three role cards with tinted backgrounds (bento diversity rule).
// ============================================================

const MOCK_ENABLED = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex flex-col">
      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="flex h-14 items-center justify-between border-b border-zinc-800 px-6 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-50">
            <span className="text-xs font-bold text-zinc-950">EC</span>
          </div>
          <span className="text-sm font-semibold tracking-tight">EvalCore</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-zinc-400 hover:text-zinc-50 hover:bg-zinc-800"
          >
            <Link href="/login" id="nav-login-link">Sign in</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200"
          >
            <Link href="/register" id="nav-register-link">Get started</Link>
          </Button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full">
        {/* ── Hero — Split layout ────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100dvh-56px)] border-b border-zinc-800">
          {/* Left: content */}
          <div className="flex flex-col justify-center px-8 py-16 lg:px-12 lg:py-24 border-b border-zinc-800 lg:border-b-0 lg:border-r">
            <h1 className="text-4xl font-semibold tracking-tight leading-[1.1] text-zinc-50 md:text-5xl">
              Automated grading for ASP.NET projects
            </h1>
            <p className="mt-5 text-base text-zinc-400 leading-relaxed max-w-[50ch]">
              EvalCore runs Docker Compose and Newman against student
              submissions. Lecturers define the test suite once; EvalCore
              handles the rest.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200 rounded-lg"
                id="hero-login-btn"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 rounded-lg"
                id="hero-register-btn"
              >
                <Link href="/register">Create account</Link>
              </Button>
            </div>
            {MOCK_ENABLED && (
              <p className="mt-5 text-xs text-zinc-500">
                Mock auth is active — no backend required to sign in.
              </p>
            )}
          </div>

          {/* Right: visual panel */}
          <div className="flex flex-col justify-center items-center bg-zinc-900 px-8 py-16 lg:px-12">
            <div className="w-full max-w-sm space-y-3">
              {/* Simulated evaluation output — not a fake screenshot div */}
              <EvalOutputPreview />
            </div>
          </div>
        </section>

        {/* ── Role cards — Bento grid ───────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 border-b border-zinc-800">
          <RoleCard
            title="Student"
            description="Search and join classes. Submit your ASP.NET project as a ZIP archive. Track evaluation scores and test results."
            bgClass="bg-blue-950/30"
            borderClass="border-blue-900/40"
            href="/register"
            linkLabel="Register as student"
            id="role-card-student"
          />
          <RoleCard
            title="Lecturer"
            description="Create classes and labs with Postman collections. View submission queues and export graded results."
            bgClass="bg-violet-950/30"
            borderClass="border-violet-900/40 border-x"
            href="/register"
            linkLabel="Register as lecturer"
            id="role-card-lecturer"
          />
          <RoleCard
            title="Admin"
            description="Manage user accounts and roles. Monitor evaluation service health and review system audit logs."
            bgClass="bg-orange-950/20"
            borderClass="border-orange-900/30"
            href="/login"
            linkLabel="Admin sign in"
            id="role-card-admin"
          />
        </section>

        {/* ── Workflow — vertical list ──────────────────────── */}
        <section className="px-8 py-16 lg:px-12 lg:py-20 border-b border-zinc-800">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-8">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:grid-cols-4">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-xs font-mono text-zinc-400">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Footer strip ─────────────────────────────────── */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 px-8 py-5 lg:px-12 mt-auto">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded bg-zinc-800">
              <span className="text-[9px] font-bold text-zinc-400">EC</span>
            </div>
            <span className="text-xs text-zinc-500">EvalCore</span>
          </div>
          <p className="text-xs text-zinc-600">
            PRN232 Automated Grading Platform
          </p>
        </footer>
      </div>
    </div>
  );
}

// ---- Sub-components ----

const WORKFLOW_STEPS = [
  {
    title: "Create class and lab",
    description:
      "Lecturers set up classes, add students, and define lab requirements with Postman test collections.",
  },
  {
    title: "Submit project ZIP",
    description:
      "Students upload their ASP.NET project as a ZIP archive before the lab deadline.",
  },
  {
    title: "Run automated evaluation",
    description:
      "EvalCore spins up Docker Compose, starts the project, and executes Newman against the Postman collection.",
  },
  {
    title: "Review score and logs",
    description:
      "Pass/fail results and detailed test logs are available immediately. Lecturers can export reports.",
  },
];

function RoleCard({
  title,
  description,
  bgClass,
  borderClass,
  href,
  linkLabel,
  id,
}: {
  title: string;
  description: string;
  bgClass: string;
  borderClass: string;
  href: string;
  linkLabel: string;
  id: string;
}) {
  return (
    <div className={`flex flex-col gap-4 p-8 ${bgClass} border-b border-zinc-800 md:border-b-0 ${borderClass}`}>
      <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
      <p className="text-sm text-zinc-400 leading-relaxed flex-1">{description}</p>
      <Link
        href={href}
        id={id}
        className="text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors underline-offset-4 hover:underline"
      >
        {linkLabel}
      </Link>
    </div>
  );
}

function EvalOutputPreview() {
  const lines = [
    { label: "POST /api/students", status: "PASS", ms: "142ms" },
    { label: "GET /api/students/{id}", status: "PASS", ms: "67ms" },
    { label: "PUT /api/students/{id}", status: "PASS", ms: "88ms" },
    { label: "DELETE /api/students/{id}", status: "FAIL", ms: "201ms" },
    { label: "GET /api/classes", status: "PASS", ms: "54ms" },
  ];

  return (
    <div className="rounded-xl border border-zinc-700 bg-zinc-950 overflow-hidden">
      {/* Terminal header */}
      <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-2.5">
        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="ml-2 text-xs font-mono text-zinc-500">
          newman — EvalCore
        </span>
      </div>
      {/* Results */}
      <div className="p-4 space-y-2">
        <p className="text-xs font-mono text-zinc-500 mb-3">
          Running PRN232 Lab 3 · 5 requests
        </p>
        {lines.map((line) => (
          <div
            key={line.label}
            className="flex items-center justify-between gap-3"
          >
            <span className="font-mono text-xs text-zinc-300 truncate flex-1">
              {line.label}
            </span>
            <span className="text-xs font-mono text-zinc-500">{line.ms}</span>
            <span
              className={`text-xs font-mono font-medium w-9 text-right ${
                line.status === "PASS"
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {line.status}
            </span>
          </div>
        ))}
        <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500">4 passed / 1 failed</span>
          <span className="text-xs font-mono font-semibold text-zinc-300">
            Score: 80 / 100
          </span>
        </div>
      </div>
    </div>
  );
}
