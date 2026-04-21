import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { Building, Lock, Loader2, Key, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'
import { z } from 'zod'

const resetPasswordSearchSchema = z.object({
    token: z.string().catch(''),
    email: z.string().catch(''),
})

export const Route = createFileRoute('/reset-password')({
    validateSearch: resetPasswordSearchSchema,
    component: ResetPasswordPage,
})

function ResetPasswordPage() {
    const navigate = useNavigate()
    const { token, email } = useSearch({ from: '/reset-password' })

    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (password !== passwordConfirm) {
            toast.error('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน')
            return
        }

        if (password.length < 8) {
            toast.error('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร')
            return
        }

        setIsLoading(true)

        try {
            await authService.resetPassword({
                token,
                email,
                password,
                password_confirmation: passwordConfirm
            })
            setIsSuccess(true)
            toast.success('ตั้งรหัสผ่านใหม่สำเร็จ')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาดในการตั้งรหัสผ่านใหม่')
        } finally {
            setIsLoading(false)
        }
    }

    if (!token || !email) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-slate-800 mb-2">ลิงก์ไม่ถูกต้อง</h2>
                    <p className="text-slate-500 mb-6">ไม่พบข้อมูลหรือลิงก์หมดอายุสำหรับการรีเซ็ตรหัสผ่าน</p>
                    <Link to="/forgot-password" className="text-blue-600 hover:underline">
                        ขอลิงก์ใหม่อีกครั้ง
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-8">

                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                            <Key className="h-7 w-7" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">ตั้งรหัสผ่านใหม่</h1>
                        <p className="text-slate-500 text-center text-sm mt-2">
                            สำหรับอีเมล <span className="font-medium text-slate-700">{email}</span>
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="text-center p-2 mb-2">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                            <h3 className="font-semibold text-slate-800 mb-2 text-lg">เปลี่ยนรหัสผ่านสำเร็จแล้ว</h3>
                            <p className="text-sm text-slate-500 mb-8">คุณสามารถใช้รหัสผ่านใหม่เพื่อเข้าสู่ระบบได้ทันที</p>
                            <Button
                                onClick={() => navigate({ to: '/login' })}
                                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium"
                            >
                                ไปหน้าเข้าสู่ระบบ
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">รหัสผ่านใหม่</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        className="pl-9 bg-slate-50 border-slate-200"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="passwordConfirm" className="text-sm font-medium text-slate-700">ยืนยันรหัสผ่านใหม่</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="passwordConfirm"
                                        type="password"
                                        className="pl-9 bg-slate-50 border-slate-200"
                                        value={passwordConfirm}
                                        onChange={(e) => setPasswordConfirm(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        minLength={8}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-400">* รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร</p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 mt-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md shadow-blue-200"
                                disabled={isLoading || !password || !passwordConfirm}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                บันทึกรหัสผ่านใหม่
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
