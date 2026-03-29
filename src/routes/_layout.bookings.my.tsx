import { createFileRoute } from '@tanstack/react-router'
import { BookingsPage } from '@/pages/BookingsPage'

export const Route = createFileRoute('/_layout/bookings/my')({
    component: BookingsPage,
})
