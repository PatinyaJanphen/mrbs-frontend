import { createFileRoute, redirect } from '@tanstack/react-router'
import { MainLayout } from '../components/MainLayout'
import { isAuthenticated } from '../lib/auth'

export const Route = createFileRoute('/_layout')({
    beforeLoad: () => {
        // If on server (no window), skip
        // Because SSR cannot read LocalStorage
        if (typeof window !== 'undefined' && !isAuthenticated()) {
            throw redirect({ to: '/login' })
        }
    },
    component: MainLayout,
})
