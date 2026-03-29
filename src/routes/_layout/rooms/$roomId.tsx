import { createFileRoute } from '@tanstack/react-router'
import { RoomDetail } from '#/pages/room/RoomDetail.'

export const Route = createFileRoute('/_layout/rooms/$roomId')({
    component: RoomDetail,
})
