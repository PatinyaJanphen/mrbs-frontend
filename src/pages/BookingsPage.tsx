import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ClipboardList, Loader2, CalendarPlus, Filter } from 'lucide-react'
import { bookingService } from '@/services/booking.service'
import { BookingCard } from './components/BookingCard'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useRouterState, Link } from '@tanstack/react-router'

interface BookingsPageProps {
    myOnly?: boolean
}

export function BookingsPage({ myOnly = false }: BookingsPageProps) {
    const queryClient = useQueryClient()
    const routerState = useRouterState()
    
    // Check if we are on "My Bookings" path if prop not explicitly provided
    const isMyBookings = myOnly || routerState.location.pathname.includes('/my')

    const { data: bookingsData, isLoading, error } = useQuery({
        queryKey: ['bookings', { isMyBookings }],
        queryFn: () => isMyBookings ? bookingService.myBookings() : bookingService.list(),
    })

    const cancelMutation = useMutation({
        mutationFn: (id: number) => bookingService.cancel(id),
        onSuccess: () => {
            toast.success('ยกเลิกการจองสำเร็จ')
            queryClient.invalidateQueries({ queryKey: ['bookings'] })
        },
        onError: () => {
            toast.error('ไม่สามารถยกเลิกการจองได้')
        }
    })

    const handleCancel = (id: number) => {
        if (confirm('คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการจองนี้?')) {
            cancelMutation.mutate(id)
        }
    }

    const bookings = bookingsData?.data ?? []

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">
                        {isMyBookings ? 'การจองของฉัน' : 'ประวัติการจองทั้งหมด'}
                    </h1>
                    <p className="text-slate-500 mt-1">
                        {isMyBookings ? 'ติดตามและจัดการรายการจองห้องประชุมของคุณ' : 'ตรวจสอบรายการจองห้องประชุมทั้งหมดในระบบ'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="h-11 px-5 rounded-xl border-slate-200 text-slate-600 gap-2">
                        <Filter className="h-4 w-4" />
                        ตัวกรอง
                    </Button>
                    {isMyBookings && (
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-11 px-5 rounded-xl shadow-lg shadow-blue-100">
                            <Link to="/rooms">
                                <CalendarPlus className="h-4.5 w-4.5" />
                                จองห้องเพิ่ม
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-slate-500 font-medium">กำลังโหลดข้อมูลการจอง...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-100 p-8 rounded-2xl text-center">
                    <p className="text-red-600 font-medium">เกิดข้อผิดพลาดในการดึงข้อมูล</p>
                    <p className="text-red-400 text-sm mt-1">กรุณาลองใหม่อีกครั้งในภายหลัง</p>
                </div>
            ) : bookings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => (
                        <BookingCard 
                            key={booking.id} 
                            booking={booking} 
                            showUserInfo={!isMyBookings}
                            onCancel={isMyBookings ? handleCancel : undefined}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-16 text-center">
                    <div className="inline-flex p-4 rounded-3xl bg-slate-50 mb-6">
                        <ClipboardList className="h-10 w-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">ไม่พบรายการจอง</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">
                        {isMyBookings ? 'คุณยังไม่มีรายการจองห้องประชุมในขณะนี้' : 'ไม่พบรายการจองห้องประชุมในระบบ'}
                    </p>
                    {isMyBookings && (
                        <Button asChild variant="outline" className="mt-6 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl">
                            <Link to="/rooms">เริ่มจองห้องแรกของคุณ</Link>
                        </Button>
                    )}
                </div>
            )}
        </div>
    )
}
