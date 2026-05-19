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

    updateProfile: async (data: { name: string; phone?: string; department?: string; avatar?: File | null } | FormData): Promise<{ success: boolean; message: string; user: AuthUser }> => {
        let payload: FormData;
        if (data instanceof FormData) {
            payload = data;
        } else {
            payload = new FormData();
            payload.append('name', data.name);
            if (data.phone) payload.append('phone', data.phone);
            if (data.department) payload.append('department', data.department);
            if (data.avatar) payload.append('avatar', data.avatar);
        }

        const response = await apiClient.post<{ success: boolean; message: string; user: AuthUser }>(API_ROUTES.PROFILE.UPDATE, payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        })
        return response.data
    },

    updatePassword: async (data: Record<string, string>): Promise<{ success: boolean; message: string }> => {
        const response = await apiClient.put<{ success: boolean; message: string }>(API_ROUTES.PROFILE.UPDATE_PASSWORD, data)
        return response.data
    },
}
