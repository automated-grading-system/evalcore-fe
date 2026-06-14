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
            Create an account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Register as a student or lecturer.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
          id="register-form"
        >
          <div className="flex flex-col gap-2.5">
            <Label htmlFor="register-role" className="text-zinc-300">Account Type</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex items-center justify-center rounded-md border h-10 text-sm font-medium transition-colors ${
                  role === "student"
                    ? "bg-zinc-100 border-zinc-100 text-zinc-950"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole("lecturer")}
                className={`flex items-center justify-center rounded-md border h-10 text-sm font-medium transition-colors ${
                  role === "lecturer"
                    ? "bg-zinc-100 border-zinc-100 text-zinc-950"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-zinc-300"
                }`}
              >
                Lecturer
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            <Label htmlFor="register-fullname" className="text-zinc-300">Full Name</Label>
            <Input
              id="register-fullname"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              disabled={isLoading}
              className="bg-zinc-900/50 border-zinc-800 text-zinc-50 placeholder:text-zinc-600 focus-visible:border-zinc-600 h-11"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <Label htmlFor="register-email" className="text-zinc-300">Email address</Label>
            <Input
              id="register-email"
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
            <Label htmlFor="register-password" className="text-zinc-300">Password</Label>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
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
            id="register-submit-btn"
            type="submit"
            className="mt-2 bg-zinc-100 text-zinc-950 hover:bg-zinc-300 w-full h-11 font-medium disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-zinc-300 hover:text-zinc-50 transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
