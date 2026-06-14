"use client";

import { AuthProvider } from "@/lib/auth/auth-context";

// ============================================================
// Providers wrapper for Next.js App Router.
//
// Add all client-side providers here. This file is the only
// place in the tree that breaks out of React Server Components.
// ============================================================

export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
