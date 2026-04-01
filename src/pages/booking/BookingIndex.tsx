import { useQuery, useMutation } from '@tanstack/react-query'
import { roomService } from '@/services/room.service'
import { bookingService } from '@/services/booking.service'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, CalendarPlus, FileText, Clock, MapPin } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import type { CreateBookingDto } from '@/types/booking.dto'
import { DateTimePicker } from '@/components/date-time-picker'

export function BookingIndex() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState<{
        title: string
        resource_id: number | undefined
        start_time: Date | undefined
        end_time: Date | undefined
    }>({
        title: '',
        resource_id: undefined,
        start_time: undefined,
        end_time: undefined,
    })

    const { data: roomsData, isLoading: isLoadingRooms } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.list({ per_page: 100 }), // ดึงห้องมาแบบไม่ต้องแบ่งเยอะ
    })

    const createMutation = useMutation({
        mutationFn: (data: CreateBookingDto) => bookingService.create(data),
        onSuccess: () => {
            toast.success('ส่งคำขอจองห้องประชุมสำเร็จ')
            navigate({ to: '/bookings/my' } as any)
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'ไม่สามารถทำการจองได้ กรุณาตรวจสอบข้อมูล')
            setIsSubmitting(false)
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

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

        setIsSubmitting(true)
        createMutation.mutate({
            title: formData.title,
            resource_id: Number(formData.resource_id),
            start_time: start.toISOString(),
            end_time: end.toISOString()
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out py-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 text-slate-500 hover:bg-white hover:shadow-sm transition-all rounded-full"
                    onClick={() => window.history.back()}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">สร้างการจองใหม่</h1>
                    <p className="text-slate-500 mt-1">กรอกข้อมูลเพื่อขอใช้งานห้องประชุม</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden relative">
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
                            <label className="text-sm font-semibold text-slate-700">หัวข้อการประชุม <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="เช่น ประชุมสรุปโปรเจกต์ Q3"
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">ห้องประชุมที่ต้องการ <span className="text-red-500">*</span></label>
                            {isLoadingRooms ? (
                                <div className="h-12 flex items-center px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> กำลังโหลดรายชื่อห้อง...
                                </div>
                            ) : (
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    <select
                                        name="resource_id"
                                        value={formData.resource_id || ''}
                                        onChange={handleChange}
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none"
                                        required
                                    >
                                        <option value="" disabled>-- เลือกห้องประชุม --</option>
                                        {roomsData?.data?.filter(r => r.is_active).map(room => (
                                            <option key={room.id} value={room.id}>
                                                {room.name} (จุ {room.capacity} คน) {room.requires_approval ? '- ต้องรออนุมัติ' : ''}
                                            </option>
                                        ))}
                                    </select>
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
                                <label className="text-sm font-semibold text-slate-700">เวลาเริ่มต้น <span className="text-red-500">*</span></label>
                                <DateTimePicker
                                    date={formData.start_time}
                                    setDate={(date) => setFormData(p => ({ ...p, start_time: date }))}
                                    label="เลือกเวลาเริ่มประชุม"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">เวลาสิ้นสุด <span className="text-red-500">*</span></label>
                                <DateTimePicker
                                    date={formData.end_time}
                                    setDate={(date) => setFormData(p => ({ ...p, end_time: date }))}
                                    label="เลือกเวลาสิ้นสุดประชุม"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
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
                                    <CalendarPlus className="w-5 h-5 mr-2" />
                                    ยืนยันการจอง
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
