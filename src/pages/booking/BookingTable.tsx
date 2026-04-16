import { useQuery } from '@tanstack/react-query'
import { ClipboardList, Loader2, CalendarPlus, Filter, DoorOpen, Clock2, Info } from 'lucide-react'
import { bookingService } from '@/services/booking.service'
import { Button } from '@/components/ui/button'
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

    const { data: bookingsData, isLoading, error } = useQuery({
        queryKey: ['bookings', { isMyBookings }],
        queryFn: () => isMyBookings ? bookingService.myBookings() : bookingService.list(),
    })

    const bookings = bookingsData?.data ?? []

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
                <div className="space-y-4">
                    {bookings.map((booking: any) => (
                        <div
                            key={booking.id}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group overflow-hidden"
                            onClick={() => navigate({ to: '/bookings/$bookingId', params: { bookingId: booking.id.toString() } } as any)}
                        >
                            <div className="p-2 pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-blue-50/10">
                                <div className="flex items-center gap-6 py-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                                        <DoorOpen className="w-7 h-7 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                    </div>

                                    <div className="space-y-1.5 min-w-0">
                                        <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                            {booking.title}
                                        </h3>

                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                            <DoorOpen className="w-3.5 h-3.5 shrink-0" />
                                            <span>{booking.resource?.name}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                            <Clock2 className="w-3.5 h-3.5 shrink-0" />
                                            <span>{new Date(booking.start_time).toLocaleDateString('th-TH', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                                            <span>{new Date(booking.start_time).toLocaleTimeString('th-TH', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })} - {new Date(booking.end_time).toLocaleTimeString('th-TH', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })} น.</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                            <Info className='w-3.5 h-3.5 mr-1' />
                                            {(() => {
                                                const statusMap: Record<number, { label: string; bg: string; text: string; border: string }> = {
                                                    0: { label: 'รอการอนุมัติ', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
                                                    1: { label: 'อนุมัติแล้ว', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
                                                    2: { label: 'ยกเลิกแล้ว', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
                                                }
                                                const s = statusMap[Number(booking.status)] ?? { label: `ไม่ระบุ (${booking.status})`, bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-200' }
                                                return (
                                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${s.bg} ${s.text} ${s.border}`}>
                                                        {s.label}
                                                    </span>
                                                )
                                            })()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
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
