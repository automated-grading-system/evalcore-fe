"use client";

import {
  AlertCircleIcon,
  ArrowRightIcon,
  CheckCircle2Icon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiClientError } from "@/lib/api/client";
import { useAuth } from "@/lib/auth/auth-context";

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
  const registered = useSearchParams().get("registered") === "true";
  if (!registered) return null;
  return (
    <Alert variant="success">
      <CheckCircle2Icon />
      <AlertDescription>
        Account created successfully. You can sign in now.
      </AlertDescription>
    </Alert>
  );
}

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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (isLoading) return;
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (caught) {
      if (caught instanceof ApiClientError) {
        setError(
          caught.message.toLowerCase().includes("fetch failed")
            ? "EvalCore cannot reach the API Gateway. Check that the local stack is running, then try again."
            : caught.message,
        );
      } else if (
        caught instanceof TypeError &&
        caught.message === "fetch failed"
      ) {
        setError(
          "EvalCore cannot reach the API Gateway. Check that the local stack is running, then try again.",
        );
      } else {
        setError(
          "We could not sign you in. Please check your details and try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Welcome back
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em]">
          Sign in to EvalCore
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Continue to your role-aware evaluation workspace.
        </p>
      </div>

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <span
          className={`size-2.5 rounded-full ${USE_MOCK ? "bg-warning" : "bg-success"}`}
        />
        <div>
          <p className="text-xs font-semibold">
            {USE_MOCK ? "Local mock mode" : "API Gateway mode"}
          </p>
          <p className="text-xs text-muted-foreground">
            {USE_MOCK
              ? "Authentication uses local simulated data."
              : "Authentication uses the live local Identity Service."}
          </p>
        </div>
      </div>

      <Suspense fallback={null}>
        <RegisteredAlert />
      </Suspense>

      <div className="my-6">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
            Demo access
          </p>
          <span className="text-[11px] text-muted-foreground">
            Fill credentials
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {DEMO_ACCOUNTS.map((account) => (
            <Button
              key={account.id}
              id={account.id}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemo(account)}
            >
              {account.label}
            </Button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email address</Label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={isLoading}
            className="h-11 bg-card"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            disabled={isLoading}
            className="h-11 bg-card"
          />
        </div>
        {error ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}
        <Button
          id="login-submit-btn"
          type="submit"
          className="h-11 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing in…" : "Sign in"}
          {!isLoading ? <ArrowRightIcon /> : null}
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-muted-foreground">
        New to EvalCore?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
