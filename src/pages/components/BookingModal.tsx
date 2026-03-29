import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { bookingService } from '@/services/booking.service'
import type { Room } from '@/types'

interface BookingModalProps {
    room: Room | null
    isOpen: boolean
    onClose: () => void
}

export function BookingModal({ room, isOpen, onClose }: BookingModalProps) {
    const queryClient = useQueryClient()
    const [title, setTitle] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    const createBooking = useMutation({
        mutationFn: (data: { resource_id: number; title: string; start_time: string; end_time: string }) =>
            bookingService.create(data),
        onSuccess: () => {
            toast.success('จองห้องประชุมสำเร็จ')
            queryClient.invalidateQueries({ queryKey: ['bookings-my'] })
            queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
            onClose()
            resetForm()
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการจอง'
            toast.error(message)
        },
    })

    const resetForm = () => {
        setTitle('')
        setStartTime('')
        setEndTime('')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!room) return

        createBooking.mutate({
            resource_id: room.id,
            title,
            start_time: startTime,
            end_time: endTime,
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            จองห้องประชุม 
                            <Badge variant="secondary" className="px-2 py-0.5 text-blue-600 bg-blue-50">
                                {room?.name}
                            </Badge>
                        </DialogTitle>
                        <DialogDescription>
                            กรอกข้อมูลการจองด้านล่างเพื่อสำรองที่นั่ง
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">หัวข้อการจอง</Label>
                            <Input
                                id="title"
                                placeholder="เช่น ประชุมวางแผนรายสัปดาห์"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="start">เริ่มเวลา</Label>
                            <Input
                                id="start"
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="end">สิ้นสุดเวลา</Label>
                            <Input
                                id="end"
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>
                            ยกเลิก
                        </Button>
                        <Button type="submit" disabled={createBooking.isPending}>
                            {createBooking.isPending ? 'กำลังจอง...' : 'ยืนยันการจอง'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
