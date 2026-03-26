import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Building, Loader2 } from 'lucide-react'
import { setAuth } from '../lib/auth'

export const Route = createFileRoute('/auth/callback')({
    component: AuthCallbackPage,
})

function AuthCallbackPage() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const navigate = Route.useNavigate()

    useEffect(() => {
        // Get token from URL query param (?token=xxx)
        const params = new URLSearchParams(window.location.search)
        const token = params.get('token')
        const error = params.get('error')

        if (error || !token) {
            setStatus('error')
            setTimeout(() => navigate({ to: '/login' }), 2000)
            return
        }

        // Store token + user mock (should actually call /api/me)
        setAuth(token, {
            name: 'Developer Tester',
            email: 'dev@gmail.com',
            avatar: 'https://github.com/shadcn.png',
        })

        setStatus('success')
        setTimeout(() => navigate({ to: '/' }), 1000)
    }, [navigate])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
                    <Building className="h-8 w-8 text-white" />
                </div>
                {status === 'loading' && (
                    <>
                        <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                        <p className="text-slate-600 font-medium">กำลังเข้าสู่ระบบ...</p>
                    </>
                )}
                {status === 'success' && (
                    <p className="text-emerald-600 font-medium">เข้าสู่ระบบสำเร็จ! กำลังนำทาง...</p>
                )}
                {status === 'error' && (
                    <p className="text-red-500 font-medium">เกิดข้อผิดพลาด กำลังกลับไปหน้า Login...</p>
                )}
            </div>
        </div>
    )
}
