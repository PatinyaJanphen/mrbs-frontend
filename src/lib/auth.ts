import { useAuthStore, type AuthUser } from "@/stores/auth.store";

export type { AuthUser };

export function getToken(): string | null {
  return useAuthStore.getState().token;
}

export function getUser(): AuthUser | null {
  return useAuthStore.getState().user;
}

export function setAuth(token: string, user: AuthUser) {
  useAuthStore.getState().setAuth(token, user);
}

export function clearAuth() {
  useAuthStore.getState().clearAuth();
}

export function isAuthenticated(): boolean {
  return useAuthStore.getState().isAuthenticated();
}

export function getUserId(): number | null {
  return getUser()?.id ?? null;
}
