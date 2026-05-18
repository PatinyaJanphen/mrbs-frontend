export const QUERY_KEYS = {
    DASHBOARD: {
        STATS: ['dashboard-stats'] as const,
    },
    ROOMS: {
        ALL: ['rooms'] as const,
        DETAIL: (id: number) => ['room', id] as const,
    },
    BOOKINGS: {
        ALL: ['bookings'] as const,
        MY: ['my-bookings'] as const,
        DETAIL: (id: number) => ['booking', id] as const,
        HISTORY: (roomId: number) => ['room-booking-history', roomId] as const,
        TODAY: (roomId: number) => ['room-bookings-today', roomId] as const,
    },
    AUTH: {
        USER: ['auth-user'] as const,
    },
}
