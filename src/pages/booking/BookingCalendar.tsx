import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { bookingService } from '@/services/booking.service'
import { Button } from '@/components/ui/button'
import { useNavigate, Link } from '@tanstack/react-router'
import {
    ChevronLeft,
    ChevronRight,
    CalendarPlus,
    Loader2,
    CalendarDays,
    LayoutGrid,
    DoorOpen,
} from 'lucide-react'
import type { Booking } from '@/types'

type ViewMode = 'month' | 'week'

const STATUS_STYLES: Record<number, { bg: string; text: string; dot: string }> = {
    0: { bg: 'bg-amber-100 border-amber-200', text: 'text-amber-800', dot: 'bg-amber-400' },
    1: { bg: 'bg-emerald-100 border-emerald-200', text: 'text-emerald-800', dot: 'bg-emerald-500' },
    2: { bg: 'bg-red-100 border-red-200', text: 'text-red-700', dot: 'bg-red-400' },
}

const STATUS_LABEL: Record<number, string> = {
    0: 'รอการอนุมัติ',
    1: 'อนุมัติแล้ว',
    2: 'ยกเลิกแล้ว',
}

const DAY_NAMES = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
const DAY_NAMES_FULL = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
const MONTH_NAMES = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]
const HOURS = Array.from({ length: 14 }, (_, i) => i + 7) // 07:00 – 20:00

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
}

function startOfWeek(date: Date) {
    const d = new Date(date)
    d.setDate(d.getDate() - d.getDay())
    d.setHours(0, 0, 0, 0)
    return d
}

function formatTime(date: Date) {
    return date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
}

// ──────────────────────────────────────────────────────────────
// Booking pill for month view
// ──────────────────────────────────────────────────────────────
function BookingPill({ booking, onClick }: { booking: Booking; onClick: () => void }) {
    const s = STATUS_STYLES[Number(booking.status)] ?? STATUS_STYLES[0]
    return (
        <button
            onClick={(e) => { e.stopPropagation(); onClick() }}
            className={`w-full text-left px-1.5 py-0.5 rounded-md text-[10px] font-medium border truncate transition-opacity hover:opacity-80 ${s.bg} ${s.text}`}
        >
            <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${s.dot}`} />
            {new Date(booking.start_time).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })} {booking.title}
        </button>
    )
}

// ──────────────────────────────────────────────────────────────
// Month View
// ──────────────────────────────────────────────────────────────
function MonthView({
    year, month, bookings, today, onBookingClick,
}: {
    year: number; month: number; bookings: Booking[]; today: Date; onBookingClick: (b: Booking) => void
}) {
    const firstDay = new Date(year, month, 1)
    const startOffset = firstDay.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()

    const cells: Array<Date | null> = [
        ...Array(startOffset).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
    ]
    // pad to full rows
    while (cells.length % 7 !== 0) cells.push(null)

    const bookingsMap = useMemo(() => {
        const map = new Map<string, Booking[]>()
        bookings.forEach(b => {
            const key = new Date(b.start_time).toDateString()
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(b)
        })
        return map
    }, [bookings])

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-slate-100">
                {DAY_NAMES.map((d, i) => (
                    <div key={d} className={`py-3 text-center text-xs font-semibold uppercase tracking-wider ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>
                        {d}
                    </div>
                ))}
            </div>
            {/* Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-slate-50">
                {cells.map((date, idx) => {
                    if (!date) return <div key={`empty-${idx}`} className="min-h-[110px] bg-slate-50/50" />
                    const isToday = isSameDay(date, today)
                    const dayBookings = bookingsMap.get(date.toDateString()) ?? []
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6

                    return (
                        <div
                            key={date.toDateString()}
                            className={`min-h-[110px] p-1.5 flex flex-col gap-0.5 ${isWeekend ? 'bg-slate-50/60' : 'bg-white'} hover:bg-blue-50/30 transition-colors`}
                        >
                            <div className={`self-start w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold mb-0.5 ${isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : isWeekend ? 'text-slate-400' : 'text-slate-600'}`}>
                                {date.getDate()}
                            </div>
                            <div className="flex flex-col gap-0.5 overflow-hidden">
                                {dayBookings.slice(0, 3).map(b => (
                                    <BookingPill key={b.id} booking={b} onClick={() => onBookingClick(b)} />
                                ))}
                                {dayBookings.length > 3 && (
                                    <span className="text-[10px] text-slate-400 pl-1">+{dayBookings.length - 3} อื่นๆ</span>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// ──────────────────────────────────────────────────────────────
// Week View
// ──────────────────────────────────────────────────────────────
function WeekView({
    weekStart, bookings, today, onBookingClick,
}: {
    weekStart: Date; bookings: Booking[]; today: Date; onBookingClick: (b: Booking) => void
}) {
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(weekStart)
        d.setDate(weekStart.getDate() + i)
        return d
    })

    const bookingsByDay = useMemo(() => {
        return days.map(day => ({
            day,
            bookings: bookings.filter(b => isSameDay(new Date(b.start_time), day)),
        }))
    }, [bookings, weekStart])

    const CELL_HEIGHT = 60 // px per hour

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header row */}
            <div className="grid border-b border-slate-100" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
                <div className="py-3 border-r border-slate-100" />
                {days.map((d, i) => {
                    const isToday = isSameDay(d, today)
                    return (
                        <div key={i} className={`py-3 text-center border-r border-slate-50 last:border-r-0 ${isToday ? 'bg-blue-50' : ''}`}>
                            <p className={`text-[10px] font-semibold uppercase tracking-wider ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>
                                {DAY_NAMES_FULL[i]}
                            </p>
                            <p className={`text-lg font-bold mt-0.5 ${isToday ? 'text-blue-600' : 'text-slate-700'}`}>
                                {d.getDate()}
                            </p>
                        </div>
                    )
                })}
            </div>

            {/* Time grid */}
            <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
                <div className="relative" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
                    {HOURS.map(hour => (
                        <div key={hour} className="grid border-b border-slate-50" style={{ gridTemplateColumns: '52px repeat(7, 1fr)', minHeight: CELL_HEIGHT }}>
                            {/* Hour label */}
                            <div className="border-r border-slate-100 flex items-start justify-end pr-2 pt-1">
                                <span className="text-[10px] text-slate-300 font-medium">{String(hour).padStart(2, '0')}:00</span>
                            </div>
                            {/* Day columns */}
                            {bookingsByDay.map(({ day, bookings: dayBookings }, dayIdx) => {
                                const isToday = isSameDay(day, today)
                                const hourBookings = dayBookings.filter(b => {
                                    const start = new Date(b.start_time)
                                    return start.getHours() === hour
                                })
                                return (
                                    <div
                                        key={dayIdx}
                                        className={`border-r border-slate-50 last:border-r-0 relative p-0.5 ${isToday ? 'bg-blue-50/30' : ''}`}
                                        style={{ minHeight: CELL_HEIGHT }}
                                    >
                                        {hourBookings.map(b => {
                                            const start = new Date(b.start_time)
                                            const end = new Date(b.end_time)
                                            const durationH = Math.max(0.5, (end.getTime() - start.getTime()) / 3600000)
                                            const s = STATUS_STYLES[Number(b.status)] ?? STATUS_STYLES[0]
                                            return (
                                                <button
                                                    key={b.id}
                                                    onClick={() => onBookingClick(b)}
                                                    title={`${b.title}\n${formatTime(start)} – ${formatTime(end)}`}
                                                    className={`w-full text-left rounded-lg px-2 py-1 border text-[10px] font-medium transition-opacity hover:opacity-80 ${s.bg} ${s.text}`}
                                                    style={{ minHeight: Math.max(28, durationH * CELL_HEIGHT - 4) }}
                                                >
                                                    <p className="font-semibold truncate">{b.title}</p>
                                                    <p className="opacity-70">{formatTime(start)} – {formatTime(end)}</p>
                                                    {b.resource?.name && (
                                                        <p className="opacity-60 flex items-center gap-0.5 truncate">
                                                            <DoorOpen className="w-2.5 h-2.5 inline" /> {b.resource.name}
                                                        </p>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// ──────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────
export function BookingCalendar() {
    const navigate = useNavigate()
    const today = useMemo(() => new Date(), [])

    const [viewMode, setViewMode] = useState<ViewMode>('month')
    const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

    // Derive range for API call
    const { from, to } = useMemo(() => {
        if (viewMode === 'month') {
            const y = currentDate.getFullYear()
            const m = currentDate.getMonth()
            return {
                from: new Date(y, m, 1).toISOString().slice(0, 10),
                to: new Date(y, m + 1, 0).toISOString().slice(0, 10),
            }
        } else {
            const ws = startOfWeek(currentDate)
            const we = new Date(ws)
            we.setDate(ws.getDate() + 6)
            return {
                from: ws.toISOString().slice(0, 10),
                to: we.toISOString().slice(0, 10),
            }
        }
    }, [viewMode, currentDate])

    const { data, isLoading } = useQuery({
        queryKey: ['bookings-calendar', from, to],
        queryFn: () => bookingService.myBookings({ from, to, per_page: 200 }),
    })

    const bookings: Booking[] = data?.data ?? []

    function navigate_prev() {
        setCurrentDate(prev => {
            const d = new Date(prev)
            if (viewMode === 'month') d.setMonth(d.getMonth() - 1)
            else d.setDate(d.getDate() - 7)
            return d
        })
    }

    function navigate_next() {
        setCurrentDate(prev => {
            const d = new Date(prev)
            if (viewMode === 'month') d.setMonth(d.getMonth() + 1)
            else d.setDate(d.getDate() + 7)
            return d
        })
    }

    function goToday() {
        if (viewMode === 'month')
            setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
        else
            setCurrentDate(startOfWeek(today))
    }

    const weekStart = startOfWeek(currentDate)

    const headerTitle = viewMode === 'month'
        ? `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear() + 543}`
        : (() => {
            const ws = weekStart
            const we = new Date(ws); we.setDate(ws.getDate() + 6)
            if (ws.getMonth() === we.getMonth())
                return `${ws.getDate()}–${we.getDate()} ${MONTH_NAMES[ws.getMonth()]} ${ws.getFullYear() + 543}`
            return `${ws.getDate()} ${MONTH_NAMES[ws.getMonth()]} – ${we.getDate()} ${MONTH_NAMES[we.getMonth()]} ${we.getFullYear() + 543}`
        })()

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">ปฏิทินการจอง</h1>
                    <p className="text-slate-500 mt-1">ดูและจัดการการจองห้องประชุม</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-5 rounded-xl shadow-lg shadow-blue-100">
                    <Link to="/bookings/add">
                        <CalendarPlus className="h-5 w-5" />
                        จองห้องเพิ่ม
                    </Link>
                </Button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Prev / Today / Next */}
                <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" onClick={navigate_prev} className="h-9 w-9 rounded-xl border-slate-200 text-slate-500">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={goToday} className="h-9 px-4 rounded-xl border-slate-200 text-slate-600 text-sm font-medium">
                        วันนี้
                    </Button>
                    <Button variant="outline" size="icon" onClick={navigate_next} className="h-9 w-9 rounded-xl border-slate-200 text-slate-500">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-slate-800 flex-1 min-w-[180px]">{headerTitle}</h2>

                {/* View toggle */}
                <div className="flex items-center rounded-xl border border-slate-200 p-1 gap-1 bg-slate-50">
                    <button
                        onClick={() => { setViewMode('month'); setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1)) }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'month' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <LayoutGrid className="h-3.5 w-3.5" /> รายเดือน
                    </button>
                    <button
                        onClick={() => { setViewMode('week'); setCurrentDate(startOfWeek(today)) }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === 'week' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <CalendarDays className="h-3.5 w-3.5" /> รายสัปดาห์
                    </button>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
                {Object.entries(STATUS_LABEL).map(([k, label]) => {
                    const s = STATUS_STYLES[Number(k)]
                    return (
                        <span key={k} className="flex items-center gap-1.5">
                            <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />
                            {label}
                        </span>
                    )
                })}
            </div>

            {/* Calendar */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-3">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium">กำลังโหลดปฏิทิน...</p>
                </div>
            ) : viewMode === 'month' ? (
                <MonthView
                    year={currentDate.getFullYear()}
                    month={currentDate.getMonth()}
                    bookings={bookings}
                    today={today}
                    onBookingClick={b => navigate({ to: '/bookings/$bookingId', params: { bookingId: b.id.toString() } } as any)}
                />
            ) : (
                <WeekView
                    weekStart={weekStart}
                    bookings={bookings}
                    today={today}
                    onBookingClick={b => navigate({ to: '/bookings/$bookingId', params: { bookingId: b.id.toString() } } as any)}
                />
            )}
        </div>
    )
}
