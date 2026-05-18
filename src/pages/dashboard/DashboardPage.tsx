import { Building2, CalendarDays, Clock, Users } from 'lucide-react'
import { useDashboardStats } from '@/hooks/queries/useDashboard'
import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
    const { isAdmin } = useAuth()

    const { data: statsData, isLoading, error } = useDashboardStats({
        enabled: isAdmin, // Only run query if admin
    })

    if (!isAdmin) {
        return null // Show blank page as requested
    }

    if (error) {
        console.error('Dashboard stats error:', error)
    }

    const stats = [
        { label: 'ห้องประชุมทั้งหมด', value: statsData?.total_rooms ?? '0', icon: Building2, color: 'text-blue-600 bg-blue-50' },
        { label: 'การจองวันนี้', value: statsData?.today_bookings ?? '0', icon: CalendarDays, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'กำลังใช้งาน', value: statsData?.active_bookings ?? '0', icon: Clock, color: 'text-amber-600 bg-amber-50' },
        { label: 'ผู้ใช้งาน', value: statsData?.total_users ?? '0', icon: Users, color: 'text-purple-600 bg-purple-50' },
    ]
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">ภาพรวมระบบ</h1>
                <p className="text-slate-500 mt-1">ยินดีต้อนรับสู่ระบบจองห้องประชุม MRBS Workspace</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm animate-pulse">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl mb-4" />
                            <div className="w-16 h-8 bg-slate-100 rounded mb-2" />
                            <div className="w-24 h-4 bg-slate-50 rounded" />
                        </div>
                    ))
                ) : (
                    stats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className={`inline-flex p-3 rounded-xl ${stat.color} mb-4`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <p className="text-3xl font-bold text-slate-800">{stat.value}</p>
                                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                            </div>
                        )
                    })
                )}
            </div>

            {/* Placeholder Content */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 shadow-sm text-center">
                <CalendarDays className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <h2 className="text-lg font-semibold text-slate-700 mb-2">ระบบการจองห้องประชุม</h2>
                <p className="text-slate-400 max-w-md mx-auto">
                    เลือกห้องประชุมที่ต้องการ ตรวจสอบความพร้อมใช้งาน และทำการจองได้ทันที
                </p>
            </div>
        </div>
    )
}
