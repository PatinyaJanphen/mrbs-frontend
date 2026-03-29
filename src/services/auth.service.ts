import { apiClient } from '@/lib/axios'
import { API_ROUTES } from '@/constants'
import type { AuthUser } from '@/types'

export const authService = {
    getMe: async (): Promise<AuthUser> => {
        const { data } = await apiClient.get<AuthUser>(API_ROUTES.AUTH.ME)
        return data
    },

    logout: async (): Promise<void> => {
        await apiClient.post(API_ROUTES.AUTH.LOGOUT)
    },
}
