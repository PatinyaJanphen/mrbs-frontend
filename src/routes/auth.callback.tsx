import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Building, Loader2 } from 'lucide-react'
import { setAuth } from '../lib/auth'
import { apiClient } from '../lib/axios'

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

        async function fetchProfile() {
            try {
                const response = await apiClient.get<any>('/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                const user = response.data

                // Now overwrite with properly structured user object if needed,
                // or just store what API returns
                setAuth(token!, {
                    id: user.id,
                    name: user.name || 'User',
                    email: user.email || '',
                    avatar: user.avatar || user.profile_photo_url || '',
                    role: user.role ?? 3,
                    company_id: user.company_id,
                })

                setStatus('success')
                setTimeout(() => navigate({ to: '/' }), 1000)
            } catch (err) {
                console.error("Failed to fetch profile", err)
                setStatus('error')
                setTimeout(() => navigate({ to: '/login' }), 2000)
            }
        }


        fetchProfile()
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
                    <p className="text-emerald-600 font-medium">เข้าสู่ระบบสำเร็จ...</p>
                )}
                {status === 'error' && (
                    <p className="text-red-500 font-medium">เกิดข้อผิดพลาด กำลังกลับไปหน้า เข้าสู่ระบบ...</p>
                )}
            </div>
        </div>
    )
}
