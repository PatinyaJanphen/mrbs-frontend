import { useQuery } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/query-keys'
import { userService, type UserListParams } from '@/services/user.service'

export function useUsers(params?: UserListParams, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...QUERY_KEYS.USERS.ALL, params],
        queryFn: () => userService.list(params),
        enabled: options?.enabled,
    })
}

export function useUser(id: number, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEYS.USERS.DETAIL(id),
        queryFn: () => userService.get(id),
        enabled: options?.enabled,
    })
}

export function useUserBookings(id: number, params?: { page?: number; per_page?: number }, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...QUERY_KEYS.USERS.BOOKINGS(id), params],
        queryFn: () => userService.bookings(id, params),
        enabled: options?.enabled,
    })
}
