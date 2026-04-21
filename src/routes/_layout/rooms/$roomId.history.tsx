import { createFileRoute } from '@tanstack/react-router'
import { RoomBookingHistory } from '@/pages/room/RoomBookingHistory'

export const Route = createFileRoute('/_layout/rooms/$roomId/history')({
    component: RoomBookingHistory,
})
