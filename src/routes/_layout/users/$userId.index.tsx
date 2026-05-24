import { createFileRoute } from '@tanstack/react-router'
import { UserDetail } from '@/pages/user/UserDetail'

export const Route = createFileRoute('/_layout/users/$userId/')({
    component: UserDetail,
})
