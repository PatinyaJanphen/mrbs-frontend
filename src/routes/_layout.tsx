import { createFileRoute, redirect } from '@tanstack/react-router'
import { MainLayout } from '../components/MainLayout'
import { isAuthenticated } from '../lib/auth'

export const Route = createFileRoute('/_layout')({
    beforeLoad: () => {
        if (typeof window === 'undefined') {
            return
        }

        if (!isAuthenticated()) {
            throw redirect({ to: '/login' })
        }
    },
    component: MainLayout,
})
