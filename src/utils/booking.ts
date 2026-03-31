import { BOOKING_STATUS, BOOKING_STATUS_LABEL } from '@/constants'

type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

export function getStatusColor(status: BookingStatus): string {
    const map: Record<number, string> = {
        [BOOKING_STATUS.PENDING]: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        [BOOKING_STATUS.CONFIRMED]: 'bg-green-100 text-green-700 border-green-200',
        [BOOKING_STATUS.CANCELLED]: 'bg-red-100 text-red-600 border-red-200',
    }
    return map[status] ?? 'bg-slate-100 text-slate-500'
}

export function getStatusDotColor(status: BookingStatus): string {
    const map: Record<number, string> = {
        [BOOKING_STATUS.PENDING]: 'bg-yellow-400',
        [BOOKING_STATUS.CONFIRMED]: 'bg-green-500',
        [BOOKING_STATUS.CANCELLED]: 'bg-red-400',
    }
    return map[status] ?? 'bg-slate-400'
}

export function getStatusLabel(status: BookingStatus): string {
    return BOOKING_STATUS_LABEL[status] ?? 'ไม่ทราบสถานะ'
}
