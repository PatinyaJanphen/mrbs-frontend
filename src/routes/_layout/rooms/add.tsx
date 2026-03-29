import { createFileRoute } from '@tanstack/react-router'
import { RoomsIndex } from '#/pages/room/RoomIndex'

export const Route = createFileRoute('/_layout/rooms/add')({
    component: RoomsIndex,
})
