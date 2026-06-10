import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useBooking } from '@/hooks/queries/useBookings'
import { useRooms } from '@/hooks/queries/useRooms'
import { bookingService } from '@/services/booking.service'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, XCircle, Clock, CheckCircle2, Ban, CalendarClock, Album } from 'lucide-react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { BOOKING_STATUS, type BookingStatus } from '@/constants/app'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/useAuth'
import { BookingForm } from './components/BookingForm'
import type { CreateBookingDto } from '@/types/booking.dto'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { AlertTriangle } from 'lucide-react'

export function BookingDetail() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryClient = useQueryClient()
    const { user } = useAuth()

    const [isEditing, setIsEditing] = useState(false)
    const [isCancel, setIsCancel] = useState(false)

    const idParam = location.pathname.split('/').pop()
    const bookingId = idParam ? parseInt(idParam, 10) : 0

    const { data: booking, isLoading, error } = useBooking(bookingId, {
        enabled: !!bookingId,
    })

    const { data: roomsData, isLoading: isLoadingRooms } = useRooms({ per_page: 100 })


    const updateMutation = useMutation({
        mutationFn: (data: CreateBookingDto) => bookingService.update(bookingId, data),
        onSuccess: () => {
            toast.success('แก้ไขการจองสำเร็จ')
            queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
            queryClient.invalidateQueries({ queryKey: ['bookings'] })
            setIsEditing(false)
        },
        onError: () => {
            toast.error('ไม่สามารถแก้ไขการจองได้')
        }
    })

    const cancelMutation = useMutation({
        mutationFn: (id: number) => bookingService.cancel(id),
        onSuccess: () => {
            toast.success('ยกเลิกการจองสำเร็จ')
            queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
            queryClient.invalidateQueries({ queryKey: ['bookings'] })
            setIsCancel(false)
            navigate({ to: '/bookings/my' } as any)
        },
        onError: () => {
            toast.error('ไม่สามารถยกเลิกการจองได้')
        }
    })

    const handleCancel = () => {
        setIsCancel(true)
    }

    const confirmCancel = () => {
        cancelMutation.mutate(bookingId)
    }

    const isOwner = booking?.user_id === user?.id
    const canEdit = isOwner && booking?.status === BOOKING_STATUS.PENDING

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium animate-pulse">กำลังดึงข้อมูลการจอง...</p>
            </div>
        )
    }

    if (error || !booking) {
        return (
            <div className="max-w-2xl mx-auto mt-20 p-8 bg-red-50 rounded-3xl border border-red-100 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-red-900">ไม่พบการจอง</h3>
                <p className="text-red-700">ไม่พบข้อมูลการจอง</p>
                <Button
                    variant="outline"
                    className="mt-6 border-red-200 text-red-700 hover:bg-red-100 px-8 h-11 rounded-xl"
                    onClick={() => navigate({ to: '/bookings/my' } as any)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    กลับหน้าการจอง
                </Button>
            </div>
        )
    }

    const getStatusConfig = (status: BookingStatus) => {
        switch (status) {
            case BOOKING_STATUS.CONFIRMED:
                return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2, label: 'อนุมัติแล้ว' }
            case BOOKING_STATUS.CANCELLED:
                return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', icon: Ban, label: 'ยกเลิกแล้ว' }
            case BOOKING_STATUS.PENDING:
            default:
                return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock, label: 'รอพิจารณา' }
        }
    }

    const sConfig = getStatusConfig(booking.status)
    const StatusIcon = sConfig.icon

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 text-slate-500 hover:bg-white hover:shadow-sm transition-all rounded-full"
                        onClick={() => navigate({ to: '/bookings/my' } as any)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            {isEditing ? 'แก้ไขการจอง' : 'รายละเอียดการจอง'}
                        </h1>
                        <p className="flex items-center gap-2 text-slate-500 text-sm">
                            <Album className="w-4 h-4" />
                            ข้อมูลการจอง
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isEditing && (
                        <div className={`px-5 py-2.5 rounded-2xl flex items-center gap-2.5 font-bold border ${sConfig.bg} ${sConfig.color} ${sConfig.border} shadow-sm`}>
                            <StatusIcon className="w-5 h-5" />
                            {sConfig.label}
                        </div>
                    )}

                    {canEdit && !isEditing && (
                        <Button
                            onClick={() => setIsEditing(true)}
                            className="h-12 px-6 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white shadow-lg gap-2 font-medium transition-all"
                        >
                            <CalendarClock className="w-4 h-4" />
                            แก้ไขข้อมูล
                        </Button>
                    )}

                    {isOwner && booking.status !== BOOKING_STATUS.CANCELLED && !isEditing && (
                        <Button
                            onClick={handleCancel}
                            disabled={cancelMutation.isPending}
                            variant="outline"
                            className="h-12 px-6 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 gap-2 font-medium transition-all"
                        >
                            {cancelMutation.isPending
                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                : <XCircle className="w-4 h-4" />
                            }
                            ยกเลิกการจอง
                        </Button>
                    )}

                    {isEditing && (
                        <Button
                            variant="ghost"
                            onClick={() => setIsEditing(false)}
                            className="h-12 px-6 rounded-2xl text-slate-500 hover:bg-white hover:shadow-sm transition-all"
                        >
                            ยกเลิกใบแก้ไข
                        </Button>
                    )}
                </div>
            </div>

            <BookingForm
                initialData={{
                    title: booking.title,
                    resource_id: booking.resource_id,
                    start_time: booking.start_time,
                    end_time: booking.end_time
                }}
                roomsData={roomsData}
                isLoading={isLoadingRooms}
                isSubmitting={updateMutation.isPending}
                isReadOnly={!isEditing}
                onSubmit={(data) => updateMutation.mutate(data)}
                onCancel={() => setIsEditing(false)}
                submitLabel="บันทึกการแก้ไข"
            />

            <Dialog open={isCancel} onOpenChange={setIsCancel}>
                <DialogContent className="max-w-md">
                    <DialogHeader className="pt-4 items-center gap-4 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <div className="space-y-1.5">
                            <DialogTitle className="text-xl">ยืนยันยกเลิกการจอง?</DialogTitle>
                            <DialogDescription className="text-slate-500">
                                คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    <DialogFooter className="mt-6 gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => setIsCancel(false)}
                            className="flex-1 rounded-xl h-12"
                            disabled={cancelMutation.isPending}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmCancel}
                            className="flex-1 rounded-xl h-12 gap-2 shadow-lg shadow-red-100"
                            disabled={cancelMutation.isPending}
                        >
                            {cancelMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <XCircle className="w-4 h-4" />
                            )}
                            ยกเลิกการจอง
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
