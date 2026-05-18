import { useQuery } from '@tanstack/react-query'
import { roomService } from '@/services/room.service'
import { QUERY_KEYS } from '@/constants/query-keys'

export function useRooms(params?: { page?: number; per_page?: number; search?: string; is_active?: boolean }, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...QUERY_KEYS.ROOMS.ALL, params],
        queryFn: () => roomService.list(params),
        enabled: options?.enabled,
    })
}

export function useRoom(id: number, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEYS.ROOMS.DETAIL(id),
        queryFn: () => roomService.get(id),
        enabled: options?.enabled,
    })
}
