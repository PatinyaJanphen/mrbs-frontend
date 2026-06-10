import { useState } from 'react'
import { ClipboardList, Loader2, CalendarPlus, Filter, DoorOpen, Clock2, Info, Building2, CheckCircle2, XCircle, ChevronRight, Clock } from 'lucide-react'
import { useBookings, useMyBookings } from '@/hooks/queries/useBookings'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination'
import { useRouterState, Link } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router'

interface BookingTableProps {
    myOnly?: boolean
}

export function BookingTable({ myOnly = false }: BookingTableProps) {
    const routerState = useRouterState()
    const navigate = useNavigate()

    // Check if we are on "My Bookings" path if prop not explicitly provided
    const isMyBookings = myOnly || routerState.location.pathname.includes('/my')

    const [page, setPage] = useState(1)

    const { data: bookingsDataAll, isLoading: isLoadingAll, error: errorAll } = useBookings({ page, per_page: 10 }, { enabled: !isMyBookings })
    const { data: bookingsDataMy, isLoading: isLoadingMy, error: errorMy } = useMyBookings({ page, per_page: 10 }, { enabled: isMyBookings })

    const bookingsData = isMyBookings ? bookingsDataMy : bookingsDataAll
    const isLoading = isMyBookings ? isLoadingMy : isLoadingAll
    const error = isMyBookings ? errorMy : errorAll

    const bookings = bookingsData?.data ?? []
    const pagination = (bookingsData as any)?.meta ?? bookingsData
    const totalPages = pagination?.last_page ?? 1

    const handlePageChange = (p: number) => {
        if (p >= 1 && p <= totalPages) {
            setPage(p)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <div className="space-y-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">การจองของฉัน</h1>
                    <p className="text-slate-500 mt-1">รายการจองห้องประชุมของคุณ</p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 text-slate-600 gap-2">
                        <Filter className="h-4 w-4" />
                        ตัวกรอง
                    </Button>
                    {isMyBookings && (
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-5 rounded-xl shadow-lg shadow-blue-100">
                            <Link to="/bookings/add">
                                <CalendarPlus className="h-5 w-5" />
                                จองห้องเพิ่ม
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium">กำลังโหลดข้อมูล...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
                    <p className="text-red-600 font-medium">เกิดข้อผิดพลาด {error.message}</p>
                    <p className="text-red-400 text-sm mt-1">กรุณาลองใหม่อีกครั้ง</p>
                </div>
            ) : bookings.length > 0 ? (
                <div className="space-y-6">
                    <div className="space-y-4">
                        {bookings.map((booking: any) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group overflow-hidden"
                                onClick={() => navigate({ to: '/bookings/$bookingId', params: { bookingId: booking.id.toString() } } as any)}
                            >
                                <div className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer hover:bg-blue-50/50 transition-colors">
                                    <div className="flex items-start md:items-center gap-5">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                                            <Building2 className="w-6 h-6 text-blue-600" />
                                        </div>

                                        <div className="space-y-1.5 min-w-0">
                                            <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                                {booking.title}
                                            </h3>

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-slate-500 text-sm font-medium">
                                                <div className="flex items-center gap-1.5">
                                                    <DoorOpen className="w-4 h-4 shrink-0 text-slate-400" />
                                                    <span>{booking.resource?.name}</span>
                                                </div>
                                                <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                                                <div className="flex items-center gap-1.5">
                                                    <Clock2 className="w-4 h-4 shrink-0 text-slate-400" />
                                                    <span>{new Date(booking.start_time).toLocaleDateString('th-TH', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })} • {new Date(booking.start_time).toLocaleTimeString('th-TH', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} - {new Date(booking.end_time).toLocaleTimeString('th-TH', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} น.</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-none border-slate-100 pt-4 md:pt-0">
                                        {(() => {
                                            const statusMap: Record<number, { label: string; bg: string; text: string; icon: any }> = {
                                                0: { label: 'รอการอนุมัติ', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
                                                1: { label: 'อนุมัติการจอง', bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2 },
                                                2: { label: 'ยกเลิกการจอง', bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
                                            }
                                            const s = statusMap[Number(booking.status)] ?? { label: `ไม่ระบุ (${booking.status})`, bg: 'bg-slate-100', text: 'text-slate-600', icon: Info }
                                            const StatusIcon = s.icon
                                            return (
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${s.bg} ${s.text}`}>
                                                    <StatusIcon className="w-3.5 h-3.5" />
                                                    {s.label}
                                                </span>
                                            )
                                        })()}
                                        
                                        <div className="flex items-center gap-1 text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                                            ดูรายละเอียด
                                            <ChevronRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-slate-100">
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
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-slate-50 mb-6">
                        <ClipboardList className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">ไม่พบรายการจอง</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                        ไม่มีรายการจองห้องประชุมในขณะนี้
                    </p>
                    <Button asChild
                        variant="outline"
                        className="mt-6 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl">
                        <Link to="/bookings/add">เริ่มจองห้องประชุม</Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
