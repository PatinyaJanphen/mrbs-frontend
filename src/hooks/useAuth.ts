import { getUser, isAuthenticated as checkAuth } from '@/lib/auth'
import { USER_ROLES, type UserRole } from '@/constants/app'
import { useMemo } from 'react'

export function useAuth() {
    const user = useMemo(() => getUser(), [])
    
    const role = user?.role as UserRole | undefined
    
    const isAdmin = role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN
    const isSuperAdmin = role === USER_ROLES.SUPER_ADMIN
    const isStaff = role === USER_ROLES.STAFF
    const isUser = role === USER_ROLES.USER

    const hasRole = (requiredRole: UserRole) => role === requiredRole

    return {
        user,
        role,
        isAdmin,
        isSuperAdmin,
        isStaff,
        isUser,
        hasRole,
        isAuthenticated: checkAuth(),
    }
}
