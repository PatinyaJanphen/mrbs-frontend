import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, UserPlus, Users } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from '@/components/ui/pagination'
import { QUERY_KEYS } from '@/constants/query-keys'
import { useAuth } from '@/hooks/useAuth'
import { useUsers } from '@/hooks/queries/useUsers'
import { userService } from '@/services/user.service'
import type { ManagedUser } from '@/types'
import { UserCard } from './components/UserCard'
import { UserFilters } from './components/UserFilters'

export function UserTable() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { isSuperAdmin, user: currentUser } = useAuth()
    const [search, setSearch] = useState('')
    const [role, setRole] = useState('all')
    const [status, setStatus] = useState('all')
    const [page, setPage] = useState(1)

    const params = useMemo(() => ({
        page,
        per_page: 10,
        search,
        role: role === 'all' ? undefined : role,
        is_active: status === 'all' ? undefined : status,
    }), [page, role, search, status])

    const { data: usersData, isLoading, error } = useUsers(params)
    const users = usersData?.data ?? []
    const pagination = (usersData as any)?.meta ?? usersData
    const totalPages = pagination?.last_page ?? 1

    useEffect(() => {
        setPage(1)
    }, [search, role, status])

    const toggleMutation = useMutation({
        mutationFn: (targetUser: ManagedUser) => userService.toggleActive(targetUser.id),
        onSuccess: (updatedUser) => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.ALL })
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.USERS.DETAIL(updatedUser.id) })
            toast.success(updatedUser.is_active ? 'เปิดการใช้งานบัญชีแล้ว' : 'ปิดการใช้งานบัญชีแล้ว')
        },
        onError: () => {
            toast.error('เปลี่ยนสถานะบัญชีไม่สำเร็จ')
        },
    })

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">จัดการผู้ใช้งาน</h1>
                    <p className="mt-1 text-slate-500">ดูรายชื่อ ค้นหา และจัดการสถานะบัญชีผู้ใช้งาน</p>
                </div>

                <Button
                    className="h-11 gap-2 rounded-xl bg-blue-600 px-5 text-white shadow-lg shadow-blue-100 hover:bg-blue-700"
                    onClick={() => navigate({ to: '/users/add' } as any)}
                >
                    <UserPlus className="h-5 w-5" />
                    เพิ่มผู้ใช้งาน
                </Button>
            </div>

            <UserFilters
                search={search}
                role={role}
                status={status}
                isSuperAdmin={isSuperAdmin}
                onSearchChange={setSearch}
                onRoleChange={setRole}
                onStatusChange={setStatus}
            />

            {isLoading ? (
                <div className="flex flex-col items-center justify-center gap-3 py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                    <p className="font-medium text-slate-500">กำลังโหลดข้อมูล...</p>
                </div>
            ) : error ? (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
                    <p className="font-medium text-red-600">เกิดข้อผิดพลาด {error.message}</p>
                    <p className="mt-1 text-sm text-red-400">กรุณาลองใหม่อีกครั้ง</p>
                </div>
            ) : users.length > 0 ? (
                <div className="space-y-3">
                    {users.map((managedUser) => (
                        <UserCard
                            key={managedUser.id}
                            user={managedUser}
                            isCurrentUser={currentUser?.id === managedUser.id}
                            isSelected={false}
                            isToggling={toggleMutation.isPending}
                            onSelect={() => navigate({ to: '/users/$userId', params: { userId: String(managedUser.id) } } as any)}
                            onEdit={() => navigate({ to: '/users/$userId/edit', params: { userId: String(managedUser.id) } } as any)}
                            onToggleActive={() => toggleMutation.mutate(managedUser)}
                        />
                    ))}

                    <div className="pt-8 border-t border-slate-100">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1) }}
                                        className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        text="ก่อนหน้า"
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <PaginationItem key={p} className="hidden sm:inline-block">
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); setPage(p) }}
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
                                        onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1) }}
                                        className={page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                        text="ถัดไป"
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            ) : (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-16 text-center">
                    <Users className="mx-auto h-12 w-12 text-slate-300" />
                    <h3 className="mt-4 text-xl font-bold text-slate-700">ไม่พบผู้ใช้งาน</h3>
                    <p className="mt-2 text-slate-400">ลองเปลี่ยนคำค้นหาหรือตัวกรอง</p>
                </div>
            )}
        </div>
    )
}
