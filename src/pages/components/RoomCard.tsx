import { Users, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Room } from '@/types'
import { cn } from '@/lib/utils'

interface RoomCardProps {
    room: Room
    onBook?: () => void
}

export function RoomCard({ room, onBook }: RoomCardProps) {
    return (
        <Card className="border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full overflow-hidden">
            <CardHeader className="p-5 pb-0">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-slate-800">{room.name}</CardTitle>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                            {room.description ?? 'ไม่มีรายละเอียด'}
                        </p>
                    </div>
                    <Badge 
                        variant={room.is_active ? "default" : "destructive"}
                        className={cn(
                            "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5",
                            room.is_active ? "bg-green-100 text-green-700 hover:bg-green-100 border-none" : "bg-red-100 text-red-600 hover:bg-red-100 border-none"
                        )}
                    >
                        {room.is_active ? 'พร้อมใช้งาน' : 'ปิดปรับปรุง'}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-5 pt-4 flex-1">
                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="h-4 w-4 text-slate-400" />
                        <span>รองรับได้ {room.capacity ?? '-'} คน</span>
                    </div>
                    
                    {room.equipment && room.equipment.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {room.equipment.map((item) => (
                                <Badge key={item} variant="secondary" className="px-2 py-0.5 bg-slate-50 text-slate-500 rounded text-[11px] border border-slate-100 font-normal">
                                    {item}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-5 pt-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/50">
                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:text-blue-600 hover:bg-blue-50">
                    <Info className="h-3.5 w-3.5 mr-1.5" />
                    รายละเอียด
                </Button>
                <Button 
                    size="sm" 
                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4" 
                    disabled={!room.is_active}
                    onClick={onBook}
                >
                    จองห้องนี้
                </Button>
            </CardFooter>
        </Card>
    )
}

