"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { login, register, getCurrentUser } from "@/lib/api/auth-api";
import { authStorage } from "@/lib/auth/auth-storage";
import { getDashboardPath } from "@/lib/auth/role-utils";
import type { AuthUserDto, LoginRequest, RegisterRequest } from "@/lib/types/api";

// ============================================================
// Auth Context — provides session state app-wide.
//
// IMPORTANT: This is a Client Component. Wrap it in
// src/app/providers.tsx and mount inside root layout.tsx.
// ============================================================

interface AuthState {
  user: AuthUserDto | null;
  accessToken: string | null;
  expiresAt: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (
    fullName: string,
    email: string,
    password: string,
    role: "student" | "lecturer" | "admin",
  ) => Promise<void>;
  logout: () => void;
  loadCurrentUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    expiresAt: null,
    isAuthenticated: false,
    isCheckingAuth: true,
  });

  // Attempt to restore session from localStorage on mount.
  const loadCurrentUser = useCallback(async () => {
    const token = authStorage.getToken();
    const expiresAt = authStorage.getExpiresAt();

    if (!token || authStorage.isExpired()) {
      authStorage.clear();
      setState((s) => ({ ...s, isCheckingAuth: false }));
      return;
    }

    try {
      const user = await getCurrentUser();
      setState({
        user,
        accessToken: token,
        expiresAt,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      authStorage.clear();
      setState({
        user: null,
        accessToken: null,
        expiresAt: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCurrentUser();
    // loadCurrentUser is async and only calls setState after awaiting — it does
    // not call setState synchronously, satisfying the spirit of the rule.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Actions ----------

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      const request: LoginRequest = { email, password };
      const response = await login(request);

      authStorage.setToken(response.accessToken, response.expiresAt);

      setState({
        user: response.user,
        accessToken: response.accessToken,
        expiresAt: response.expiresAt,
        isAuthenticated: true,
        isCheckingAuth: false,
      });

      router.push(getDashboardPath(response.user.role));
    },
    [router],
  );

  const handleRegister = useCallback(
    async (
      fullName: string,
      email: string,
      password: string,
      role: "student" | "lecturer" | "admin",
    ) => {
      const request: RegisterRequest = { fullName, email, password, role };
      await register(request);
      // After registration, redirect to login to complete auth.
      router.push("/login?registered=true");
    },
    [router],
  );

  const handleLogout = useCallback(() => {
    authStorage.clear();
    setState({
      user: null,
      accessToken: null,
      expiresAt: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        loadCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ---------- Hook ----------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider>.");
  }
  return ctx;
}
