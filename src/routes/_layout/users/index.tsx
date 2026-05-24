import { createFileRoute } from '@tanstack/react-router'
import { UserTable } from '@/pages/user/UserTable'

export const Route = createFileRoute('/_layout/users/')({
    component: UserTable,
})
