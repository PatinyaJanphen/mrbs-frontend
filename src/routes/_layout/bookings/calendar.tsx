import { createFileRoute } from '@tanstack/react-router'
import { BookingCalendar } from '@/pages/booking/BookingCalendar'

export const Route = createFileRoute('/_layout/bookings/calendar')({
    component: BookingCalendar,
})
