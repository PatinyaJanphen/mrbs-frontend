import { createFileRoute } from '@tanstack/react-router'
import { BookingTable } from '@/pages/booking/BookingTable'

export const Route = createFileRoute('/_layout/bookings/my')({
    component: BookingTable,
})
