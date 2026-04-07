import { useQuery, useMutation } from '@tanstack/react-query'
import { roomService } from '@/services/room.service'
import { bookingService } from '@/services/booking.service'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import type { CreateBookingDto } from '@/types/booking.dto'
import { BookingForm } from './components/BookingForm'

export function BookingIndex() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { data: roomsData, isLoading: isLoadingRooms } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => roomService.list({ per_page: 100 }),
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

    const handleSubmit = (data: CreateBookingDto) => {
        setIsSubmitting(true)
        createMutation.mutate(data)
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

            {/* Form Component */}
            <BookingForm 
                roomsData={roomsData}
                isLoadingRooms={isLoadingRooms}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
            />
        </div>
    )
}
