import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { CalendarClock, Edit3, KeyRound, Loader2, Mail, Phone, ShieldCheck, UserRound, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination'
import { BOOKING_STATUS_LABEL } from '@/constants/app'
import { QUERY_KEYS } from '@/constants/query-keys'
import { useAuth } from '@/hooks/useAuth'
import { useUser, useUserBookings } from '@/hooks/queries/useUsers'
import { authService } from '@/services/auth.service'
import { userService } from '@/services/user.service'
import { getRoleOption } from './user-options'
import { UserPageHeader } from './UserAdd'

function formatDateTime(value: string) {
    return new Date(value).toLocaleString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

export function UserDetail() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { user: currentUser } = useAuth()
    const { userId: userIdStr } = useParams({ from: '/_layout/users/$userId' })
    const userId = Number(userIdStr)
    const [page, setPage] = useState(1)

    const { data: user, isLoading, error } = useUser(userId, { enabled: Boolean(userId) })
    const { data: bookingData, isLoading: isBookingsLoading } = useUserBookings(userId, { page, per_page: 6 }, { enabled: Boolean(userId) })
    const bookings = bookingData?.data ?? []
    const pagination = (bookingData as any)?.meta ?? bookingData
    const totalPages = pagination?.last_page ?? 1

    const handlePageChange = (p: number) => {
        if (p >= 1 && p <= totalPages) {
            setPage(p)
            const element = document.getElementById('booking-history-section')
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
            }
        }
    }

    const toggleMutation = useMutation({
        mutationFn: () => userService.toggleActive(userId),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.DETAIL(userId) })
            toast.success(updatedUser.is_active ? 'เปิดการใช้งานบัญชีแล้ว' : 'ปิดการใช้งานบัญชีแล้ว')
        },
        onError: () => {
            toast.error('เปลี่ยนสถานะบัญชีไม่สำเร็จ')
        },
    })

    const resetPasswordMutation = useMutation({
        mutationFn: (email: string) => authService.forgotPassword({ email }),
        onSuccess: () => {
            toast.success('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลผู้ใช้งานแล้ว')
        },
        onError: () => {
            toast.error('ส่งลิงก์รีเซ็ตรหัสผ่านไม่สำเร็จ')
        },
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="font-medium text-slate-500">กำลังโหลดข้อมูลผู้ใช้งาน...</p>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="mx-auto mt-20 max-w-2xl rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
                <XCircle className="mx-auto h-10 w-10 text-red-500" />
                <h3 className="mt-4 text-2xl font-bold text-red-900">ไม่พบผู้ใช้งาน</h3>
                <Button className="mt-6" variant="outline" onClick={() => navigate({ to: '/users' } as any)}>
                    กลับหน้าผู้ใช้งาน
                </Button>
            </div>
        )
    }

    const roleOption = getRoleOption(user.role)

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <UserPageHeader
                title={user.name}
                description="รายละเอียดผู้ใช้งาน บทบาท และประวัติการจองล่าสุด"
                onBack={() => navigate({ to: '/users' } as any)}
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                                <UserRound className="h-8 w-8" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${roleOption.tone}`}>
                                        {roleOption.label}
                                    </span>
                                    <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${user.is_active ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                                        {user.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                className="gap-2 rounded-xl"
                                onClick={() => navigate({ to: '/users/$userId/edit', params: { userId: String(user.id) } } as any)}
                            >
                                <Edit3 className="h-4 w-4" />
                                แก้ไข
                            </Button>
                            <Button
                                variant="outline"
                                className="gap-2 rounded-xl"
                                disabled={resetPasswordMutation.isPending}
                                onClick={() => resetPasswordMutation.mutate(user.email)}
                            >
                                <KeyRound className="h-4 w-4" />
                                รีเซ็ตรหัสผ่าน
                            </Button>
                        </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2">
                        <InfoItem icon={<Mail className="h-4 w-4" />} label="อีเมล" value={user.email} />
                        <InfoItem icon={<Phone className="h-4 w-4" />} label="เบอร์โทรศัพท์" value={user.phone || 'ไม่ระบุ'} />
                        <InfoItem icon={<ShieldCheck className="h-4 w-4" />} label="ฝ่าย / แผนก" value={user.department || 'ไม่ระบุ'} />
                    </div>
                </section>

                <aside className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800">การจัดการบัญชี</h3>
                    <p className="mt-1 text-sm text-slate-500">เปิดหรือปิดการใช้งานบัญชีนี้</p>
                    <Button
                        variant="outline"
                        className={`mt-5 w-full rounded-xl ${user.is_active ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-emerald-100 text-emerald-700 hover:bg-emerald-50'}`}
                        disabled={toggleMutation.isPending || currentUser?.id === user.id}
                        onClick={() => toggleMutation.mutate()}
                    >
                        {user.is_active ? 'ปิดการใช้งานบัญชี' : 'เปิดการใช้งานบัญชี'}
                    </Button>
                </aside>
            </div>

            <section id="booking-history-section" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-bold text-slate-800">ประวัติการจองล่าสุด</h3>
                </div>

                {isBookingsLoading ? (
                    <div className="flex items-center gap-2 py-8 text-sm text-slate-500">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        กำลังโหลดประวัติ...
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="space-y-6">
                        <div className="grid gap-3 md:grid-cols-2">
                            {bookings.map((booking) => (
                                <div key={booking.id} className="rounded-2xl border border-slate-100 p-4">
                                    <p className="font-bold text-slate-800">{booking.title}</p>
                                    <p className="mt-1 text-sm text-slate-500">{booking.resource?.name || 'ไม่ระบุห้อง'}</p>
                                    <p className="mt-1 text-xs font-medium text-slate-400">{formatDateTime(booking.start_time)}</p>
                                    <span className="mt-3 inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                                        {BOOKING_STATUS_LABEL[Number(booking.status)] ?? 'ไม่ระบุสถานะ'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pt-4 border-t border-slate-100">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handlePageChange(page - 1) }}
                                                className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                text="ก่อนหน้า"
                                            />
                                        </PaginationItem>

                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <PaginationItem key={p} className="hidden sm:inline-block">
                                                <PaginationLink
                                                    href="#"
                                                    onClick={(e) => { e.preventDefault(); handlePageChange(p) }}
                                                    isActive={page === p}
                                                    className="cursor-pointer font-bold"
                                                >
                                                    {p}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handlePageChange(page + 1) }}
                                                className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                                text="ถัดไป"
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
                        ยังไม่มีประวัติการจอง
                    </div>
                )}
            </section>
        </div>
    )
}

function InfoItem({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
                {icon}
                {label}
            </div>
            <p className="mt-2 font-medium text-slate-800">{value}</p>
        </div>
    )
}
