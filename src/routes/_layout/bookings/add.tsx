import { createFileRoute } from '@tanstack/react-router'
import { BookingIndex } from '@/pages/booking/BookingIndex'

export const Route = createFileRoute('/_layout/bookings/add')({
    component: BookingIndex,
})
