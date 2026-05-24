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
    USERS: {
        LIST: '/users',
        DETAIL: (id: number) => `/users/${id}`,
        CREATE: '/users',
        UPDATE: (id: number) => `/users/${id}`,
        TOGGLE_ACTIVE: (id: number) => `/users/${id}/toggle-active`,
        BOOKINGS: (id: number) => `/users/${id}/bookings`,
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
    PROFILE: {
        UPDATE: '/profile',
        UPDATE_PASSWORD: '/profile/password',
    },
} as const
