import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Loader2,
    DoorOpen,
    Clock2,
    User,
    CheckCircle2,
    XCircle,
    CalendarClock,
    AlertCircle
} from 'lucide-react'
import { bookingService } from '@/services/booking.service'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export function BookingApproval() {
    const queryClient = useQueryClient()

    const { data: bookingsData, isLoading, error } = useQuery({
        queryKey: ['bookings', { status: 0 }],
        queryFn: () => bookingService.list({ status: '0', per_page: 100 }),
    })

    const approveMutation = useMutation({
        mutationFn: (id: number) => bookingService.approve(id),
        onSuccess: () => {
            toast.success('อนุมัติการจองเรียบร้อยแล้ว')
            queryClient.invalidateQueries({ queryKey: ['bookings'] })
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'เกิดข้อผิดพลาดในการอนุมัติ')
        }
    })

    const rejectMutation = useMutation({
        mutationFn: (id: number) => bookingService.reject(id),
        onSuccess: () => {
            toast.success('ปฏิเสธการจองเรียบร้อยแล้ว')
            queryClient.invalidateQueries({ queryKey: ['bookings'] })
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'เกิดข้อผิดพลาดในการปฏิเสธ')
        }
    })

    const bookings = bookingsData?.data ?? []

    return (
        <div className="space-y-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-slate-800">
                        จัดการคำขอจอง
                    </h1>
                    <p className="text-slate-500 mt-1">
                        อนุมัติหรือปฏิเสธคำขอการจองห้องประชุมที่รอดำเนินการ
                    </p>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse" />
                        <Loader2 className="h-12 w-12 text-blue-600 animate-spin relative" />
                    </div>
                    <p className="text-slate-500 font-bold tracking-wide">กำลังโหลดข้อมูลคำขอ...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border-2 border-red-100 p-10 rounded-[2.5rem] text-center space-y-3">
                    <div className="inline-flex p-3 bg-red-100 rounded-2xl mb-2">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <p className="text-red-600 text-lg font-bold">เกิดข้อผิดพลาดในการดึงข้อมูล</p>
                    <p className="text-red-400 font-medium">{(error as any).message}</p>
                </div>
            ) : bookings.length > 0 ? (
                <div className="space-y-4">
                    {bookings.map((booking: any) => (
                        <div
                            key={booking.id}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group overflow-hidden"
                        >
                            <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                                <div className="flex items-center gap-6 py-4">
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                                        <DoorOpen className="w-7 h-7 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                    </div>

                                    <div className="space-y-1.5 min-w-0">
                                        <div className="space-y-1">
                                            <h3 className="font-black text-2xl text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                                                {booking.title}
                                            </h3>
                                        </div>

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
                                            <User className="w-4 h-4 text-slate-400" />
                                            {booking.user?.name}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 lg:shrink-0 pt-4 lg:pt-0 border-t lg:border-none border-slate-50">
                                    <Button
                                        onClick={() => rejectMutation.mutate(booking.id)}
                                        disabled={rejectMutation.isPending || approveMutation.isPending}
                                        variant="outline"
                                        className="flex-1 lg:flex-none h-12 px-6 rounded-xl border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold transition-all gap-2"
                                    >
                                        {rejectMutation.isPending && rejectMutation.variables === booking.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <XCircle className="h-5 w-5" />
                                        )}
                                        ปฏิเสธ
                                    </Button>
                                    <Button
                                        onClick={() => approveMutation.mutate(booking.id)}
                                        disabled={approveMutation.isPending || rejectMutation.isPending}
                                        className="flex-1 lg:flex-none h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-100 hover:shadow-emerald-200 gap-2"
                                    >
                                        {approveMutation.isPending && approveMutation.variables === booking.id ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <CheckCircle2 className="h-5 w-5" />
                                        )}
                                        อนุมัติการจอง
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-slate-50 mb-6">
                        <CalendarClock className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">ไม่มีคำขอที่รอดำเนินการ</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                        ขณะนี้ยังไม่มีคำขอจองห้องประชุมใหม่ที่ต้องการการอนุมัติ
                    </p>
                </div>
            )}
        </div>
    )
}
