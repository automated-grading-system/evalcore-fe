// ============================================================
// Shared API types for EvalCore frontend.
// All types reflect the backend response envelope contract.
// ============================================================

export type Role = "student" | "lecturer" | "admin";

// ---------- Error ----------

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

// ---------- Envelope ----------

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

// ---------- Pagination ----------

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ---------- User DTOs ----------

export interface AuthUserDto {
  id: string;
  fullName: string;
  email: string;
  role: Role;
}

export interface AccountDto {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------- Auth Requests & Responses ----------

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAt: string;
  user: AuthUserDto;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}
