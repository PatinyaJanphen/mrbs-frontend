import { useQuery } from '@tanstack/react-query'
import { DoorOpen, Loader2, Search, Plus } from 'lucide-react'
import { roomService } from '@/services/room.service'
import { RoomCard } from './components/RoomCard'
import { BookingModal } from './components/BookingModal'
import type { Room } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function RoomsPage() {
    const [search, setSearch] = useState('')
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
    const [isBookingOpen, setIsBookingOpen] = useState(false)

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
                    <p className="text-slate-500 mt-1">ค้นหาและเลือกจองห้องประชุมที่เหมาะกับคุณ</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-5 rounded-xl shadow-lg shadow-blue-100">
                    <Plus className="h-4.5 w-4.5" />
                    เพิ่มห้องประชุม
                </Button>
            </div>

            {/* Filter bar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="ค้นหาชื่อห้องประชุม หรืออุปกรณ์..." 
                        className="pl-11 h-11 border-none bg-transparent focus-visible:ring-0 text-slate-600"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-11 w-px bg-slate-100 hidden sm:block mx-1" />
                <Button variant="ghost" className="h-11 px-6 text-slate-500 hover:text-slate-800 rounded-xl">
                    ตัวกรองอื่นๆ
                </Button>
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
                        <RoomCard 
                            key={room.id} 
                            room={room} 
                            onBook={() => {
                                setSelectedRoom(room)
                                setIsBookingOpen(true)
                            }}
                        />
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

            <BookingModal 
                room={selectedRoom}
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
            />
        </div>
    )
}
