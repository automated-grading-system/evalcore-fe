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
// - Dark base (#0a0a0a) with zinc neutrals.
// - Single accent: zinc-50 (near white) on dark bg.
// - Split hero: left content / right visual panel.
// - Added status pill in hero.
// - Architecture section added with bento-style visual alignment.
// ============================================================

const MOCK_ENABLED = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-zinc-950 text-zinc-50 flex flex-col font-sans selection:bg-zinc-800">
      {/* ── Navigation ─────────────────────────────────────── */}
      <nav className="flex h-16 items-center justify-between border-b border-zinc-800/60 px-6 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-zinc-100">
            <span className="text-sm font-bold text-zinc-950">EC</span>
          </div>
          <span className="text-sm font-medium tracking-tight">EvalCore</span>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/login" 
            className="text-sm font-medium text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Sign in
          </Link>
          <Button
            asChild
            size="sm"
            className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 h-9 px-4 font-medium"
          >
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col max-w-[1400px] mx-auto w-full">
        {/* ── Hero — Split layout ────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100dvh-64px)] border-b border-zinc-800/60">
          {/* Left: content */}
          <div className="flex flex-col justify-center px-6 py-20 sm:px-12 lg:px-16 lg:py-24 border-b border-zinc-800/60 lg:border-b-0 lg:border-r lg:border-zinc-800/60 relative">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-900/30 bg-emerald-950/20 px-3 py-1 text-xs font-medium text-emerald-400 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Dockerized Auth Stack & Gateway Ready
            </div>
            
            <h1 className="text-4xl font-medium tracking-tight leading-[1.1] text-zinc-50 sm:text-5xl lg:text-6xl max-w-[15ch]">
              Automated ASP.NET Project Evaluation Platform
            </h1>
            <p className="mt-6 text-base text-zinc-400 leading-relaxed max-w-[45ch]">
              EvalCore orchestrates Docker Compose and Newman to evaluate student
              submissions autonomously. Define the test suite once, EvalCore handles the rest.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="bg-zinc-100 text-zinc-950 hover:bg-zinc-300 rounded-md h-12 px-8 font-medium"
              >
                <Link href="/login">Sign in</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50 rounded-md h-12 px-8 font-medium"
              >
                <Link href="/register">Create account</Link>
              </Button>
            </div>
            {MOCK_ENABLED && (
              <p className="mt-6 text-xs text-amber-500/80 font-mono">
                Running in Mock Auth Mode
              </p>
            )}
          </div>

          {/* Right: visual panel */}
          <div className="flex flex-col justify-center items-center bg-zinc-900/50 px-6 py-16 sm:px-12 relative overflow-hidden">
            {/* Subtle background grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <div className="w-full max-w-lg space-y-4 relative z-10">
              <EvalOutputPreview />
            </div>
          </div>
        </section>

        {/* ── Workflow — vertical list ──────────────────────── */}
        <section className="px-6 py-20 sm:px-12 lg:px-16 lg:py-24 border-b border-zinc-800/60 bg-zinc-950">
          <div className="mb-16">
            <h2 className="text-xl font-medium text-zinc-100 tracking-tight">System Workflow</h2>
            <p className="mt-2 text-sm text-zinc-400">The evaluation lifecycle from creation to grading.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {WORKFLOW_STEPS.map((step, i) => (
              <div key={step.title} className="flex flex-col gap-4 relative group">
                <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-800 bg-zinc-900/50 text-xs font-mono text-zinc-400 group-hover:border-zinc-700 transition-colors">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="text-base font-medium text-zinc-100 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Role cards — Bento grid ───────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 border-b border-zinc-800/60 bg-zinc-950">
          <RoleCard
            title="Student"
            description="Search and join classes. Submit your ASP.NET project as a ZIP archive. Track evaluation scores and test results."
            bgClass="bg-zinc-900/30"
            borderClass="border-zinc-800/60"
            href="/register"
            linkLabel="Register as student"
          />
          <RoleCard
            title="Lecturer"
            description="Create classes and labs with Postman collections. View submission queues and export graded results."
            bgClass="bg-zinc-900/50"
            borderClass="border-zinc-800/60 border-y md:border-y-0 md:border-x"
            href="/register"
            linkLabel="Register as lecturer"
          />
          <RoleCard
            title="Admin"
            description="Manage user accounts and roles. Monitor evaluation service health and review system audit logs."
            bgClass="bg-zinc-900/80"
            borderClass="border-zinc-800/60"
            href="/login"
            linkLabel="Admin sign in"
          />
        </section>

        {/* ── System Architecture ────────────────────────────── */}
        <section className="px-6 py-20 sm:px-12 lg:px-16 lg:py-24 border-b border-zinc-800/60 bg-zinc-900/20">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-xl font-medium text-zinc-100 tracking-tight">System Architecture</h2>
            <p className="mt-4 text-sm text-zinc-400 leading-relaxed">
              EvalCore operates on a microservice architecture built for scalable ASP.NET evaluation. 
              The frontend communicates exclusively with the API Gateway, ensuring isolation and security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <ArchitectureNode 
              name="API Gateway" 
              type="Caddy / YARP" 
              desc="Routes all incoming requests and handles load balancing." 
              highlight 
            />
            <ArchitectureNode 
              name="Identity Service" 
              type=".NET 8 Web API" 
              desc="JWT issuance, user profiles, and role management." 
            />
            <ArchitectureNode 
              name="PostgreSQL" 
              type="Relational DB" 
              desc="Persistent storage for accounts, classes, and labs." 
            />
            <ArchitectureNode 
              name="RabbitMQ" 
              type="Message Broker" 
              desc="Queues ZIP submissions for asynchronous evaluation." 
            />
            <ArchitectureNode 
              name="MinIO" 
              type="Object Storage" 
              desc="Stores student project ZIP archives and test collections." 
            />
          </div>
        </section>

        {/* ── Footer ───────────────────────────────────────── */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 lg:px-16 bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-800">
              <span className="text-[10px] font-bold text-zinc-300">EC</span>
            </div>
            <span className="text-sm text-zinc-400 font-medium tracking-tight">EvalCore</span>
          </div>
          <p className="text-xs text-zinc-500 font-mono">
            PRN232 Automated Grading Platform
          </p>
        </footer>
      </main>
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
    title: "Upload ASP.NET project ZIP",
    description:
      "Students upload their ASP.NET project as a ZIP archive before the lab deadline.",
  },
  {
    title: "Run Docker Compose + Newman evaluation",
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
}: {
  title: string;
  description: string;
  bgClass: string;
  borderClass: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className={`flex flex-col gap-5 p-10 lg:p-12 ${bgClass} ${borderClass}`}>
      <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed flex-1">{description}</p>
      <Link
        href={href}
        className="inline-flex items-center text-sm font-medium text-zinc-300 hover:text-zinc-50 transition-colors group mt-4 w-fit"
      >
        {linkLabel}
        <span className="ml-2 block transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
}

function ArchitectureNode({ name, type, desc, highlight = false }: { name: string; type: string; desc: string; highlight?: boolean }) {
  return (
    <div className={`p-6 border rounded-sm flex flex-col gap-3 ${highlight ? "border-zinc-600 bg-zinc-800/40" : "border-zinc-800 bg-zinc-900/20"}`}>
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{type}</span>
        <h4 className="text-base font-medium text-zinc-100">{name}</h4>
      </div>
      <p className="text-sm text-zinc-400 leading-relaxed">{desc}</p>
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
    <div className="rounded-sm border border-zinc-700/60 bg-[#0a0a0a] overflow-hidden shadow-2xl">
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-zinc-800/80 px-4 py-3 bg-zinc-900/80">
        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
        <span className="ml-3 text-xs font-mono text-zinc-500 tracking-wide">
          evalcore-runner — node
        </span>
      </div>
      {/* Results */}
      <div className="p-5 space-y-3">
        <p className="text-xs font-mono text-zinc-500 mb-4 tracking-wide">
          Running PRN232 Lab 3 · 5 requests
        </p>
        {lines.map((line) => (
          <div
            key={line.label}
            className="flex items-center justify-between gap-4"
          >
            <span className="font-mono text-[13px] text-zinc-300 truncate flex-1">
              {line.label}
            </span>
            <span className="text-xs font-mono text-zinc-600">{line.ms}</span>
            <span
              className={`text-[13px] font-mono font-medium w-10 text-right tracking-wide ${
                line.status === "PASS"
                  ? "text-emerald-500"
                  : "text-red-400"
              }`}
            >
              {line.status}
            </span>
          </div>
        ))}
        <div className="pt-4 mt-5 border-t border-zinc-800/80 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-500">4 passed / 1 failed</span>
          <span className="text-[13px] font-mono font-medium text-zinc-300">
            Score: 80 / 100
          </span>
        </div>
      </div>
    </div>
  );
}
