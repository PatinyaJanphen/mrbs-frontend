import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FileText, Clock, MapPin, Loader2, CalendarPlus, Save } from 'lucide-react'
import { DateTimePicker } from '@/components/date-time-picker'
import { toast } from 'sonner'
import type { CreateBookingDto } from '@/types/booking.dto'
import type { PaginatedRooms } from '@/types/room.dto'
import { Input } from '#/components/ui/input'

interface BookingFormProps {
    initialData?: Partial<CreateBookingDto>
    roomsData?: PaginatedRooms
    isLoadingRooms?: boolean
    isSubmitting?: boolean
    onSubmit: (data: CreateBookingDto) => void
    submitLabel?: string
    isReadOnly?: boolean
}

export function BookingForm({
    initialData,
    roomsData,
    isLoadingRooms,
    isSubmitting,
    onSubmit,
    submitLabel = 'ยืนยันการจอง',
    isReadOnly = false
}: BookingFormProps) {
    const [formData, setFormData] = useState<{
        title: string
        resource_id: number | undefined
        start_time: Date | undefined
        end_time: Date | undefined
    }>({
        title: initialData?.title || '',
        resource_id: initialData?.resource_id || undefined,
        start_time: initialData?.start_time ? new Date(initialData.start_time) : undefined,
        end_time: initialData?.end_time ? new Date(initialData.end_time) : undefined,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isReadOnly) return

        if (!formData.title || !formData.resource_id || !formData.start_time || !formData.end_time) {
            toast.error('กรุณากรอกข้อมูลให้ครบถ้วน')
            return
        }

        const start = formData.start_time
        const end = formData.end_time

        if (end <= start) {
            toast.error('เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น')
            return
        }

        // Check if same day
        const isSameDay =
            start.getDate() === end.getDate() &&
            start.getMonth() === end.getMonth() &&
            start.getFullYear() === end.getFullYear()

        if (!isSameDay) {
            toast.error('ระบบไม่รองรับการจองข้ามวัน กรุณาจองภายในวันเดียวกัน')
            return
        }

        // Format local date securely without converting to UTC
        const formatLocal = (d: Date) => {
            const pad = (n: number) => n.toString().padStart(2, '0')
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`
        }

        onSubmit({
            title: formData.title,
            resource_id: Number(formData.resource_id),
            start_time: formatLocal(start),
            end_time: formatLocal(end)
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className={`bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative ${isReadOnly ? 'bg-slate-50/50' : ''}`}>
            {/* Decorative blob */}
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-blue-50 rounded-full blur-3xl pointer-events-none" />

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8 relative z-10">
                {/* Section 1: details */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <FileText className="w-5 h-5" />
                        </div>
                        รายละเอียดการประชุม
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">หัวข้อการประชุม {!isReadOnly && <span className="text-red-500">*</span>}</label>
                        <Input
                            type="text"
                            name="title"
                            disabled={isReadOnly}
                            value={formData.title}
                            onChange={handleChange}
                            placeholder={isReadOnly ? 'ไม่มีชื่อการประชุม' : "เช่น ประชุมสรุปโปรเจกต์ Q3"}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none disabled:bg-white disabled:opacity-80"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">ห้องประชุมที่ต้องการ {!isReadOnly && <span className="text-red-500">*</span>}</label>
                        {isLoadingRooms ? (
                            <div className="h-12 flex items-center px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังโหลดรายชื่อห้อง...
                            </div>
                        ) : (
                            <div className="relative">
                                <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isReadOnly ? 'text-slate-300' : 'text-slate-400'} pointer-events-none`} />
                                <select
                                    name="resource_id"
                                    disabled={isReadOnly}
                                    value={formData.resource_id || ''}
                                    onChange={handleChange}
                                    className={`w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none disabled:bg-white disabled:opacity-80`}
                                    required
                                >
                                    <option value="" disabled>-- เลือกห้องประชุม --</option>
                                    {roomsData?.data?.filter(r => r.is_active || r.id === formData.resource_id).map(room => (
                                        <option key={room.id} value={room.id}>
                                            {room.name} (จุ {room.capacity} คน) {room.requires_approval ? '- ต้องรออนุมัติ' : ''}
                                        </option>
                                    ))}
                                </select>
                                {!isReadOnly && (
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 2: Time */}
                <div className="space-y-6 pt-4">
                    <div className="flex items-center gap-3 text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <Clock className="w-5 h-5" />
                        </div>
                        เวลาที่ต้องการใช้งาน
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">เวลาเริ่มต้น {!isReadOnly && <span className="text-red-500">*</span>}</label>
                            <DateTimePicker
                                date={formData.start_time}
                                disabled={isReadOnly}
                                setDate={(date) => setFormData(p => ({ ...p, start_time: date }))}
                                label="เลือกเวลาเริ่มประชุม"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">เวลาสิ้นสุด {!isReadOnly && <span className="text-red-500">*</span>}</label>
                            <DateTimePicker
                                date={formData.end_time}
                                disabled={isReadOnly}
                                setDate={(date) => setFormData(p => ({ ...p, end_time: date }))}
                                label="เลือกเวลาสิ้นสุดประชุม"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                {!isReadOnly && (
                    <div className="pt-8">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-14 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-1 active:translate-y-0"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    กำลังดำเนินการ...
                                </>
                            ) : (
                                <>
                                    {initialData?.resource_id ? <Save className="w-5 h-5 mr-2" /> : <CalendarPlus className="w-5 h-5 mr-2" />}
                                    {submitLabel}
                                </>
                            )}
                        </Button>
                    </div>
                )}
            </form>
        </div>

    )
}
