import { useParams, useNavigate } from '@tanstack/react-router'
import { useRoom } from '@/hooks/queries/useRooms'
import { useBookings } from '@/hooks/queries/useBookings'
import {
    History,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Building2,
    Info,
    Clock2,
    DoorOpen,
    Calendar,
    User
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RoomBookingHistory() {
    const { roomId: roomIdStr } = useParams({ from: '/_layout/rooms/$roomId/history' })
    const roomId = Number(roomIdStr)
    const navigate = useNavigate()

    const { data: room } = useRoom(roomId, {
        enabled: !!roomId
    })

    const { data: bookingsData, isLoading, error } = useBookings({ resource_id: roomId }, {
        enabled: !!roomId
    })

    const bookings = bookingsData?.data ?? []

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">กำลังโหลดประวัติการจอง...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                <h3 className="text-xl font-bold text-red-900">เกิดข้อผิดพลาด</h3>
                <p className="text-red-700">ไม่สามารถโหลดข้อมูลได้: {(error as Error).message}</p>
                <Button onClick={() => window.location.reload()}>ลองอีกครั้ง</Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 text-slate-500 hover:bg-white hover:shadow-sm transition-all rounded-full"
                        onClick={() => navigate({ to: '/rooms' } as any)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-800">ประวัติการจอง</h1>
                            <div className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">
                                {room?.name || 'ห้องประชุม'}
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                            <Building2 className="w-4 h-4" />
                            รายการการจองทั้งหมดที่ผ่านมาของห้องนี้
                        </p>
                    </div>
                </div>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto text-slate-300">
                        <History className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">ไม่มีประวัติการจอง</h3>
                    <p className="text-slate-400">ยังไม่มีการจองห้องประชุมนี้ในระบบ</p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                        {bookings.map((booking: any) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="p-2 pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-blue-50/10">
                                    <div className="flex items-center gap-6 py-4">

                                        <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                                            {booking.status === 1 && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                                            {booking.status === 2 && <XCircle className="w-6 h-6 text-red-500" />}
                                            {booking.status === 0 && <AlertCircle className="w-6 h-6 text-amber-500" />}
                                        </div>

                                        <div className="space-y-1.5 min-w-0">
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
                                                <Calendar className="w-3.5 h-3.5 shrink-0" />
                                                <span>จองเมื่อ {new Date(booking.created_at).toLocaleDateString('th-TH', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                                <User className="w-4 h-4 text-slate-400" />
                                                {booking.user?.name}
                                            </div>

                                            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                                                <Info className='w-3.5 h-3.5 mr-1' />
                                                {(() => {
                                                    const statusMap: Record<number, { label: string; bg: string; text: string; border: string }> = {
                                                        0: { label: 'รอการอนุมัติ', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100' },
                                                        1: { label: 'อนุมัติการจอง', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100' },
                                                        2: { label: 'ยกเลิกการจอง', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-100' },
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
                </div>
            )}
        </div>
    )
}
