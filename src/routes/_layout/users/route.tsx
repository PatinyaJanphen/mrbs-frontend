import { createFileRoute } from '@tanstack/react-router'
import { UserIndex } from '@/pages/user/UserIndex'

export const Route = createFileRoute('/_layout/users')({
    component: UserIndex,
})
