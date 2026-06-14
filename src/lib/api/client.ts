// ============================================================
// Central API client for EvalCore frontend.
//
// - All requests go through NEXT_PUBLIC_API_URL (API Gateway).
// - Attaches Bearer token from auth storage automatically.
// - Parses ApiResponse<T> envelope; throws on success=false.
// - Never import this from pages; use API modules instead.
// ============================================================

import { authStorage } from "@/lib/auth/auth-storage";
import type { ApiResponse } from "@/lib/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";

// ---------- Typed API error ----------

export class ApiClientError extends Error {
  public readonly code: string;
  public readonly details?: Record<string, string[]>;
  public readonly status?: number;

  constructor(
    code: string,
    message: string,
    details?: Record<string, string[]>,
    status?: number,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.code = code;
    this.details = details;
    this.status = status;
  }
}

// ---------- Request options ----------

export interface RequestOptions {
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

// ---------- Internal helpers ----------

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...extra,
  };

  const token = authStorage.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 204) {
    return undefined as T;
  }

  let body: ApiResponse<T>;
  try {
    body = await res.json();
  } catch {
    throw new ApiClientError(
      "PARSE_ERROR",
      "Server returned a non-JSON response.",
      undefined,
      res.status,
    );
  }

  if (res.status === 401) {
    authStorage.clear();
    throw new ApiClientError(
      "UNAUTHORIZED",
      "Session expired. Please log in again.",
      undefined,
      401,
    );
  }

  if (!body.success || body.data === null) {
    const err = body.error;
    throw new ApiClientError(
      err?.code ?? "UNKNOWN_ERROR",
      err?.message ?? "An unexpected error occurred.",
      err?.details,
      res.status,
    );
  }

  return body.data as T;
}

// ---------- Public helpers ----------

export async function apiGet<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: buildHeaders(options?.headers),
    signal: options?.signal,
  });
  return handleResponse<T>(res);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: buildHeaders(options?.headers),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  });
  return handleResponse<T>(res);
}

export async function apiPut<T>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PUT",
    headers: buildHeaders(options?.headers),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  });
  return handleResponse<T>(res);
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  options?: RequestOptions,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "PATCH",
    headers: buildHeaders(options?.headers),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: options?.signal,
  });
  return handleResponse<T>(res);
}

export async function apiDelete<T>(
  path: string,
  options?: RequestOptions,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "DELETE",
    headers: buildHeaders(options?.headers),
    signal: options?.signal,
  });
  return handleResponse<T>(res);
}
