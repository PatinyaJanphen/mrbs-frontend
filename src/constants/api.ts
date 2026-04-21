// API endpoint paths — use in services
export const API_ROUTES = {
    AUTH: {
        ME: '/auth/me',
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        GOOGLE_REDIRECT: '/auth/google/redirect',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
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
        UPDATE: (id: number) => `/bookings/${id}`,
        CANCEL: (id: number) => `/bookings/${id}/cancel`,
        APPROVE: (id: number) => `/bookings/${id}/approve`,
        REJECT: (id: number) => `/bookings/${id}/reject`,
    },
} as const
