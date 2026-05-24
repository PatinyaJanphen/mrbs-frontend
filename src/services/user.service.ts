import { API_ROUTES } from '@/constants'
import { apiClient } from '@/lib/axios'
import type { ApiResponse, ManagedUser, PaginatedUserBookings, PaginatedUsers, UpsertUserDto } from '@/types'

export interface UserListParams {
    page?: number
    per_page?: number
    search?: string
    role?: string
    is_active?: string
}

export const userService = {
    list: async (params?: UserListParams): Promise<PaginatedUsers> => {
        const { data } = await apiClient.get<PaginatedUsers>(API_ROUTES.USERS.LIST, { params })
        return data
    },

    get: async (id: number): Promise<ManagedUser> => {
        const { data } = await apiClient.get<ApiResponse<ManagedUser>>(API_ROUTES.USERS.DETAIL(id))
        return data.data
    },

    create: async (payload: UpsertUserDto): Promise<ManagedUser> => {
        const { data } = await apiClient.post<ApiResponse<ManagedUser>>(API_ROUTES.USERS.CREATE, payload)
        return data.data
    },

    update: async (id: number, payload: UpsertUserDto): Promise<ManagedUser> => {
        const { data } = await apiClient.put<ApiResponse<ManagedUser>>(API_ROUTES.USERS.UPDATE(id), payload)
        return data.data
    },

    toggleActive: async (id: number): Promise<ManagedUser> => {
        const { data } = await apiClient.post<ApiResponse<ManagedUser>>(API_ROUTES.USERS.TOGGLE_ACTIVE(id))
        return data.data
    },

    bookings: async (id: number, params?: { page?: number; per_page?: number }): Promise<PaginatedUserBookings> => {
        const { data } = await apiClient.get<PaginatedUserBookings>(API_ROUTES.USERS.BOOKINGS(id), { params })
        return data
    },
}
