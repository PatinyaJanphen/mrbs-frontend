import { createFileRoute, redirect } from '@tanstack/react-router'
import { RoomEdit } from '@/pages/room/RoomEdit'
import { getUser } from '@/lib/auth'
import { USER_ROLES } from '@/constants/app'

export const Route = createFileRoute('/_layout/rooms/$roomId/edit')({
    beforeLoad: () => {
        const user = getUser()
        // Allow both Admin and Super Admin
        const isAdmin = user?.role === USER_ROLES.ADMIN || user?.role === USER_ROLES.SUPER_ADMIN
        
        if (!isAdmin) {
            throw redirect({
                to: '/rooms',
            })
        }
    },
    component: RoomEdit,
})
