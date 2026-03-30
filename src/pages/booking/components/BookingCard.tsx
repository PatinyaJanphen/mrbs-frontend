import { BOOKING_STATUS, type BookingStatus } from '@/constants/app'
import type { Booking } from '@/types/booking.dto'
import { Link } from '@tanstack/react-router'
import { CalendarClock, MapPin, User, ChevronRight, Ban, CheckCircle2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

interface BookingCardProps {
    booking: Booking
    showUserInfo?: boolean
    onCancel?: (id: number) => void
}

export function BookingCard({ booking, showUserInfo = false, onCancel }: BookingCardProps) {
    const getStatusConfig = (status: BookingStatus) => {
        switch (status) {
            case BOOKING_STATUS.CONFIRMED:
                return { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', icon: CheckCircle2, label: 'อนุมัติแล้ว' }
            case BOOKING_STATUS.CANCELLED:
                return { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', icon: Ban, label: 'ยกเลิกแล้ว' }
            case BOOKING_STATUS.PENDING:
            default:
                return { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock, label: 'รอพิจารณา' }
        }
    }

    const sConfig = getStatusConfig(booking.status)
    const StatusIcon = sConfig.icon

    // Format times safely
    const startTime = new Date(booking.start_time)
    const endTime = new Date(booking.end_time)
    
    const formattedDate = format(startTime, 'dd MMM yyyy', { locale: th })
    const timeRange = `${format(startTime, 'HH:mm')} - ${format(endTime, 'HH:mm')}`

    return (
        <div className="group relative bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
            {/* Status Badge */}
            <div className={`absolute top-6 right-6 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold border transition-colors ${sConfig.bg} ${sConfig.color} ${sConfig.border}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {sConfig.label}
            </div>

            {/* Header / Title */}
            <div className="pr-24 mb-6">
                <Link to="/bookings/$bookingId" params={{ bookingId: booking.id.toString() }} className="block">
                    <h3 className="text-xl font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                        {booking.title}
                    </h3>
                </Link>
                <div className="flex items-center gap-2 mt-3 text-sm text-slate-500 font-medium">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                        <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="truncate">{booking.resource?.name || 'ไม่ระบุห้อง (-)'}</span>
                </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-4 mb-6 flex-grow">
                {/* Time Info */}
                <div className="flex items-start gap-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                    <CalendarClock className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-slate-700">{formattedDate}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{timeRange}</p>
                    </div>
                </div>

                {/* User Info (Conditional) */}
                {showUserInfo && booking.user && (
                    <div className="flex items-center gap-3 px-1">
                        {booking.user.avatar ? (
                            <img src={booking.user.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                <User className="w-4 h-4 text-slate-400" />
                            </div>
                        )}
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-slate-700 truncate">{booking.user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{booking.user.email}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                <Button 
                    variant="ghost" 
                    asChild 
                    className="flex-1 justify-between px-4 hover:bg-slate-50 text-slate-600 hover:text-blue-600 h-10 rounded-xl transition-colors"
                >
                    <Link to="/bookings/$bookingId" params={{ bookingId: booking.id.toString() }}>
                        ดูรายละเอียด
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                </Button>

                {onCancel && booking.status === BOOKING_STATUS.PENDING && (
                    <Button 
                        variant="outline" 
                        onClick={() => onCancel(booking.id)}
                        className="shrink-0 h-10 px-4 text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200 hover:border-red-300 rounded-xl transition-all"
                    >
                        ยกเลิกการจอง
                    </Button>
                )}
            </div>
        </div>
    )
}
