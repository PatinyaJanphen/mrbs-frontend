import type { UserRole } from '@/constants/app'

const TOKEN_KEY = 'mrbs_token'
const USER_KEY = 'mrbs_user'

export interface AuthUser {
    name: string
    email: string
    avatar?: string
    role: UserRole
}

// Simple reactive store helpers
export function getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): AuthUser | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(USER_KEY)
        return raw ? JSON.parse(raw) : null
    } catch {
        return null
    }
}

export function setAuth(token: string, user: AuthUser) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
    return !!getToken()
}
