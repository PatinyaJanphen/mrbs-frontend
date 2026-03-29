import type { BookingStatus } from '@/constants/app'
import type { AuthUser } from './auth.dto'
import type { Room } from './room.dto'

export interface Booking {
    id: number
    company_id: number
    user_id: number
    resource_id: number
    title: string
    start_time: string
    end_time: string
    status: BookingStatus
    approved_by?: number
    google_event_id?: string
    created_at: string
    updated_at: string
    user?: AuthUser
    resource?: Room
}

export interface CreateBookingDto {
    resource_id: number
    title: string
    start_time: string
    end_time: string
}

export interface PaginatedBookings {
    data: Booking[]
    total: number
    per_page: number
    current_page: number
    last_page: number
}
