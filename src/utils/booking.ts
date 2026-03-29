import { BOOKING_STATUS, BOOKING_STATUS_LABEL } from '@/constants'

type BookingStatus = (typeof BOOKING_STATUS)[keyof typeof BOOKING_STATUS]

export function getStatusColor(status: BookingStatus): string {
    const map: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        confirmed: 'bg-green-100 text-green-700 border-green-200',
        cancelled: 'bg-red-100 text-red-600 border-red-200',
    }
    return map[status] ?? 'bg-slate-100 text-slate-500'
}

export function getStatusDotColor(status: BookingStatus): string {
    const map: Record<string, string> = {
        pending: 'bg-yellow-400',
        confirmed: 'bg-green-500',
        cancelled: 'bg-red-400',
    }
    return map[status] ?? 'bg-slate-400'
}

export function getStatusLabel(status: string): string {
    return BOOKING_STATUS_LABEL[status] ?? status
}
