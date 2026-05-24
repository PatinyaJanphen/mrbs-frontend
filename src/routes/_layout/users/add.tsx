import { createFileRoute } from '@tanstack/react-router'
import { UserAdd } from '@/pages/user/UserAdd'

export const Route = createFileRoute('/_layout/users/add')({
    component: UserAdd,
})
