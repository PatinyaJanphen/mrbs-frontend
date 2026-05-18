import { useMutation } from '@tanstack/react-query'
import { useRooms } from '@/hooks/queries/useRooms'
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

    const { data: roomsData, isLoading: isLoading } = useRooms({ per_page: 100 })

    const createMutation = useMutation({
        mutationFn: (data: CreateBookingDto) => bookingService.create(data),
        onSuccess: () => {
            toast.success('จองห้องประชุมสำเร็จ')
            navigate({ to: '/bookings/my' } as any)
        },
        onError: (err: any) => {
            toast.error(err?.response?.data?.message || 'ไม่สามารถทำการจองได้กรุณาลองอีกครั้ง')
            setIsSubmitting(false)
        }
    })

    const handleSubmit = (data: CreateBookingDto) => {
        setIsSubmitting(true)
        createMutation.mutate(data)
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 text-slate-500 hover:text-slate-800"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">สร้างการจองห้องประชุม</h1>
                        <p className="text-slate-500 text-sm">กรอกข้อมูลเพื่อจองห้องประชุม</p>
                    </div>
                </div>
            </div>

            <BookingForm
                roomsData={roomsData}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onCancel={() => navigate({ to: '/bookings/my' } as any)}
            />
        </div>
    )
}
