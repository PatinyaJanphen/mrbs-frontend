import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from '@/constants/app'

export interface AuthUser {
    id: number
    name: string
    email: string
    avatar?: string
    role: UserRole
    company_id: number
    phone?: string
    department?: string
}

interface AuthState {
    token: string | null
    user: AuthUser | null
    setAuth: (token: string, user: AuthUser) => void
    clearAuth: () => void
    isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            setAuth: (token, user) => set({ token, user }),
            clearAuth: () => set({ token: null, user: null }),
            isAuthenticated: () => !!get().token,
        }),
        {
            name: 'mrbs-auth-storage', // unique name
        }
    )
)
