import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { QUERY_KEYS } from '@/constants/query-keys'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/user.service'
import type { UpsertUserDto } from '@/types'
import { UserForm } from './components/UserForm'

export function UserAdd() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { isSuperAdmin } = useAuth()

    const createMutation = useMutation({
        mutationFn: (payload: UpsertUserDto) => userService.create(payload),
        onSuccess: (createdUser) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL })
            toast.success('เพิ่มผู้ใช้งานสำเร็จ')
            navigate({ to: '/users/$userId', params: { userId: String(createdUser.id) } } as any)
        },
        onError: () => {
            toast.error('เพิ่มผู้ใช้งานไม่สำเร็จ')
        },
    })

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <UserPageHeader
                title="เพิ่มผู้ใช้งาน"
                description="สร้างบัญชีใหม่และกำหนดบทบาทเริ่มต้น"
                onBack={() => navigate({ to: '/users' } as any)}
            />

            <UserForm
                isSuperAdmin={isSuperAdmin}
                isLoading={createMutation.isPending}
                submitLabel="เพิ่มผู้ใช้งาน"
                onCancel={() => navigate({ to: '/users' } as any)}
                onSubmit={(payload) => createMutation.mutate(payload)}
            />
        </div>
    )
}

export function UserPageHeader({ title, description, onBack }: { title: string; description: string; onBack: () => void }) {
    return (
        <div className="flex items-center gap-4">
            <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full text-slate-500 hover:bg-white hover:shadow-sm"
                onClick={onBack}
            >
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </div>
    )
}
