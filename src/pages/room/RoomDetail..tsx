import { useQuery } from '@tanstack/react-query'
import { roomService } from '@/services/room.service'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, Users, LayoutGrid, CheckCircle2, XCircle, Info, Building2, CalendarPlus } from 'lucide-react'
import { useNavigate, useLocation, Link } from '@tanstack/react-router'

export function RoomDetail() {
    const navigate = useNavigate()
    const location = useLocation()

    const idParam = location.pathname.split('/').pop()
    const roomId = idParam ? parseInt(idParam, 10) : 0

    const { data: room, isLoading, error } = useQuery({
        queryKey: ['room', roomId],
        queryFn: () => roomService.get(roomId),
        enabled: !!roomId,
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
                <h3 className="text-2xl font-bold text-red-900">ไม่พบห้องประชุมนี้</h3>
                <p className="text-red-700">อภัยด้วย เราไม่สามารถค้นหาข้อมูลห้องประชุมที่คุณต้องการได้</p>
                <Button
                    variant="outline"
                    className="mt-6 border-red-200 text-red-700 hover:bg-red-100 px-8 h-11"
                    onClick={() => navigate({ to: '/rooms' } as any)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    กลับไปหน้ารวมห้องประชุม
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {/* Nav & Header */}
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
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{room.name}</h1>
                            <div className={`px-3 py-1 text-xs font-semibold rounded-full border ${room.is_active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                {room.is_active ? 'พร้อมใช้งาน' : 'ปิดปรับปรุง'}
                            </div>
                        </div>
                        <p className="text-slate-500 mt-2 flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            ID ระบบอ้างอิง: #{room.id}
                        </p>
                    </div>
                </div>

                <Button className="h-12 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 gap-2 font-medium transition-transform hover:scale-105 active:scale-95">
                    <Link to="/bookings/add">
                        <CalendarPlus className="w-5 h-5" />
                        จองห้องนี้เลย
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Detail Section */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Hero placeholder section for aesthetic */}
                    <div className="w-full h-64 md:h-80 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-blue-600/10 transition-colors" />
                        <Building2 className="w-24 h-24 text-blue-200 opacity-50 relative z-10" />
                        <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/60 p-4 rounded-2xl border border-white/50 shadow-sm flex items-center justify-between z-10 transition-transform group-hover:translate-y-0">
                            <span className="font-medium text-blue-900 tracking-wide">ภาพตัวอย่างห้องประชุม</span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <Info className="w-5 h-5 text-blue-500" />
                            รายละเอียดการใช้งาน
                        </h2>
                        <div className="prose prose-slate prose-blue max-w-none">
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {room.description || 'ไม่มีการระบุรายละเอียดพิเศษสำหรับห้องนี้ หากมีข้อสงสัยเพิ่มเติมกรุณาติดต่อผู้ดูแลระบบ'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    {/* Quick Stats Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="font-bold text-slate-800 tracking-tight">ข้อมูลห้อง</h3>

                        <div className="space-y-5">
                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ความจุสูงสุด</p>
                                    <p className="font-bold text-slate-800">{room.capacity} ที่นั่ง</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-amber-500">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">สถานะการอนุมัติ</p>
                                    <p className="font-bold text-slate-800">
                                        {room.requires_approval ? 'ต้องถูกพิจารณาอนุมัติ' : 'จองและใช้งานได้ทันที'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Equipment Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <LayoutGrid className="w-5 h-5 text-purple-500" />
                            อุปกรณ์ที่มีให้บริการ
                        </h3>

                        {room.equipment && room.equipment.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {room.equipment.map((eq, i) => (
                                    <span key={i} className="px-3.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-100 rounded-full text-sm font-medium">
                                        {eq}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-sm bg-slate-50 p-4 rounded-xl text-center">ไม่มีการระบุอุปกรณ์พิเศษ</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
