import axios from "axios";
import { toast } from "sonner";
import { clearAuth, getToken } from "./auth";

export const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? "http://localhost:8000"}/api`,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message as string | undefined;

      if (status === 401) {
        // Token expired or invalid
        clearAuth();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
        return Promise.reject(error);
      }

      if (status === 403) {
        toast.error("คุณไม่มีสิทธิ์ในการดำเนินการนี้");
      } else if (status === 422) {
        //
      } else if (status && status >= 500) {
        toast.error("เกิดข้อผิดพลาดกรุณาลองอีกครั้ง");
      } else if (message) {
        toast.error(message);
      }
    } else if (error.code === "ERR_NETWORK") {
      toast.error("ไม่สามารถเชื่อมต่อได้");
    }

    return Promise.reject(error);
  },
);
