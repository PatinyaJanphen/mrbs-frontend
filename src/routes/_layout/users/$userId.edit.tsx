import { createFileRoute } from '@tanstack/react-router'
import { UserEdit } from '@/pages/user/UserEdit'

export const Route = createFileRoute('/_layout/users/$userId/edit')({
    component: UserEdit,
})
