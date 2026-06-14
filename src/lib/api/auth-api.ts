// ============================================================
// Auth API module.
//
// - When NEXT_PUBLIC_USE_MOCK_AUTH=true, uses local mock data.
// - When false, calls real Identity Service via API Gateway.
// - Mock logic stays ONLY in this module; pages are clean.
// ============================================================

import { ApiClientError, apiGet, apiPost } from "@/lib/api/client";
import type {
  AccountDto,
  AuthUserDto,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/lib/types/api";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";

// ---------- Mock data ----------

interface MockUser {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  password: string;
}

const MOCK_USERS: MockUser[] = [
  {
    id: "mock-student-001",
    fullName: "Student Demo",
    email: "student@ags.local",
    role: "student",
    password: "Password123!",
  },
  {
    id: "mock-lecturer-001",
    fullName: "Lecturer Demo",
    email: "lecturer@ags.local",
    role: "lecturer",
    password: "Password123!",
  },
  {
    id: "mock-admin-001",
    fullName: "Admin Demo",
    email: "admin@ags.local",
    role: "admin",
    password: "Password123!",
  },
];

const MOCK_TOKEN_PREFIX = "mock_token_";

function buildMockToken(userId: string): string {
  return `${MOCK_TOKEN_PREFIX}${userId}`;
}

function resolveMockUserId(token: string): string | null {
  if (!token.startsWith(MOCK_TOKEN_PREFIX)) return null;
  return token.slice(MOCK_TOKEN_PREFIX.length);
}

async function mockLogin(request: LoginRequest): Promise<LoginResponse> {
  await new Promise((r) => setTimeout(r, 400)); // simulate latency

  const user = MOCK_USERS.find((u) => u.email === request.email);
  if (!user || user.password !== request.password) {
    throw new ApiClientError(
      "INVALID_CREDENTIALS",
      "Invalid email or password.",
    );
  }

  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString();

  return {
    accessToken: buildMockToken(user.id),
    expiresAt,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
}

async function mockRegister(request: RegisterRequest): Promise<AccountDto> {
  await new Promise((r) => setTimeout(r, 400));

  const existing = MOCK_USERS.find((u) => u.email === request.email);
  if (existing) {
    throw new ApiClientError("EMAIL_TAKEN", "This email is already registered.");
  }

  const now = new Date().toISOString();
  return {
    id: `mock-${Date.now()}`,
    fullName: request.fullName,
    email: request.email,
    role: request.role,
    isLocked: false,
    createdAt: now,
    updatedAt: now,
  };
}

async function mockGetCurrentUser(token: string): Promise<AuthUserDto> {
  await new Promise((r) => setTimeout(r, 200));

  const userId = resolveMockUserId(token);
  const user = MOCK_USERS.find((u) => u.id === userId);
  if (!user) {
    throw new ApiClientError("UNAUTHORIZED", "Invalid or expired session.", undefined, 401);
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
}

// ---------- Public API ----------

export async function login(request: LoginRequest): Promise<LoginResponse> {
  if (USE_MOCK) return mockLogin(request);
  return apiPost<LoginResponse>("/api/auth/login", request);
}

export async function register(
  request: RegisterRequest,
): Promise<AccountDto> {
  if (USE_MOCK) return mockRegister(request);
  return apiPost<AccountDto>("/api/auth/register", request);
}

export async function getCurrentUser(): Promise<AuthUserDto> {
  if (USE_MOCK) {
    // Dynamically read token at call time to avoid stale closure.
    const { authStorage } = await import("@/lib/auth/auth-storage");
    const token = authStorage.getToken();
    if (!token) {
      throw new ApiClientError("UNAUTHORIZED", "No session found.", undefined, 401);
    }
    return mockGetCurrentUser(token);
  }
  return apiGet<AuthUserDto>("/api/users/me");
}
