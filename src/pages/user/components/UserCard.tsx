import { Mail, Users } from 'lucide-react'
import type { ManagedUser } from '@/types'
import { getRoleOption } from '../user-options'

interface UserCardProps {
    user: ManagedUser
    isCurrentUser: boolean
    isSelected: boolean
    isToggling: boolean
    onSelect: () => void
    onEdit: () => void
    onToggleActive: () => void
}

export function UserCard({
    user,
    isSelected,
    onSelect,
}: UserCardProps) {
    const roleOption = getRoleOption(user.role)

    return (
        <div
            role="button"
            tabIndex={0}
            className={`w-full rounded-3xl border bg-white p-5 text-left shadow-sm transition-all hover:border-blue-100 hover:shadow-md ${isSelected ? 'border-blue-200 ring-4 ring-blue-50' : 'border-slate-100'}`}
            onClick={onSelect}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    onSelect()
                }
            }}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                        <Users className="h-7 w-7" />
                    </div>
                    <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-xl font-bold text-slate-900">{user.name}</h3>
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${roleOption.tone}`}>
                                {roleOption.label}
                            </span>
                            <span className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${user.is_active ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-100 text-slate-500'}`}>
                                {user.is_active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5" />
                                {user.email}
                            </span>
                            <span>{user.department || 'ไม่ระบุแผนก'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
