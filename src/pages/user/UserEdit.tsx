import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useParams } from '@tanstack/react-router'
import { Loader2, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { QUERY_KEYS } from '@/constants/query-keys'
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/hooks/queries/useUsers'
import { userService } from '@/services/user.service'
import type { UpsertUserDto } from '@/types'
import { UserForm } from './components/UserForm'
import { UserPageHeader } from './UserAdd'

export function UserEdit() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { isSuperAdmin } = useAuth()
    const { userId: userIdStr } = useParams({ from: '/_layout/users/$userId' })
    const userId = Number(userIdStr)

    const { data: user, isLoading, error } = useUser(userId, { enabled: Boolean(userId) })

    const updateMutation = useMutation({
        mutationFn: (payload: UpsertUserDto) => userService.update(userId, payload),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.DETAIL(userId) })
            toast.success('อัปเดตผู้ใช้งานสำเร็จ')
            navigate({ to: '/users/$userId', params: { userId: String(updatedUser.id) } } as any)
        },
        onError: () => {
            toast.error('อัปเดตผู้ใช้งานไม่สำเร็จ')
        },
    })

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                <p className="font-medium text-slate-500">กำลังโหลดข้อมูลผู้ใช้งาน...</p>
            </div>
        )
    }

    if (error || !user) {
        return (
            <div className="mx-auto mt-20 max-w-2xl rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
                <XCircle className="mx-auto h-10 w-10 text-red-500" />
                <h3 className="mt-4 text-2xl font-bold text-red-900">ไม่พบผู้ใช้งาน</h3>
                <Button className="mt-6" variant="outline" onClick={() => navigate({ to: '/users' } as any)}>
                    กลับหน้าผู้ใช้งาน
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <UserPageHeader
                title="แก้ไขผู้ใช้งาน"
                description={`ปรับปรุงข้อมูลของ ${user.name}`}
                onBack={() => navigate({ to: '/users/$userId', params: { userId: String(user.id) } } as any)}
            />

            <UserForm
                initialData={user}
                isSuperAdmin={isSuperAdmin}
                isLoading={updateMutation.isPending}
                submitLabel="บันทึกการแก้ไข"
                onCancel={() => navigate({ to: '/users/$userId', params: { userId: String(user.id) } } as any)}
                onSubmit={(payload) => updateMutation.mutate(payload)}
            />
        </div>
    )
}
