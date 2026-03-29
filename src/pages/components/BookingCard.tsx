import { Calendar, Clock, MapPin, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Booking } from '@/types'
import { getStatusColor, getStatusLabel } from '@/utils/booking'
import { formatDateTime, formatTimeRange } from '@/utils/date'
import { cn } from '@/lib/utils'

interface BookingCardProps {
    booking: Booking
    showRoomInfo?: boolean
    showUserInfo?: boolean
    onCancel?: (id: number) => void
}

export function BookingCard({ booking, showRoomInfo = true, showUserInfo = false, onCancel }: BookingCardProps) {
    const isPending = booking.status === 'pending'
    const isCancelled = booking.status === 'cancelled'

    return (
        <Card className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="p-5 pb-0">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-base font-bold text-slate-800 line-clamp-1">
                            {booking.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1.5">
                            <Badge 
                                variant="outline" 
                                className={cn("text-[10px] font-bold px-2 py-0 border-transparent", getStatusColor(booking.status))}
                            >
                                {getStatusLabel(booking.status)}
                            </Badge>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-4 space-y-2.5">
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <span>{formatDateTime(booking.start_time).split(',')[0]}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-slate-600">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span>{formatTimeRange(booking.start_time, booking.end_time)}</span>
                </div>
                {showRoomInfo && (
                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-blue-600">{booking.resource?.name ?? 'ไม่ระบุห้อง'}</span>
                    </div>
                )}
                {showUserInfo && (
                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <User className="h-4 w-4 text-slate-400" />
                        <span>โดย {booking.user?.name ?? 'ไม่ระบุผู้จอง'}</span>
                    </div>
                )}
            </CardContent>

            <CardFooter className="p-5 pt-0 border-t border-slate-50 flex items-center justify-end gap-2 bg-slate-50/50">
                {!isCancelled && onCancel && (
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onCancel(booking.id)}
                        className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        ยกเลิกการจอง
                    </Button>
                )}
                {isPending && (
                    <Button variant="outline" size="sm" className="h-8 text-xs border-blue-200 text-blue-600 hover:bg-blue-50">
                        แก้ไข
                    </Button>
                )}
            </CardFooter>
        </Card>
    )
}

