import { USER_ROLES, type UserRole } from '@/constants/app'

export const roleOptions: Array<{ label: string; value: UserRole; tone: string }> = [
    { label: 'Super Admin', value: USER_ROLES.SUPER_ADMIN, tone: 'bg-red-50 text-red-700 border-red-100' },
    { label: 'Admin', value: USER_ROLES.ADMIN, tone: 'bg-blue-50 text-blue-700 border-blue-100' },
    { label: 'Staff', value: USER_ROLES.STAFF, tone: 'bg-violet-50 text-violet-700 border-violet-100' },
    { label: 'User', value: USER_ROLES.USER, tone: 'bg-slate-50 text-slate-600 border-slate-200' },
]

export function getRoleOption(role: number) {
    return roleOptions.find((item) => item.value === Number(role)) ?? roleOptions[3]
}
