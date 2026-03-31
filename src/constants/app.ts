// App-wide constants

export const APP_NAME = 'MRBS Workspace'

export const USER_ROLES = {
    SUPER_ADMIN: 'super_admin',
    ADMIN: 'admin',
    STAFF: 'staff',
    USER: 'user',
} as const
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const BOOKING_STATUS = {
    PENDING: 0,
    CONFIRMED: 1,
    CANCELLED: 2,
} as const
export type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

export const BOOKING_STATUS_LABEL: Record<number, string> = {
    [BOOKING_STATUS.PENDING]: 'รอการอนุมัติ',
    [BOOKING_STATUS.CONFIRMED]: 'ยืนยันแล้ว',
    [BOOKING_STATUS.CANCELLED]: 'ยกเลิกแล้ว',
}

export const DAY_OF_WEEK_LABEL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']

export const PAGINATION_DEFAULT_LIMIT = 20
