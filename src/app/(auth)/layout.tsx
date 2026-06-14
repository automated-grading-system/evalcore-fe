// Auth route group layout — minimal, centered, no sidebar.
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-zinc-950 text-zinc-50">
      {/* Simple brand header */}
      <div className="flex h-14 items-center border-b border-zinc-800 px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-50">
            <span className="text-xs font-bold text-zinc-950">EC</span>
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-50">
            EvalCore
          </span>
        </Link>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
