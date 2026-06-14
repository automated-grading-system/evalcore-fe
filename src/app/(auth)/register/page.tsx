"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-context";
import { ApiClientError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Role } from "@/lib/types/api";

// ============================================================
// Register Page
//
// Taste Skill: focused form, clear validation, no noise.
// Role selector: student and lecturer only by default.
// ============================================================

export default function RegisterPage() {
  const { register } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isLoading) return;

    // Basic client-side validation
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = "Full name is required.";
    if (!email.trim()) errors.email = "Email is required.";
    if (password.length < 8)
      errors.password = "Password must be at least 8 characters.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});
    setError(null);
    setIsLoading(true);

    try {
      await register(fullName.trim(), email.trim(), password, role);
      // Redirect is handled inside auth context (→ /login?registered=true)
    } catch (err) {
      if (err instanceof ApiClientError) {
        if (err.details) {
          const mapped: Record<string, string> = {};
          for (const [key, msgs] of Object.entries(err.details)) {
            mapped[key] = msgs[0];
          }
          setFieldErrors(mapped);
        } else {
          setError(err.message);
        }
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
          Create your account
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Join EvalCore as a student or lecturer.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" id="register-form">
        {/* Full name */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-fullname">Full name</Label>
          <Input
            id="register-fullname"
            type="text"
            autoComplete="name"
            placeholder="Jane Smith"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={isLoading}
            aria-invalid={!!fieldErrors.fullName}
            className="bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 focus-visible:border-zinc-500"
          />
          {fieldErrors.fullName && (
            <p className="text-xs text-red-400">{fieldErrors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-email">Email</Label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            aria-invalid={!!fieldErrors.email}
            className="bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 focus-visible:border-zinc-500"
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-400">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-password">Password</Label>
          <Input
            id="register-password"
            type="password"
            autoComplete="new-password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            aria-invalid={!!fieldErrors.password}
            className="bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600 focus-visible:border-zinc-500"
          />
          {fieldErrors.password && (
            <p className="text-xs text-red-400">{fieldErrors.password}</p>
          )}
        </div>

        {/* Role */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="register-role">Role</Label>
          <select
            id="register-role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            disabled={isLoading}
            className="flex h-9 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm text-zinc-50 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/50 focus-visible:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
          </select>
        </div>

        {error && (
          <Alert variant="destructive" className="bg-red-950/30 border-red-900 text-red-300">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          id="register-submit-btn"
          type="submit"
          className="mt-1 bg-zinc-50 text-zinc-950 hover:bg-zinc-200 w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-zinc-300 hover:text-zinc-50 underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
