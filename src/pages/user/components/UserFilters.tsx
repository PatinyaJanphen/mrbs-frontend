import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { USER_ROLES } from '@/constants/app'
import { roleOptions } from '../user-options'

interface UserFiltersProps {
    search: string
    role: string
    status: string
    isSuperAdmin: boolean
    onSearchChange: (value: string) => void
    onRoleChange: (value: string) => void
    onStatusChange: (value: string) => void
}

export function UserFilters({
    search,
    role,
    status,
    isSuperAdmin,
    onSearchChange,
    onRoleChange,
    onStatusChange,
}: UserFiltersProps) {
    return (
        <div className="grid gap-3 bg-white p-3 rounded-3xl border border-slate-100 shadow-sm md:grid-cols-[1fr_auto_auto]">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500" />
                <Input
                    placeholder="ค้นหาชื่อ อีเมล แผนก หรือเบอร์โทรที่ต้องการค้นหา..."
                    className="h-12 rounded-2xl border-none bg-slate-50 pl-12 font-medium text-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                    value={search}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </div>

            <Select value={role} onValueChange={onRoleChange}>
                <SelectTrigger className="h-12 w-full rounded-2xl border-none bg-slate-50 px-4 text-slate-700 md:w-44">
                    <SelectValue placeholder="บทบาท" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">ทุกบทบาท</SelectItem>
                    {roleOptions
                        .filter((item) => isSuperAdmin || item.value !== USER_ROLES.SUPER_ADMIN)
                        .map((item) => (
                            <SelectItem key={item.value} value={String(item.value)}>{item.label}</SelectItem>
                        ))}
                </SelectContent>
            </Select>

            <Select value={status} onValueChange={onStatusChange}>
                <SelectTrigger className="h-12 w-full rounded-2xl border-none bg-slate-50 px-4 text-slate-700 md:w-44">
                    <SelectValue placeholder="สถานะ" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="true">เปิดใช้งาน</SelectItem>
                    <SelectItem value="false">ปิดใช้งาน</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
