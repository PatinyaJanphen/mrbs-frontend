import type { UserRole } from '@/constants/app'
import type { Booking } from './booking.dto'

export interface ManagedUser {
    id: number
    name: string
    email: string
    avatar?: string
    role: UserRole
    is_active: boolean
    company_id?: number
    phone?: string
    department?: string
    bookings_count?: number
    created_at: string
    updated_at: string
}

export interface UpsertUserDto {
    name: string
    email: string
    role: UserRole
    phone?: string
    department?: string
    company_id?: number
    password?: string
    is_active?: boolean
}

export interface PaginatedUsers {
    data: ManagedUser[]
    total: number
    per_page: number
    current_page: number
    last_page: number
}

export interface PaginatedUserBookings {
    data: Booking[]
    total: number
    per_page: number
    current_page: number
    last_page: number
}
