import { useQuery } from '@tanstack/react-query'
import { bookingService } from '@/services/booking.service'
import { QUERY_KEYS } from '@/constants/query-keys'

export interface BookingListParams {
    page?: number
    per_page?: number
    status?: string
    resource_id?: number
    from?: string
    to?: string
}

export function useBookings(params?: BookingListParams, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...QUERY_KEYS.BOOKINGS.ALL, params],
        queryFn: () => bookingService.list(params),
        enabled: options?.enabled,
    })
}

export function useMyBookings(params?: BookingListParams, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: [...QUERY_KEYS.BOOKINGS.MY, params],
        queryFn: () => bookingService.myBookings(params),
        enabled: options?.enabled,
    })
}

export function useBooking(id: number, options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEYS.BOOKINGS.DETAIL(id),
        queryFn: () => bookingService.get(id),
        enabled: options?.enabled,
    })
}
