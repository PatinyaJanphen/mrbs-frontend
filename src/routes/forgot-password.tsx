import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Building, Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/auth.service'
import { toast } from 'sonner'

export const Route = createFileRoute('/forgot-password')({
    component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setIsLoading(true)

        try {
            await authService.forgotPassword({ email })
            setIsSuccess(true)
            toast.success('ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณเรียบร้อยแล้ว')
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'เกิดข้อผิดพลาดในการส่งลิงก์รีเซ็ตรหัสผ่าน')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="relative w-full max-w-md">
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-100 p-8">

                    <Link to="/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                    </Link>

                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mb-4">
                            <Building className="h-7 w-7" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">ลืมรหัสผ่าน?</h1>
                        <p className="text-slate-500 text-center text-sm mt-2">
                            กรอกอีเมลของคุณเพื่อรับลิงก์สำหรับตั้งรหัสผ่านใหม่
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="text-center bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-6">
                            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                            <h3 className="font-semibold text-emerald-800 mb-1">ตรวจสอบอีเมลของคุณ</h3>
                            <p className="text-sm text-emerald-600">เราได้ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง <br /><span className="font-medium text-emerald-700">{email}</span> แล้ว</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-slate-700">ป้อนที่อยู่อีเมลของคุณ</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="ที่อยู่อีเมล"
                                        className="pl-9 bg-slate-50 border-slate-200"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-md shadow-blue-200"
                                disabled={isLoading || !email}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                ส่งลิงก์รีเซ็ตรหัสผ่าน
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
