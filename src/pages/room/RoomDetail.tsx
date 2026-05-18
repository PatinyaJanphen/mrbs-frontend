import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { roomService } from '@/services/room.service'
import { useRoom } from '@/hooks/queries/useRooms'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, XCircle, Building2, CalendarPlus, Edit2 } from 'lucide-react'
import { useNavigate, Link, useParams } from '@tanstack/react-router'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/useAuth'
import { RoomForm } from './components/RoomForm'
import type { CreateRoomDto } from '@/types/room.dto'

export function RoomDetail() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { isAdmin } = useAuth()

    const [isEditing, setIsEditing] = useState(false)

    const { roomId: roomIdStr } = useParams({ from: '/_layout/rooms/$roomId' })
    const roomId = Number(roomIdStr)

    const { data: room, isLoading, error } = useRoom(roomId, {
        enabled: !!roomId,
    })

    const updateMutation = useMutation({
        mutationFn: (data: CreateRoomDto) => roomService.update(roomId, data),
        onSuccess: () => {
            toast.success('แก้ไขข้อมูลห้องสำเร็จ')
            queryClient.invalidateQueries({ queryKey: ['room', roomId] })
            queryClient.invalidateQueries({ queryKey: ['rooms'] })
            setIsEditing(false)
            navigate({ to: '/rooms' } as any)
        },
        onError: () => {
            toast.error('ไม่สามารถแก้ไขข้อมูลห้องได้')
        }
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium animate-pulse">กำลังดึงข้อมูลห้องประชุม...</p>
            </div>
        )
    }

    if (error || !room) {
        return (
            <div className="max-w-2xl mx-auto mt-20 p-8 bg-red-50 rounded-3xl border border-red-100 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-2xl font-bold text-red-900">ไม่พบห้องประชุม</h3>
                <p className="text-red-700">ไม่พบข้อมูลห้องประชุม</p>
                <Button
                    variant="outline"
                    className="mt-6 border-red-200 text-red-700 hover:bg-red-100 px-8 h-11"
                    onClick={() => navigate({ to: '/rooms' } as any)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    กลับหน้าห้องประชุม
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 shrink-0 text-slate-500 hover:bg-white hover:shadow-sm transition-all rounded-full"
                        onClick={() => navigate({ to: '/rooms' } as any)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-800">
                                {isEditing ? 'แก้ไขข้อมูลห้อง' : room.name}
                            </h1>
                            <div className={`px-3 py-1 text-xs font-semibold rounded-full border ${room.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {room.is_active ? 'พร้อมใช้งาน' : 'ปิดปรับปรุง'}
                            </div>
                        </div>
                        {!isEditing && (
                            <p className="flex items-center gap-2 text-slate-500 text-sm">
                                <Building2 className="w-4 h-4" />
                                ข้อมูลห้องประชุม
                            </p>
                        )}
                        {isEditing && (
                            <p className="text-slate-500 text-sm">ปรับปรุงรายละเอียดของ {room.name}</p>
                        )}
                    </div>
                </div>

                {!isEditing && (
                    <div className="flex items-center gap-3">
                        {isAdmin ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                className="h-12 px-8 rounded-full bg-slate-800 hover:bg-slate-900 text-white shadow-lg gap-2 font-medium transition-transform hover:scale-105 active:scale-95"
                            >
                                <Edit2 className="w-4 h-4" />
                                แก้ไขข้อมูลห้อง
                            </Button>
                        ) : (
                            <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 gap-2 font-medium transition-transform hover:scale-105 active:scale-95">
                                <Link to="/bookings/add" search={{ roomId: room.id }}>
                                    <CalendarPlus className="w-5 h-5" />
                                    จองห้องนี้เลย
                                </Link>
                            </Button>
                        )}
                    </div>
                )}
            </div>

            <RoomForm
                initialData={room}
                isLoading={updateMutation.isPending}
                isReadOnly={!isEditing}
                onSubmit={(data) => updateMutation.mutate(data)}
                onCancel={() => setIsEditing(false)}
                submitLabel="บันทึกการแก้ไข"
            />
        </div>
    )
}

