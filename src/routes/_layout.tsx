import { createFileRoute, redirect } from '@tanstack/react-router'
import { MainLayout } from '../components/MainLayout'

export const Route = createFileRoute('/_layout')({
    beforeLoad: ({ context }) => {
        if (!context.auth.isAuthenticated) {
            throw redirect({ to: '/login' })
        }
    },
    component: MainLayout,
})
