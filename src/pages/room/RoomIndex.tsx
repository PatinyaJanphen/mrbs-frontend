import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { roomService } from '@/services/room.service'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { RoomForm } from './components/RoomForm'
import type { CreateRoomDto } from '@/types/room.dto'

export function RoomsIndex() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (data: CreateRoomDto) => {
        setIsLoading(true)
        try {
            await roomService.create(data)
            toast.success('เพิ่มห้องประชุมสำเร็จ')
            navigate({ to: '/rooms' } as any)
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการเพิ่มห้อง')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 text-slate-500 hover:text-slate-800"
                    onClick={() => navigate({ to: '/rooms' } as any)}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">เพิ่มห้องประชุมใหม่</h1>
                    <p className="text-slate-500 text-sm">กรอกรายละเอียดเพื่อสร้างห้องประชุมใหม่ในระบบ</p>
                </div>
            </div>

            {/* Form Component */}
            <RoomForm 
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onCancel={() => navigate({ to: '/rooms' } as any)}
            />
        </div>
    )
}
