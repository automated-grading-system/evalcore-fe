"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "lecturer">("student");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;
    setError(null);
    setIsLoading(true);

    try {
      await register(fullName, email, password, role);
      // Redirect to /login?registered=true is handled inside auth context.
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.message.toLowerCase().includes("fetch failed")) {
          setError(
            "API Gateway unavailable. Please ensure the backend is running.",
          );
        } else {
          setError(err.message);
        }
      } else if (err instanceof TypeError && err.message === "fetch failed") {
        setError(
          "API Gateway unavailable. Please ensure the backend is running.",
        );
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md py-4">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
          Join the workspace
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-foreground">
          Create an account
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Choose your role and set up your EvalCore access.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
        id="register-form"
      >
        <fieldset className="flex flex-col gap-2.5">
          <legend className="text-sm font-medium">Account type</legend>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("student")}
              aria-pressed={role === "student"}
              disabled={isLoading}
              className={`flex items-center justify-center rounded-md border h-10 text-sm font-medium transition-colors ${
                role === "student"
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("lecturer")}
              aria-pressed={role === "lecturer"}
              disabled={isLoading}
              className={`flex items-center justify-center rounded-md border h-10 text-sm font-medium transition-colors ${
                role === "lecturer"
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              Lecturer
            </button>
          </div>
        </fieldset>

        <div className="flex flex-col gap-2.5">
          <Label htmlFor="register-fullname">Full name</Label>
          <Input
            id="register-fullname"
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={isLoading}
            className="h-11 bg-card"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Label htmlFor="register-email">Email address</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="h-11 bg-card"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="h-11 bg-card"
          />
        </div>

        {error && (
          <Alert variant="destructive" className="mt-1">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          id="register-submit-btn"
          type="submit"
          className="mt-2 h-11 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
