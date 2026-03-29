import { createFileRoute } from '@tanstack/react-router'
import { RoomsPage } from '#/pages/room/RoomTable'

export const Route = createFileRoute('/_layout/rooms/')({
    component: RoomsPage,
})
