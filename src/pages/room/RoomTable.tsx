import { DoorOpen, Loader2, Search, Plus, Armchair, ReceiptText, History } from 'lucide-react'
import { useRooms } from '@/hooks/queries/useRooms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { TodayTimeline, RoomTimelineToggle, RoomTimelinePanel, useExpandedRooms } from './components/RoomTimeline'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export function RoomsPage() {
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const navigate = useNavigate()
    const { isAdmin, isSuperAdmin } = useAuth()
    const { isExpanded, toggleExpand } = useExpandedRooms()

    const { data: roomsData, isLoading, error } = useRooms({ search, page, per_page: 10 })

    useEffect(() => {
        setPage(1)
    }, [search])

    const rooms = roomsData?.data ?? []
    const canManage = isAdmin || isSuperAdmin;
    const totalPages = roomsData?.last_page ?? 1

    const handlePageChange = (p: number) => {
        if (p >= 1 && p <= totalPages) {
            setPage(p)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <div className="space-y-8">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">ห้องประชุม</h1>
                    <p className="text-slate-500 mt-1">รายการห้องประชุม</p>
                </div>

                {canManage && (
                    <div className="flex gap-2">
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-5 rounded-xl shadow-lg shadow-blue-100"
                            onClick={() => navigate({ to: "/rooms/add" } as any)}
                        >
                            <Plus className="h-5 w-5" />
                            เพิ่มห้องประชุมใหม่
                        </Button>
                    </div>
                )}
            </div>

            <div className="bg-white p-3 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    <Input
                        placeholder="ระบุชื่อห้องประชุมที่ต้องการค้นหา..."
                        className="pl-12 h-12 border-none bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500/20 rounded-2xl text-slate-700 placeholder:text-slate-400 font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium">กำลังโหลดข้อมูล...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
                    <p className="text-red-600 font-medium">เกิดข้อผิดพลาด {error.message}</p>
                    <p className="text-red-400 text-sm mt-1">กรุณาลองใหม่อีกครั้งในภายหลัง</p>
                </div>
            ) : rooms.length > 0 ? (
                <div className="space-y-4">
                    <div className="flex flex-col gap-4">
                        {rooms.map((room) => {
                            const expanded = isExpanded(room.id)
                            return (
                                <div
                                    key={room.id}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all group overflow-hidden"
                                >
                                    <div
                                        className="p-2 pl-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-blue-50/10"
                                        onClick={() => navigate({ to: '/rooms/$roomId', params: { roomId: room.id.toString() } } as any)}
                                    >
                                        <div className="flex items-center gap-6 py-4">
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors shrink-0">
                                                <DoorOpen className="w-7 h-7 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                            </div>

                                            <div className="space-y-1 min-w-0">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-blue-700 transition-colors">{room.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${room.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                                        {room.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                                                    </span>

                                                    {canManage && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 px-3 rounded-lg text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 font-bold gap-1.5 ml-auto"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                navigate({ to: '/rooms/$roomId/history', params: { roomId: room.id.toString() } } as any)
                                                            }}
                                                        >
                                                            <History className="h-3.5 w-3.5" />
                                                            ประวัติการจอง
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm line-clamp-1 max-w-md">
                                                    <Armchair className="w-4 h-4 text-blue-500" />
                                                    <span>ขนาดความจุ {room.capacity} ที่นั่ง</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-500 text-sm line-clamp-1 max-w-md">
                                                    <ReceiptText className="w-4 h-4 text-blue-500" />
                                                    {room.description || 'ไม่มีรายละเอียด'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 py-3 border-t border-slate-50">
                                        <div className="flex items-end gap-4 overflow-hidden">
                                            <div className="flex-1 min-w-0">
                                                <TodayTimeline roomId={room.id} />
                                            </div>
                                            <div className="shrink-0 pb-1" onClick={(e) => e.stopPropagation()}>
                                                <RoomTimelineToggle
                                                    isExpanded={expanded}
                                                    onToggle={(e) => toggleExpand(room.id, e)}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <RoomTimelinePanel roomId={room.id} isExpanded={expanded} />
                                </div>
                            )
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="pt-8 border-t border-slate-100">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); handlePageChange(page - 1) }}
                                            className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            text="ก่อนหน้า"
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                        <PaginationItem key={p} className="hidden sm:inline-block">
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handlePageChange(p) }}
                                                isActive={page === p}
                                                className="cursor-pointer font-bold"
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); handlePageChange(page + 1) }}
                                            className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                            text="ถัดไป"
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-slate-50 mb-6">
                        <Search className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">ไม่พบข้อมูล</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                        ลองเปลี่ยนคำค้นหา
                    </p>
                    <Button
                        variant="outline"
                        onClick={() => setSearch('')}
                        className="mt-8 text-blue-600 font-bold hover:bg-blue-50 rounded-xl"
                    >
                        ล้างคำค้นหา
                    </Button>
                </div>
            )
            }
        </div >
    )
}
