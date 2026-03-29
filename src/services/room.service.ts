import { apiClient } from '@/lib/axios'
import { API_ROUTES } from '@/constants'
import type { Room, CreateRoomDto, UpdateRoomDto, PaginatedRooms } from '@/types'

interface RoomListParams {
    page?: number
    per_page?: number
    search?: string
    is_active?: boolean
}

export const roomService = {
    list: async (params?: RoomListParams): Promise<PaginatedRooms> => {
        const { data } = await apiClient.get<PaginatedRooms>(API_ROUTES.ROOMS.LIST, { params })
        return data
    },

    get: async (id: number): Promise<Room> => {
        const { data } = await apiClient.get<Room>(API_ROUTES.ROOMS.DETAIL(id))
        return data
    },

    create: async (payload: CreateRoomDto): Promise<Room> => {
        const { data } = await apiClient.post<Room>(API_ROUTES.ROOMS.CREATE, payload)
        return data
    },

    update: async (id: number, payload: UpdateRoomDto): Promise<Room> => {
        const { data } = await apiClient.put<Room>(API_ROUTES.ROOMS.UPDATE(id), payload)
        return data
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(API_ROUTES.ROOMS.DELETE(id))
    },
}
