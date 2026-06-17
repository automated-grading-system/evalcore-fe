export type Role = "student" | "lecturer" | "admin";

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type ApiError = ApiErrorPayload;

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiErrorPayload | null;
}

export interface PagedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

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
