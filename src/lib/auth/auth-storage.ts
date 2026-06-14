// ============================================================
// Auth storage helpers — read/write token to localStorage.
// All localStorage access is isolated here; never call
// localStorage directly from pages or components.
// ============================================================

const TOKEN_KEY = "evalcore_access_token";
const EXPIRES_KEY = "evalcore_token_expires_at";

export const authStorage = {
  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getExpiresAt(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(EXPIRES_KEY);
  },

  setToken(token: string, expiresAt: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(EXPIRES_KEY, expiresAt);
  },

  clear(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
  },

  isExpired(): boolean {
    const expiresAt = authStorage.getExpiresAt();
    if (!expiresAt) return true;
    return new Date(expiresAt) <= new Date();
  },
};
