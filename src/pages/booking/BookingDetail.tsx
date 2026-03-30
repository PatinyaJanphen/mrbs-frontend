import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingService } from '@/services/booking.service'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, XCircle, Clock, CheckCircle2, Ban, MapPin, User, CalendarClock } from 'lucide-react'
import { useNavigate, useLocation } from '@tanstack/react-router'
import { BOOKING_STATUS, type BookingStatus } from '@/constants/app'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { toast } from 'sonner'

export function BookingDetail() {
    const navigate = useNavigate()
    const location = useLocation()
    const queryClient = useQueryClient()

    const idParam = location.pathname.split('/').pop()
    const bookingId = idParam ? parseInt(idParam, 10) : 0

    const { data: booking, isLoading, error } = useQuery({
        queryKey: ['booking', bookingId],
        queryFn: () => bookingService.get(bookingId),
        enabled: !!bookingId,
    })

    const cancelMutation = useMutation({
        mutationFn: (id: number) => bookingService.cancel(id),
        onSuccess: () => {
            toast.success('ยกเลิกการจองสำเร็จ')
            queryClient.invalidateQueries({ queryKey: ['booking', bookingId] })
            queryClient.invalidateQueries({ queryKey: ['bookings'] })
        },
        onError: () => {
            toast.error('ไม่สามารถยกเลิกการจองได้')
        }
    })

    const handleCancel = () => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?')) {
            cancelMutation.mutate(bookingId)
        }
    }

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
                <h3 className="text-2xl font-bold text-red-900">ไม่พบข้อมูลการจองนี้</h3>
                <p className="text-red-700">อภัยด้วย เราไม่สามารถค้นหาข้อมูลการจองที่คุณต้องการได้</p>
                <Button
                    variant="outline"
                    className="mt-6 border-red-200 text-red-700 hover:bg-red-100 px-8 h-11 rounded-xl"
                    onClick={() => navigate({ to: '/bookings/my' } as any)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    กลับไปหน้ารวมการจอง
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

    const startTime = new Date(booking.start_time)
    const endTime = new Date(booking.end_time)
    const formattedDate = format(startTime, 'EEEEที่ d MMMM yyyy', { locale: th })
    const timeRange = `${format(startTime, 'HH:mm')} น. - ${format(endTime, 'HH:mm')} น.`

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Header / Nav */}
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
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">รายละเอียดการจอง</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            หมายเลขอ้างอิง: BK-{booking.id.toString().padStart(4, '0')}
                        </p>
                    </div>
                </div>

                {/* Status Badge ใหญ่ๆ */}
                <div className={`px-5 py-2.5 rounded-2xl flex items-center gap-2.5 font-bold border ${sConfig.bg} ${sConfig.color} ${sConfig.border} shadow-sm`}>
                    <StatusIcon className="w-5 h-5" />
                    {sConfig.label}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Core Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Big Hero Card */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                        
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold text-slate-800 leading-snug mb-6">
                                {booking.title}
                            </h2>

                            <div className="space-y-6">
                                {/* Time Context */}
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                                        <CalendarClock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">วันและเวลา</p>
                                        <p className="font-bold text-slate-800 text-lg">{formattedDate}</p>
                                        <p className="text-slate-600 mt-1">{timeRange}</p>
                                    </div>
                                </div>

                                {/* Room Context */}
                                <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                                        <MapPin className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <div className="pt-1">
                                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">สถานที่ / ห้องประชุม</p>
                                        <p className="font-bold text-slate-800 text-lg">
                                            {booking.resource?.name || 'ไม่ระบุห้อง (-)'}
                                        </p>
                                        <Button 
                                            variant="link" 
                                            className="px-0 h-auto text-indigo-600 hover:text-indigo-700 mt-1"
                                            onClick={() => navigate({ to: '/rooms/$roomId', params: { roomId: booking.resource_id.toString() } } as any)}
                                        >
                                            ดูข้อมูลห้องประชุม
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - User Info & Actions */}
                <div className="space-y-6">
                    {/* User Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <User className="w-5 h-5 text-slate-400" />
                            ข้อมูลผู้จอง
                        </h3>
                        
                        {booking.user ? (
                            <div className="flex flex-col items-center text-center space-y-4">
                                {booking.user.avatar ? (
                                    <img src={booking.user.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-slate-50 object-cover shadow-sm" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center border-4 border-white shadow-sm">
                                        <User className="w-8 h-8 text-slate-300" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-slate-800 text-lg">{booking.user.name}</p>
                                    <p className="text-slate-500 text-sm mt-1">{booking.user.email}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-slate-500 italic">ไม่มีข้อมูลผู้จอง</p>
                        )}
                    </div>

                    {/* Actions Card */}
                    {booking.status === BOOKING_STATUS.PENDING && (
                        <div className="bg-white p-6 rounded-3xl border border-red-50 shadow-sm shadow-red-50 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full blur-2xl pointer-events-none" />
                            <h3 className="font-bold text-slate-800 mb-2 relative z-10">การจัดการ</h3>
                            <p className="text-sm text-slate-500 mb-6 relative z-10">
                                คุณสามารถยกเลิกการจองนี้ได้ก่อนเวลาเริ่มงาน
                            </p>
                            <Button 
                                onClick={handleCancel}
                                disabled={cancelMutation.isPending}
                                className="w-full h-11 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 hover:border-red-600 transition-all rounded-xl relative z-10 shadow-sm"
                            >
                                {cancelMutation.isPending ? 'กำลังดำเนินการ...' : 'ยกเลิกการจอง'}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
