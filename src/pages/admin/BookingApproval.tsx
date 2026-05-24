import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
    Loader2,
    DoorOpen,
    Clock2,
    User,
    CheckCircle2,
    XCircle,
    CalendarClock,
    AlertCircle,
    AlertTriangle
} from 'lucide-react'
import { useBookings } from '@/hooks/queries/useBookings'
import { bookingService } from '@/services/booking.service'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'

export function BookingApproval() {
    const queryClient = useQueryClient()
    const [page, setPage] = useState(1)

    const { data: bookingsData, isLoading, error } = useBookings({ status: '0', page, per_page: 10 })
    const bookings = bookingsData?.data ?? []
    const pagination = (bookingsData as any)?.meta ?? bookingsData
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


    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false)
    const [selectedApproveBookingId, setSelectedApproveBookingId] = useState<number | null>(null)

    const approveMutation = useMutation({
        mutationFn: (id: number) => bookingService.approve(id),
        onSuccess: () => {
            toast.success('อนุมัติการจองเรียบร้อยแล้ว')
            queryClient.invalidateQueries({ queryKey: ['bookings'] })
            setIsApproveDialogOpen(false)
            setSelectedApproveBookingId(null)
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'เกิดข้อผิดพลาดในการอนุมัติ')
        }
    })

    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false)
    const [rejectReason, setRejectReason] = useState('')
    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null)

    const rejectMutation = useMutation({
        mutationFn: ({ id, reason }: { id: number; reason: string }) => bookingService.reject(id, reason),
        onSuccess: () => {
            toast.success('ปฏิเสธการจองเรียบร้อยแล้ว')
            queryClient.invalidateQueries({ queryKey: ['bookings'] })
            setIsRejectDialogOpen(false)
            setRejectReason('')
            setSelectedBookingId(null)
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'เกิดข้อผิดพลาดในการปฏิเสธ')
        }
    })

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
                <div className="space-y-6">
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
                                            onClick={() => {
                                                setSelectedBookingId(booking.id)
                                                setIsRejectDialogOpen(true)
                                            }}
                                            disabled={rejectMutation.isPending || approveMutation.isPending}
                                            variant="outline"
                                            className="flex-1 lg:flex-none h-12 px-6 rounded-xl border-slate-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 font-bold transition-all gap-2"
                                        >
                                            {rejectMutation.isPending && rejectMutation.variables?.id === booking.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <XCircle className="h-5 w-5" />
                                            )}
                                            ปฏิเสธ
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setSelectedApproveBookingId(booking.id)
                                                setIsApproveDialogOpen(true)
                                            }}
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
                        <CalendarClock className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">ไม่มีคำขอที่รอดำเนินการ</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                        ขณะนี้ยังไม่มีคำขอจองห้องประชุมใหม่ที่ต้องการการอนุมัติ
                    </p>
                </div>
            )}

            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader className="pt-4 items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="space-y-1.5">
                            <DialogTitle className="text-xl">ยืนยันปฏิเสธการจอง</DialogTitle>
                            <DialogDescription className="text-slate-500">
                                กรุณาระบุเหตุผลในการปฏิเสธคำขอการจองห้องประชุมนี้
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <div className="py-2">
                        <Textarea
                            placeholder="ระบุเหตุผล"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="min-h-[100px] rounded-xl border-slate-200 focus:border-red-500 focus:ring-red-500"
                        />
                    </div>

                    <DialogFooter className="mt-4 gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsRejectDialogOpen(false)
                                setRejectReason('')
                                setSelectedBookingId(null)
                            }}
                            className="flex-1 rounded-xl h-12"
                            disabled={rejectMutation.isPending}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (selectedBookingId && rejectReason.trim()) {
                                    rejectMutation.mutate({ id: selectedBookingId, reason: rejectReason })
                                }
                            }}
                            className="flex-1 rounded-xl h-12 gap-2 shadow-lg shadow-red-100"
                            disabled={rejectMutation.isPending || !rejectReason.trim()}
                        >
                            {rejectMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <XCircle className="w-4 h-4" />
                            )}
                            ยืนยันปฏิเสธ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader className="pt-4 items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div className="space-y-1.5">
                            <DialogTitle className="text-xl">ยืนยันอนุมัติการจอง</DialogTitle>
                            <DialogDescription className="text-slate-500">
                                คุณแน่ใจหรือไม่ว่าต้องการอนุมัติคำขอการจองห้องประชุมนี้
                            </DialogDescription>
                        </div>
                    </DialogHeader>

                    <DialogFooter className="mt-6 gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setIsApproveDialogOpen(false)
                                setSelectedApproveBookingId(null)
                            }}
                            className="flex-1 rounded-xl h-12"
                            disabled={approveMutation.isPending}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            onClick={() => {
                                if (selectedApproveBookingId) {
                                    approveMutation.mutate(selectedApproveBookingId)
                                }
                            }}
                            className="flex-1 rounded-xl h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold transition-all shadow-lg shadow-emerald-100 hover:shadow-emerald-200 gap-2"
                            disabled={approveMutation.isPending}
                        >
                            {approveMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-4 h-4" />
                            )}
                            ยืนยันอนุมัติ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
