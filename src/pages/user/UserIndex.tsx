import { Outlet } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function UserIndex() {
    const { isAdmin, isSuperAdmin } = useAuth()

    if (!isAdmin && !isSuperAdmin) {
        return (
            <div className="bg-white rounded-3xl border border-slate-100 p-10 text-center shadow-sm">
                <ShieldCheck className="mx-auto h-12 w-12 text-slate-300" />
                <h1 className="mt-4 text-2xl font-bold text-slate-800">ไม่มีสิทธิ์เข้าถึง</h1>
            </div>
        )
    }

    return <Outlet />
}
