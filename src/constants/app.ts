// App-wide constants

export const APP_NAME = 'MRBS Workspace'

export const USER_ROLES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    HR: 'hr',
    USER: 'user',
} as const
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
} as const
export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

export const BOOKING_STATUS_LABEL: Record<string, string> = {
    pending: 'รอการอนุมัติ',
    confirmed: 'ยืนยันแล้ว',
    cancelled: 'ยกเลิกแล้ว',
}

export const DAY_OF_WEEK_LABEL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']

export const PAGINATION_DEFAULT_LIMIT = 20
