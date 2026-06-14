"use client";

import { Suspense, useState, useEffect } from "react";
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
// Backend mode indicator clearly shows Mock vs Real gateway.
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

function RegisteredAlert() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  if (!justRegistered) return null;

  return (
    <Alert
      variant="success"
      className="mb-6 bg-emerald-950/20 border-emerald-900/50 text-emerald-400"
    >
      <AlertDescription>Account created successfully. Please sign in.</AlertDescription>
    </Alert>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
        // Handle specific "fetch failed" to give a better unavailable message.
        if (err.message.toLowerCase().includes("fetch failed")) {
          setError("API Gateway unavailable. Please ensure the backend is running.");
        } else {
          setError(err.message);
        }
      } else if (err instanceof TypeError && err.message === "fetch failed") {
        setError("API Gateway unavailable. Please ensure the backend is running.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Prevent hydration mismatch on the environment variable check
  if (!mounted) return null;

  return (
    <div className="w-full max-w-[380px] mx-auto pt-12 pb-24 px-6 flex flex-col min-h-[100dvh] font-sans">
      <div className="flex-1 flex flex-col justify-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-zinc-100">
              <span className="text-[10px] font-bold text-zinc-950">EC</span>
            </div>
            <span className="text-sm font-medium tracking-tight text-zinc-300">EvalCore</span>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-zinc-50">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        <Suspense fallback={null}>
          <RegisteredAlert />
        </Suspense>

        {/* Backend Mode Indicator */}
        <div className={`mb-6 rounded-md border p-3 flex items-start gap-3 ${USE_MOCK ? "bg-amber-950/20 border-amber-900/30" : "bg-emerald-950/10 border-emerald-900/30"}`}>
          <div className={`mt-0.5 h-2 w-2 rounded-full ${USE_MOCK ? "bg-amber-500" : "bg-emerald-500"}`} />
          <div className="flex flex-col gap-0.5">
            <p className={`text-xs font-medium ${USE_MOCK ? "text-amber-500/90" : "text-emerald-500/90"}`}>
              {USE_MOCK ? "Mock Auth Active" : "Real Gateway Auth Active"}
            </p>
            <p className="text-xs text-zinc-500">
              {USE_MOCK 
                ? "Using simulated local data. No backend required." 
                : "Connecting to Identity Service via API Gateway."}
            </p>
          </div>
        </div>

        {/* Demo shortcuts — Always show them to allow testing real and mock seamlessly */}
        <div className="mb-6">
          <p className="text-xs text-zinc-500 mb-3 font-medium uppercase tracking-wider">
            Demo Accounts
          </p>
          <div className="flex gap-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.id}
                id={account.id}
                type="button"
                variant="outline"
                size="xs"
                className="flex-1 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-50 bg-zinc-900/30"
                onClick={() => fillDemo(account)}
              >
                {account.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          id="login-form"
        >
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="login-email" className="text-zinc-300">Email address</Label>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="bg-zinc-900/50 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:border-zinc-600 h-11"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="login-password" className="text-zinc-300">Password</Label>
              <Link href="#" className="text-xs text-zinc-500 hover:text-zinc-300">
                Forgot password?
              </Link>
            </div>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="bg-zinc-900/50 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:border-zinc-600 h-11"
            />
          </div>

          {error && (
            <Alert
              variant="destructive"
              className="bg-red-950/20 border-red-900/50 text-red-400 mt-1"
            >
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            id="login-submit-btn"
            type="submit"
            className="mt-2 bg-zinc-100 text-zinc-950 hover:bg-zinc-300 w-full h-11 font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-zinc-300 hover:text-zinc-50 transition-colors font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
