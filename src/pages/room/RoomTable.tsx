import { useQuery } from '@tanstack/react-query'
import { DoorOpen, Loader2, Search, Plus, Users } from 'lucide-react'
import { roomService } from '@/services/room.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

export function RoomsPage() {
    const [search, setSearch] = useState('')
    const navigate = useNavigate()

    const { data: roomsData, isLoading, error } = useQuery({
        queryKey: ['rooms', { search }],
        queryFn: () => roomService.list({ search }),
    })

    const rooms = roomsData?.data ?? []

    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">ห้องประชุม</h1>
                    <p className="text-slate-500 mt-1">จัดการห้องประชุมของระบบ</p>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-5 rounded-xl shadow-lg shadow-blue-100"
                    onClick={() => navigate({ to: '/rooms/add' } as any)}
                >
                    <Plus className="h-4.5 w-4.5" />
                    เพิ่มห้องประชุม
                </Button>
            </div>

            {/* Filter bar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="ค้นหาชื่อห้องประชุม..."
                        className="pl-11 h-11 border-none bg-transparent focus-visible:ring-0 text-slate-600"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* List section */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium">กำลังโหลดข้อมูลห้องประชุม...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
                    <p className="text-red-600 font-medium">เกิดข้อผิดพลาดในการดึงข้อมูล</p>
                    <p className="text-red-400 text-sm mt-1">กรุณาลองใหม่อีกครั้งในภายหลัง</p>
                </div>
            ) : rooms.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer overflow-hidden p-5 flex flex-col group"
                            onClick={() => navigate({ to: '/rooms/$roomId', params: { roomId: room.id.toString() } } as any)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold text-lg text-slate-800">{room.name}</h3>
                                <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${room.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {room.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                </div>
                            </div>

                            <p className="text-slate-500 text-sm mb-4 line-clamp-2 min-h-10">
                                {room.description || 'ไม่มีรายละเอียด'}
                            </p>

                            <div className="flex items-center gap-4 text-slate-500 text-sm mt-auto pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-blue-500" />
                                    <span>{room.capacity} ท่าน</span>
                                </div>
                            </div>

                            <div className="mt-4 w-full">
                                <Button className="w-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 transition-colors" variant="ghost">
                                    ดูรายละเอียด
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-slate-50 mb-6">
                        <DoorOpen className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">ไม่พบห้องประชุม</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                        ไม่พบข้อมูลที่คุณกำลังค้นหา กรุณาลองใช้เงื่อนไขอื่น
                    </p>
                </div>
            )}
        </div>
    )
}
