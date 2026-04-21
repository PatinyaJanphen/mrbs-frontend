import { apiClient } from '@/lib/axios'
import { API_ROUTES } from '@/constants'
import type { AuthUser } from '@/types'

export const authService = {
    getMe: async (): Promise<AuthUser> => {
        const { data } = await apiClient.get<AuthUser>(API_ROUTES.AUTH.ME)
        return data
    },

    loginWithEmail: async (data: Record<string, string>) => {
        const response = await apiClient.post<{ message: string; token: string; user: AuthUser }>(API_ROUTES.AUTH.LOGIN, data);
        return response.data;
    },

    forgotPassword: async (data: { email: string }) => {
        const response = await apiClient.post<{ message: string }>(API_ROUTES.AUTH.FORGOT_PASSWORD, data);
        return response.data;
    },

    resetPassword: async (data: Record<string, string>) => {
        const response = await apiClient.post<{ message: string }>(API_ROUTES.AUTH.RESET_PASSWORD, data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post(API_ROUTES.AUTH.LOGOUT)
    },
}
