import { useEffect, useState, type FormEvent } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { USER_ROLES, type UserRole } from '@/constants/app'
import type { ManagedUser, UpsertUserDto } from '@/types'
import { roleOptions } from '../user-options'

interface UserFormProps {
    initialData?: ManagedUser
    isSuperAdmin: boolean
    isLoading?: boolean
    submitLabel?: string
    onCancel: () => void
    onSubmit: (payload: UpsertUserDto) => void
}

export function UserForm({
    initialData,
    isSuperAdmin,
    isLoading,
    submitLabel = 'บันทึกผู้ใช้งาน',
    onCancel,
    onSubmit,
}: UserFormProps) {
    const isEditing = Boolean(initialData)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [department, setDepartment] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState(String(USER_ROLES.USER))
    const [isActive, setIsActive] = useState('true')

    useEffect(() => {
        setName(initialData?.name ?? '')
        setEmail(initialData?.email ?? '')
        setPhone(initialData?.phone ?? '')
        setDepartment(initialData?.department ?? '')
        setPassword('')
        setRole(String(initialData?.role ?? USER_ROLES.USER))
        setIsActive(String(initialData?.is_active ?? true))
    }, [initialData])

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        onSubmit({
            name,
            email,
            phone: phone || undefined,
            department: department || undefined,
            password: !isEditing && password ? password : undefined,
            role: Number(role) as UserRole,
            is_active: isActive === 'true',
        })
    }

    return (
        <div className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <form className="p-6 md:p-8 space-y-8" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="user-name">ชื่อผู้ใช้งาน</Label>
                        <Input id="user-name" value={name} onChange={(event) => setName(event.target.value)} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="user-email">อีเมล</Label>
                        <Input id="user-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="user-phone">เบอร์โทรศัพท์</Label>
                        <Input id="user-phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="user-department">ฝ่าย / แผนก</Label>
                        <Input id="user-department" value={department} onChange={(event) => setDepartment(event.target.value)} />
                    </div>

                    {!isEditing && (
                        <div className="space-y-2">
                            <Label htmlFor="user-password">รหัสผ่านเริ่มต้น</Label>
                            <Input
                                id="user-password"
                                type="password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="เว้นว่างเพื่อสุ่มรหัสผ่าน"
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>บทบาท</Label>
                        <Select value={role} onValueChange={setRole}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {roleOptions
                                    .filter((item) => isSuperAdmin || item.value !== USER_ROLES.SUPER_ADMIN)
                                    .map((item) => (
                                        <SelectItem key={item.value} value={String(item.value)}>{item.label}</SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>สถานะบัญชี</Label>
                        <Select value={isActive} onValueChange={setIsActive}>
                            <SelectTrigger className="h-10 w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="true">เปิดใช้งาน</SelectItem>
                                <SelectItem value="false">ปิดใช้งาน</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        ยกเลิก
                    </Button>
                    <Button type="submit" disabled={isLoading} className="min-w-[120px] bg-blue-600 text-white hover:bg-blue-700">
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </div>
    )
}
