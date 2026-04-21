import { createFileRoute } from '@tanstack/react-router'
import { BookingApproval } from '@/pages/admin/BookingApproval'

export const Route = createFileRoute('/_layout/bookings/approvals')({
  component: BookingApproval,
})
