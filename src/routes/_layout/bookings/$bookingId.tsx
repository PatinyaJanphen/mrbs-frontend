import { createFileRoute } from '@tanstack/react-router'
import { BookingDetail } from '@/pages/booking/BookingDetail'

export const Route = createFileRoute('/_layout/bookings/$bookingId')({
    component: BookingDetail,
})
