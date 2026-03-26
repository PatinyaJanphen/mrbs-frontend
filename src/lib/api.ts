import { toast } from "sonner";
import { getToken, clearAuth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface RequestOptions extends RequestInit {
    params?: Record<string, string>;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, ...init } = options;
    
    // 1. Handle Query Parameters
    let url = `${API_URL}/api${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    if (params) {
        const query = new URLSearchParams(params).toString();
        url += `?${query}`;
    }

    // 2. Handle Headers (including JWT Token)
    const token = getToken();
    const headers = new Headers(init.headers);
    headers.set("Accept", "application/json");
    if (!(init.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    try {
        const response = await fetch(url, {
            ...init,
            headers,
        });

        // 3. Handle General Errors
        if (response.status === 401) {
            // Token expired or invalid
            clearAuth();
            window.location.href = "/login?error=session_expired";
            throw new Error("Session expired");
        }

        const data = await response.json();

        if (!response.ok) {
            const errorMsg = data.message || "Something went wrong";
            toast.error(errorMsg);
            throw new Error(errorMsg);
        }

        return data as T;
    } catch (error) {
        if (error instanceof Error && error.message !== "Session expired") {
            console.error("API Error:", error);
        }
        throw error;
    }
}

// Helper methods
export const api = {
    get: <T>(url: string, params?: Record<string, string>) => apiFetch<T>(url, { method: "GET", params }),
    post: <T>(url: string, body: any) => apiFetch<T>(url, { method: "POST", body: JSON.stringify(body) }),
    put: <T>(url: string, body: any) => apiFetch<T>(url, { method: "PUT", body: JSON.stringify(body) }),
    delete: <T>(url: string) => apiFetch<T>(url, { method: "DELETE" }),
};
