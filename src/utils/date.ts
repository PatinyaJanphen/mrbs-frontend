import { format, formatDistance, parseISO } from 'date-fns'
import { th } from 'date-fns/locale'

/** แปลง ISO string → "26 มี.ค. 2025, 14:30" */
export function formatDateTime(iso: string): string {
    return format(parseISO(iso), 'd MMM yyyy, HH:mm', { locale: th })
}

/** แปลง ISO string → "26 มี.ค. 2025" */
export function formatDate(iso: string): string {
    return format(parseISO(iso), 'd MMM yyyy', { locale: th })
}

/** แปลง ISO string → "14:30" */
export function formatTime(iso: string): string {
    return format(parseISO(iso), 'HH:mm')
}

/** แสดงช่วงเวลาของการจอง เช่น "14:30 – 16:00" */
export function formatTimeRange(start: string, end: string): string {
    return `${formatTime(start)} – ${formatTime(end)}`
}

/** แสดงเวลาสัมพัทธ์ เช่น "2 ชั่วโมงที่ผ่านมา" */
export function fromNow(iso: string): string {
    return formatDistance(parseISO(iso), new Date(), { addSuffix: true, locale: th })
}

/** คำนวณระยะเวลาการจองเป็นชั่วโมง */
export function durationHours(start: string, end: string): number {
    const diff = parseISO(end).getTime() - parseISO(start).getTime()
    return Math.round((diff / 1000 / 60 / 60) * 10) / 10
}
