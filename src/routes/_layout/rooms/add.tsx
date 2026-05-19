import { createFileRoute, redirect } from '@tanstack/react-router'
import { RoomsIndex } from '@/pages/room/RoomIndex'
import { getUser } from '@/lib/auth'
import { USER_ROLES } from '@/constants/app'

export const Route = createFileRoute('/_layout/rooms/add')({
    beforeLoad: () => {
        if (typeof window === 'undefined') {
            return
        }

        const user = getUser()
        const isAdmin = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN
        
        if (!isAdmin) {
            throw redirect({
                to: '/rooms',
            })
        }
    },
    component: RoomsIndex,
})
