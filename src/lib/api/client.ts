import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
} from "axios";

import { authStorage } from "@/lib/auth/auth-storage";
import { ApiClientError } from "@/lib/api/errors";
import type { ApiErrorPayload, ApiResponse } from "@/types/api";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:8080";

function redirectToLogin(): void {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/login") return;
  window.location.assign("/login");
}

function handleUnauthorized(): void {
  authStorage.clear();
  redirectToLogin();
}

function isApiEnvelope<T>(body: unknown): body is ApiResponse<T> {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    typeof (body as { success?: unknown }).success === "boolean"
  );
}

export function unwrapApiResponse<T>(
  response: AxiosResponse<ApiResponse<T> | T>,
): T {
  if (response.status === 204) {
    return undefined as T;
  }

  const body = response.data;

  if (!isApiEnvelope<T>(body)) {
    return body as T;
  }

  if (body.success) {
    return body.data as T;
  }

  const error = body.error;
  throw new ApiClientError(
    error?.code ?? "UNKNOWN_ERROR",
    error?.message ?? "An unexpected API error occurred.",
    error?.details,
    response.status,
  );
}

function errorFromPayload(
  payload: ApiErrorPayload | null | undefined,
  status?: number,
): ApiClientError {
  return new ApiClientError(
    payload?.code ?? "HTTP_ERROR",
    payload?.message ?? "The server returned an error.",
    payload?.details,
    status,
  );
}

function normalizeAxiosError(error: AxiosError): ApiClientError {
  if (!error.response) {
    return new ApiClientError(
      "GATEWAY_UNAVAILABLE",
      "API Gateway is unavailable. Make sure the Docker stack is running.",
    );
  }

  const status = error.response.status;
  const data = error.response.data;

  if (status === 401) {
    handleUnauthorized();
  }

  if (isApiEnvelope<unknown>(data)) {
    return errorFromPayload(data.error, status);
  }

  if (status === 401) {
    return new ApiClientError(
      "UNAUTHORIZED",
      "Session expired. Please log in again.",
      undefined,
      status,
    );
  }

  if (status === 403) {
    return new ApiClientError(
      "FORBIDDEN",
      "You do not have permission to access this resource.",
      undefined,
      status,
    );
  }

  return new ApiClientError(
    "HTTP_ERROR",
    "The server returned an unexpected response.",
    undefined,
    status,
  );
}

export function normalizeApiError(error: unknown): ApiClientError {
  if (error instanceof ApiClientError) {
    if (error.status === 401 || error.code === "UNAUTHORIZED") {
      handleUnauthorized();
    }
    return error;
  }

  if (axios.isAxiosError(error)) {
    return normalizeAxiosError(error);
  }

  if (error instanceof Error) {
    return new ApiClientError("CLIENT_ERROR", error.message);
  }

  return new ApiClientError(
    "UNKNOWN_ERROR",
    "An unexpected error occurred. Please try again.",
  );
}

export const gatewayClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

gatewayClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function request<T>(
  config: AxiosRequestConfig,
): Promise<T> {
  try {
    const response = await gatewayClient.request<ApiResponse<T> | T>(config);
    return unwrapApiResponse<T>(response);
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export function apiGet<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({ ...config, method: "GET", url });
}

export function apiPost<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({ ...config, method: "POST", url, data });
}

export function apiPut<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({ ...config, method: "PUT", url, data });
}

export function apiPatch<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({ ...config, method: "PATCH", url, data });
}

export function apiDelete<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return request<T>({ ...config, method: "DELETE", url });
}

export { ApiClientError } from "@/lib/api/errors";
