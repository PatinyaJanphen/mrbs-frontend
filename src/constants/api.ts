// API endpoint paths — use in services
export const API_ROUTES = {
    AUTH: {
        ME: '/auth/me',
        LOGOUT: '/auth/logout',
        GOOGLE_REDIRECT: '/auth/google/redirect',
    },
    ROOMS: {
        LIST: '/rooms',
        DETAIL: (id: number) => `/rooms/${id}`,
        CREATE: '/rooms',
        UPDATE: (id: number) => `/rooms/${id}`,
        DELETE: (id: number) => `/rooms/${id}`,
    },
    BOOKINGS: {
        LIST: '/bookings',
        MY: '/bookings/my',
        DETAIL: (id: number) => `/bookings/${id}`,
        CREATE: '/bookings',
        CANCEL: (id: number) => `/bookings/${id}/cancel`,
        APPROVE: (id: number) => `/bookings/${id}/approve`,
    },
} as const
