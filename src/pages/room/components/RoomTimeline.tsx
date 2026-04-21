import { useQuery } from '@tanstack/react-query'
import { Loader2, Clock, ChevronDown, CalendarDays } from 'lucide-react'
import { bookingService } from '@/services/booking.service'
import { useState, useMemo } from 'react'
import { BOOKING_STATUS } from '@/constants/app'
import type { Booking } from '@/types'

// Timeline constants
const TIMELINE_START = 7 // 07:00
const TIMELINE_END = 18 // 18:00
const TIMELINE_HOURS = Array.from({ length: TIMELINE_END - TIMELINE_START + 1 }, (_, i) => TIMELINE_START + i)
const FUTURE_DAYS = 7

const DAY_NAMES_SHORT = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.']

function formatDateKey(date: Date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

function formatDateLabel(date: Date) {
    const day = date.getDate()
    const month = date.toLocaleDateString('th-TH', { month: 'short' })
    const dayName = DAY_NAMES_SHORT[date.getDay()]
    return `${dayName} ${day} ${month}`
}

function formatTime(dateStr: string) {
    const d = new Date(dateStr)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function getBookingPosition(booking: Booking) {
    const start = new Date(booking.start_time)
    const end = new Date(booking.end_time)
    const totalMinutes = (TIMELINE_END - TIMELINE_START) * 60

    const startMinutes = Math.max((start.getHours() - TIMELINE_START) * 60 + start.getMinutes(), 0)
    const endMinutes = Math.min((end.getHours() - TIMELINE_START) * 60 + end.getMinutes(), totalMinutes)

    const left = (startMinutes / totalMinutes) * 100
    const width = ((endMinutes - startMinutes) / totalMinutes) * 100

    return { left: `${left}%`, width: `${width}%` }
}

function getBookingColor(status: number) {
    switch (status) {
        case BOOKING_STATUS.CONFIRMED:
            return { bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-800' }
        case BOOKING_STATUS.PENDING:
            return { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-800' }
        case BOOKING_STATUS.CANCELLED:
            return { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-700' }
        default:
            return { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-800' }
    }
}

// --- Single day timeline bar ---
function DayTimelineBar({ bookings, isToday }: { bookings: Booking[], isToday: boolean }) {
    return (
        <div className="relative h-8 bg-slate-50 rounded-lg border border-slate-100 overflow-hidden">
            {/* Hour grid lines */}
            {TIMELINE_HOURS.map((h, i) => (
                <div
                    key={h}
                    className="absolute top-0 bottom-0 border-l border-slate-100/70"
                    style={{ left: `${(i / (TIMELINE_HOURS.length - 1)) * 100}%` }}
                />
            ))}

            {/* Current time indicator (today only) */}
            {isToday && (() => {
                const now = new Date()
                const currentHour = now.getHours()
                const currentMinute = now.getMinutes()
                if (currentHour >= TIMELINE_START && currentHour <= TIMELINE_END) {
                    const totalMinutes = (TIMELINE_END - TIMELINE_START) * 60
                    const nowMinutes = (currentHour - TIMELINE_START) * 60 + currentMinute
                    const pos = (nowMinutes / totalMinutes) * 100
                    return (
                        <div
                            className="absolute top-0 bottom-0 w-0.5 bg-red-400 z-20"
                            style={{ left: `${pos}%` }}
                        >
                            <div className="absolute -top-0.5 -left-1 w-2.5 h-2.5 rounded-full bg-red-400 border-2 border-white shadow-sm" />
                        </div>
                    )
                }
                return null
            })()}

            {/* Booking blocks */}
            {bookings.map((booking) => {
                const pos = getBookingPosition(booking)
                const colors = getBookingColor(booking.status)
                const timeLabel = `${formatTime(booking.start_time)}-${formatTime(booking.end_time)}`
                return (
                    <div
                        key={booking.id}
                        className={`absolute top-1 bottom-1 rounded-md ${colors.bg} ${colors.border} border flex items-center justify-center transition-all hover:brightness-95 hover:shadow-sm z-10`}
                        style={{ left: pos.left, width: pos.width }}
                        title={`${booking.title} (${timeLabel})`}
                    >
                        <span className={`text-[10px] font-bold ${colors.text} truncate px-1.5`}>
                            {timeLabel}
                        </span>
                    </div>
                )
            })}

            {/* Empty state */}
            {bookings.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] text-slate-300 font-medium">ว่าง</span>
                </div>
            )}
        </div>
    )
}

// =============================================
// TODAY TIMELINE — แสดงเสมอ ไม่ต้องกดปุ่ม
// =============================================
export function TodayTimeline({ roomId }: { roomId: number }) {
    const today = useMemo(() => {
        const d = new Date()
        d.setHours(0, 0, 0, 0)
        return d
    }, [])

    const todayKey = formatDateKey(today)

    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['bookings', 'room-timeline-today', roomId, todayKey],
        queryFn: () => bookingService.list({ resource_id: roomId, from: todayKey, to: todayKey, per_page: 50 }),
    })

    const todayBookings = useMemo(() => {
        return (bookingsData?.data ?? []).filter(b => {
            const isConfirmed = b.status !== BOOKING_STATUS.CANCELLED;
            const isToday = b.start_time.startsWith(todayKey);
            return isConfirmed && isToday;
        })
    }, [bookingsData, todayKey])

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-2 text-slate-400 text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>โหลด...</span>
            </div>
        )
    }

    return (
        <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
                    <Clock className="w-3 h-3 text-blue-400" />
                    <span>วันนี้</span>
                </div>
                {todayBookings.length > 0 ? (
                    <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                        {todayBookings.length} รายการ
                    </span>
                ) : (
                    <span className="text-[10px] font-medium text-emerald-500">ว่าง</span>
                )}
            </div>

            {/* Hour labels */}
            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                {TIMELINE_HOURS.map((h) => (
                    <span key={h} className="w-0 text-center relative">
                        {String(h).padStart(2, '0')}
                    </span>
                ))}
            </div>

            <DayTimelineBar bookings={todayBookings} isToday={true} />
        </div>
    )
}

// =============================================
// FUTURE DAYS PANEL — กดปุ่มเพื่อแสดง 7 วันถัดไป
// =============================================
function FutureDaysContent({ roomId }: { roomId: number }) {
    const { startDate, endDate, futureDates } = useMemo(() => {
        const t = new Date()
        t.setHours(0, 0, 0, 0)
        const start = new Date(t)
        start.setDate(t.getDate() + 1)
        const end = new Date(t)
        end.setDate(t.getDate() + FUTURE_DAYS)
        const dates: Date[] = []
        for (let i = 1; i <= FUTURE_DAYS; i++) {
            const d = new Date(t)
            d.setDate(t.getDate() + i)
            dates.push(d)
        }
        return { startDate: start, endDate: end, futureDates: dates }
    }, [])

    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['bookings', 'room-timeline-future', roomId, formatDateKey(startDate)],
        queryFn: () => bookingService.list({
            resource_id: roomId,
            from: formatDateKey(startDate),
            to: formatDateKey(endDate),
            per_page: 100,
        }),
    })

    const bookingsByDate = useMemo(() => {
        const map: Record<string, Booking[]> = {}
        for (const d of futureDates) {
            map[formatDateKey(d)] = []
        }
        for (const b of (bookingsData?.data ?? [])) {
            if (b.status === BOOKING_STATUS.CANCELLED) continue
            const dateKey = b.start_time.split('T')[0]
            if (map[dateKey]) {
                map[dateKey].push(b)
            }
        }
        return map
    }, [bookingsData, futureDates])

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-3 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังโหลดตาราง...</span>
            </div>
        )
    }

    return (
        <div className="space-y-2.5">
            {futureDates.map((date) => {
                const dateKey = formatDateKey(date)
                const dayBookings = bookingsByDate[dateKey] ?? []
                return (
                    <div key={dateKey} className="space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-500">
                                {formatDateLabel(date)}
                            </span>
                            {dayBookings.length > 0 ? (
                                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                                    {dayBookings.length} รายการ
                                </span>
                            ) : (
                                <span className="text-[10px] font-medium text-slate-300">ว่าง</span>
                            )}
                        </div>
                        <DayTimelineBar bookings={dayBookings} isToday={false} />
                    </div>
                )
            })}
        </div>
    )
}

// --- Exported components ---

interface RoomTimelineCardProps {
    roomId: number
    isExpanded: boolean
    onToggle: (e: React.MouseEvent) => void
}

export function RoomTimelineToggle({ isExpanded, onToggle }: Pick<RoomTimelineCardProps, 'isExpanded' | 'onToggle'>) {
    return (
        <button
            className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium hover:text-slate-600 transition-colors py-1 px-2 rounded-lg hover:bg-slate-50"
            onClick={onToggle}
            title={isExpanded ? 'ซ่อน 7 วันถัดไป' : 'ดู 7 วันถัดไป'}
        >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{isExpanded ? 'ซ่อน' : `ดูอีก ${FUTURE_DAYS} วัน`}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
    )
}

export function RoomTimelinePanel({ roomId, isExpanded }: Pick<RoomTimelineCardProps, 'roomId' | 'isExpanded'>) {
    return (
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
            <div className="px-6 pb-4 pt-2">
                <FutureDaysContent roomId={roomId} />
            </div>
        </div>
    )
}

export function useExpandedRooms() {
    const [expandedRooms, setExpandedRooms] = useState<Set<number>>(new Set())

    const isExpanded = (roomId: number) => expandedRooms.has(roomId)

    const toggleExpand = (roomId: number, e: React.MouseEvent) => {
        e.stopPropagation()
        setExpandedRooms(prev => {
            const next = new Set(prev)
            if (next.has(roomId)) {
                next.delete(roomId)
            } else {
                next.add(roomId)
            }
            return next
        })
    }

    return { isExpanded, toggleExpand }
}

// =============================================
// REUSABLE DAY TIMELINE — สำหรับใช้ในฟอร์มการจอง
// =============================================
export function RoomDayTimeline({ roomId, date, label }: { roomId: number, date?: Date, label?: string }) {
    const dateKey = useMemo(() => date ? formatDateKey(date) : formatDateKey(new Date()), [date])
    const dateLabel = useMemo(() => date ? formatDateLabel(date) : 'วันนี้', [date])

    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['bookings', 'room-day-timeline', roomId, dateKey],
        queryFn: () => bookingService.list({ resource_id: roomId, from: dateKey, to: dateKey, per_page: 50 }),
        enabled: !!roomId,
    })

    const dayBookings = useMemo(() => {
        return (bookingsData?.data ?? []).filter(b => {
            const isConfirmed = b.status !== BOOKING_STATUS.CANCELLED;
            const isTargetDate = b.start_time.startsWith(dateKey);
            return isConfirmed && isTargetDate;
        })
    }, [bookingsData, dateKey])

    if (!roomId) return null;

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-4 text-slate-400 text-xs bg-slate-50/50 rounded-xl px-4 border border-dashed border-slate-200">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500" />
                <span>กำลังโหลดข้อมูลความว่างสำหรับ {label || dateLabel}...</span>
            </div>
        )
    }

    return (
        <div className="space-y-2 p-4 bg-white rounded-xl border border-blue-50 shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                    <CalendarDays className="w-3.5 h-3.5 text-blue-500" />
                    <span>ตารางการจอง: {label || dateLabel}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-slate-100 border border-slate-200" />
                        <span className="text-[10px] text-slate-400 font-medium">ว่าง</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-amber-200 border border-amber-300" />
                        <span className="text-[10px] text-slate-400 font-medium">รออนุมัติ</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-200 border border-emerald-300" />
                        <span className="text-[10px] text-slate-400 font-medium">จองแล้ว</span>
                    </div>
                </div>
            </div>

            <div className="relative pt-4">
                {/* Hour labels */}
                <div className="flex justify-between text-[9px] text-slate-400 font-bold mb-1 px-1">
                    {TIMELINE_HOURS.map((h) => (
                        <span key={h} className="w-0 text-center relative">
                            {String(h).padStart(2, '0')}
                        </span>
                    ))}
                </div>

                <DayTimelineBar bookings={dayBookings} isToday={dateKey === formatDateKey(new Date())} />

                <div className="flex justify-between mt-1 px-1">
                    <span className="text-[8px] text-slate-300 font-bold">07:00</span>
                    <span className="text-[8px] text-slate-300 font-bold">18:00</span>
                </div>
            </div>

            {dayBookings.length > 0 ? (
                <p className="text-[10px] text-orange-600 font-medium text-center italic bg-orange-50/50 py-1 rounded-lg">
                    * มีการจอง {dayBookings.length} รายการในวันที่เลือก กรุณาตรวจสอบเวลาที่ว่าง
                </p>
            ) : (
                <p className="text-[10px] text-emerald-600 font-medium text-center italic bg-emerald-50/50 py-1 rounded-lg">
                    * ห้องว่างตลอดทั้งวันสำหรับวันที่เลือก
                </p>
            )}
        </div>
    )
}
