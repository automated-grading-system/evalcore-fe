"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// ============================================================
// Login Page
//
// Taste Skill: focused, corporate, no decorative noise.
// Form: label above input, error below, loading state.
// Demo autofill: fills email/password only, no side effects.
// useSearchParams is wrapped in Suspense per Next.js App Router rules.
// ============================================================

interface DemoAccount {
  label: string;
  email: string;
  password: string;
  id: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    label: "Student",
    email: "student@ags.local",
    password: "Password123!",
    id: "demo-student-btn",
  },
  {
    label: "Lecturer",
    email: "lecturer@ags.local",
    password: "Password123!",
    id: "demo-lecturer-btn",
  },
  {
    label: "Admin",
    email: "admin@ags.local",
    password: "Password123!",
    id: "demo-admin-btn",
  },
];

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

// ---- Inner component with searchParams (must be in Suspense) ----

function RegisteredAlert() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  if (!justRegistered) return null;

  return (
    <Alert
      variant="success"
      className="mb-5 bg-emerald-950/30 border-emerald-800 text-emerald-300"
    >
      <AlertDescription>Account created. Sign in to continue.</AlertDescription>
    </Alert>
  );
}

// ---- Main page ----

export default function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function fillDemo(account: DemoAccount) {
    setEmail(account.email);
    setPassword(account.password);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect is handled inside auth context.
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-xl font-semibold tracking-tight text-zinc-50">
          Sign in to EvalCore
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Enter your credentials to continue.
        </p>
      </div>

      {/* Registered success message — wrapped in Suspense */}
      <Suspense fallback={null}>
        <RegisteredAlert />
      </Suspense>

      {/* Demo shortcuts — only shown when mock mode is enabled */}
      {USE_MOCK && (
        <div className="mb-5 rounded-lg border border-zinc-800 bg-zinc-900 p-3">
          <p className="text-xs text-zinc-500 mb-2.5">
            Demo accounts (mock mode)
          </p>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.id}
                id={account.id}
                type="button"
                variant="outline"
                size="xs"
                className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50"
                onClick={() => fillDemo(account)}
              >
                {account.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
        id="login-form"
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="login-email">Email</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 focus-visible:border-zinc-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 focus-visible:border-zinc-500"
          />
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-950/30 border-red-900 text-red-300"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          id="login-submit-btn"
          type="submit"
          className="mt-1 bg-zinc-50 text-zinc-950 hover:bg-zinc-200 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-500">
        No account?{" "}
        <Link
          href="/register"
          className="text-zinc-300 hover:text-zinc-50 underline underline-offset-4"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
