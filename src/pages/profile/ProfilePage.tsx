import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { authService } from "@/services/auth.service"
import { setAuth, getToken } from "@/lib/auth"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    User,
    Mail,
    Lock,
    Shield,
    Building2,
    Save,
    Loader2,
    KeyRound,
    Phone,
    Briefcase,
    Camera,
    Eye,
    EyeOff,
    Edit3,
    X,
} from "lucide-react"

export function ProfilePage() {
    const { user, role, isAdmin, isSuperAdmin, isStaff } = useAuth()
    const [activeTab, setActiveTab] = useState<"info" | "password">("info")

    // State for Edit Mode
    const [isEditing, setIsEditing] = useState(false)

    // State for Profile Info
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [department, setDepartment] = useState("")
    const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)

    // State for Avatar Uploading
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // State for Password Change
    const [currentPassword, setCurrentPassword] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

    // Password visibility toggles
    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    // Initialize/reset form fields when user data is loaded or editing is cancelled
    useEffect(() => {
        if (user) {
            setName(user.name ?? "")
            setPhone(user.phone ?? "")
            setDepartment(user.department ?? "")
        }
    }, [user, isEditing])

    // Clean up object URL when component unmounts or preview changes
    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview)
            }
        }
    }, [avatarPreview])

    // Role display mapping
    const getRoleName = () => {
        if (isSuperAdmin) return "ผู้ดูแลระบบสูงสุด (Super Admin)"
        if (isAdmin) return "ผู้ดูแลระบบ (Admin)"
        if (isStaff) return "ผู้ประสานงาน (Staff)"
        return "ผู้ใช้งานทั่วไป (User)"
    }

    const getRoleBadgeColor = () => {
        if (isSuperAdmin) return "bg-red-50 text-red-700 border-red-100 hover:bg-red-50 animate-pulse"
        if (isAdmin) return "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50"
        if (isStaff) return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-50"
        return "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-50"
    }

    // Handle avatar file selection
    function handleAvatarClick() {
        if (isEditing) {
            fileInputRef.current?.click()
        } else {
            toast.info("โปรดกดปุ่ม 'แก้ไขข้อมูล' ก่อนทำการอัปโหลดรูปโปรไฟล์")
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file type
            if (!file.type.startsWith("image/")) {
                toast.error("กรุณาเลือกไฟล์ที่เป็นรูปภาพเท่านั้น")
                return
            }
            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                toast.error("ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB")
                return
            }

            setSelectedFile(file)
            setAvatarPreview(URL.createObjectURL(file))
            toast.success("เลือกรูปภาพสำเร็จ (กดยืนยันการแก้ไขเพื่อบันทึก)")
        }
    }

    // Cancel edit and reset form
    function handleCancelEdit() {
        setIsEditing(false)
        setSelectedFile(null)
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview)
            setAvatarPreview(null)
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
        toast.info("ยกเลิกการแก้ไขข้อมูล")
    }

    async function handleUpdateInfo(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim()) {
            toast.error("กรุณากรอกชื่อผู้ใช้งาน")
            return
        }

        setIsUpdatingInfo(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("phone", phone)
            formData.append("department", department)
            if (selectedFile) {
                formData.append("avatar", selectedFile)
            }

            const res = await authService.updateProfile(formData)
            if (res.success) {
                // Sync to Zustand store
                const currentToken = getToken()

                if (currentToken) {
                    setAuth(currentToken, res.user)
                }

                toast.success(res.message || "อัปเดตข้อมูลสำเร็จ")
                setIsEditing(false)
                setSelectedFile(null)
                setAvatarPreview(null)
            }
        } catch (err: any) {
            console.error(err)
            const errorMsg = err.response?.data?.message || "เกิดข้อผิดพลาดในการอัปเดตข้อมูล"
            toast.error(errorMsg)
        } finally {
            setIsUpdatingInfo(false)
        }
    }

    async function handleUpdatePassword(e: React.FormEvent) {
        e.preventDefault()

        if (password.length < 8) {
            toast.error("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร")
            return
        }

        if (password !== passwordConfirmation) {
            toast.error("การยืนยันรหัสผ่านใหม่ไม่ตรงกัน")
            return
        }

        setIsUpdatingPassword(true)
        try {
            const data: Record<string, string> = {
                password,
                password_confirmation: passwordConfirmation,
            }

            // Only add current_password if provided (handles users without previous passwords)
            if (currentPassword) {
                data.current_password = currentPassword
            }

            const res = await authService.updatePassword(data)
            if (res.success) {
                toast.success(res.message || "เปลี่ยนรหัสผ่านสำเร็จ")
                setCurrentPassword("")
                setPassword("")
                setPasswordConfirmation("")
                setShowCurrent(false)
                setShowNew(false)
                setShowConfirm(false)
            }
        } catch (err: any) {
            console.error(err)
            const errorMsg = err.response?.data?.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน"
            toast.error(errorMsg)
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-800">ข้อมูลส่วนตัว</h1>
                <p className="text-slate-500 mt-1">จัดการข้อมูลส่วนตัวและการตั้งค่าความปลอดภัยบัญชีของคุณ</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Profile Overview */}
                <div className="space-y-6 col-span-1">
                    <Card className="border-slate-100 shadow-sm overflow-hidden rounded-2xl bg-white">
                        <div className="h-28 bg-gradient-to-r from-blue-500 to-indigo-600 relative" />
                        <CardContent className="pt-0 pb-6 px-6 relative flex flex-col items-center">
                            <div className="relative -mt-16 mb-4 group cursor-pointer" onClick={handleAvatarClick}>
                                <Avatar className="h-28 w-28 border-4 border-white shadow-md transition-all group-hover:brightness-90 relative overflow-hidden">
                                    <AvatarImage src={avatarPreview ?? user?.avatar ?? ""} alt={user?.name} className="object-cover" />
                                    <AvatarFallback className="text-2xl font-bold bg-slate-100 text-slate-600">
                                        {user?.name?.slice(0, 2).toUpperCase() ?? "US"}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <div className="absolute inset-0 bg-black/45 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Camera className="h-6 w-6" />
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {isEditing && (
                                <p className="text-[11px] text-blue-600 font-semibold mb-2 bg-blue-50 px-2 py-0.5 rounded-full animate-pulse">
                                    คลิกที่รูปภาพเพื่อเปลี่ยน
                                </p>
                            )}

                            <h2 className="text-xl font-bold text-slate-800 text-center">{user?.name}</h2>
                            <p className="text-sm text-slate-400 text-center mt-0.5">{user?.email}</p>

                            <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                <Badge variant="outline" className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor()}`}>
                                    <Shield className="h-3.5 w-3.5 mr-1 shrink-0" />
                                    {getRoleName()}
                                </Badge>
                            </div>

                            <div className="w-full border-t border-slate-100 my-6" />

                            <div className="w-full space-y-4">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-slate-400 font-medium leading-none">องค์กร / บริษัท</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                            {user?.company_id ? `Workspace #${user.company_id}` : "ไม่ได้สังกัดบริษัท"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-slate-400 font-medium leading-none">ฝ่าย / แผนก</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                            {user?.department || "ไม่ระบุข้อมูล"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-slate-600">
                                    <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs text-slate-400 font-medium leading-none">เบอร์โทรศัพท์</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                            {user?.phone || "ไม่ระบุข้อมูล"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Panel: Settings / Tabs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Beautiful Navigation Tabs */}
                    <div className="flex bg-slate-100 p-1.5 rounded-xl gap-1.5 self-start w-fit">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "info" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            <User className="h-4 w-4" />
                            <span>ข้อมูลส่วนตัว</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("password")}
                            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === "password" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            <Lock className="h-4 w-4" />
                            <span>ความปลอดภัย</span>
                        </button>
                    </div>

                    {/* Tab Panels */}
                    {activeTab === "info" ? (
                        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold text-slate-800">จัดการข้อมูลส่วนตัว</CardTitle>
                                <CardDescription>ข้อมูลส่วนบุคคลของคุณที่ใช้ในการแสดงตัวตนและติดต่อในระบบ</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdateInfo} className="space-y-6">
                                    {/* Name input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-slate-600 text-sm font-medium">ชื่อ-นามสกุล</Label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <User className="h-4 w-4" />
                                            </span>
                                            <Input
                                                id="name"
                                                type="text"
                                                className={`pl-10 h-11 border-slate-200 rounded-xl focus-visible:ring-blue-500 transition-all ${!isEditing ? "bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed" : "bg-white"}`}
                                                placeholder="ชื่อ-นามสกุล"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                disabled={!isEditing || isUpdatingInfo}
                                            />
                                        </div>
                                    </div>

                                    {/* Email input (always read-only) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-slate-600 text-sm font-medium">อีเมลผู้ใช้งาน</Label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <Mail className="h-4 w-4" />
                                            </span>
                                            <Input
                                                id="email"
                                                type="email"
                                                className="pl-10 h-11 bg-slate-50 border-slate-100 text-slate-400 rounded-xl cursor-not-allowed"
                                                placeholder="อีเมล"
                                                value={user?.email ?? ""}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Phone input */}
                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-slate-600 text-sm font-medium">เบอร์โทรศัพท์</Label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                    <Phone className="h-4 w-4" />
                                                </span>
                                                <Input
                                                    id="phone"
                                                    type="tel"
                                                    className={`pl-10 h-11 border-slate-200 rounded-xl focus-visible:ring-blue-500 transition-all ${!isEditing ? "bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed" : "bg-white"}`}
                                                    placeholder="เบอร์โทรศัพท์"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    disabled={!isEditing || isUpdatingInfo}
                                                />
                                            </div>
                                        </div>

                                        {/* Department input */}
                                        <div className="space-y-2">
                                            <Label htmlFor="department" className="text-slate-600 text-sm font-medium">ฝ่าย / แผนก</Label>
                                            <div className="relative">
                                                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                    <Briefcase className="h-4 w-4" />
                                                </span>
                                                <Input
                                                    id="department"
                                                    type="text"
                                                    className="pl-10 h-11 bg-slate-50 border-slate-100 text-slate-400 rounded-xl cursor-not-allowed"
                                                    placeholder="-"
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                    disabled
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons: Show Save/Cancel when editing, otherwise show Edit */}
                                    <div className="flex justify-end pt-2">
                                        {!isEditing ? (
                                            <Button
                                                type="button"
                                                onClick={() => setIsEditing(true)}
                                                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 cursor-pointer"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                                <span>แก้ไขข้อมูล</span>
                                            </Button>
                                        ) : (
                                            <div className="flex gap-3">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={handleCancelEdit}
                                                    className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 font-medium cursor-pointer"
                                                    disabled={isUpdatingInfo}
                                                >
                                                    <X className="h-4 w-4 mr-2" />
                                                    <span>ยกเลิก</span>
                                                </Button>

                                                <Button
                                                    type="submit"
                                                    className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/15 transition-all flex items-center gap-2 cursor-pointer"
                                                    disabled={isUpdatingInfo}
                                                >
                                                    {isUpdatingInfo ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            <span>กำลังบันทึก...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="h-4 w-4" />
                                                            <span>บันทึกการเปลี่ยนแปลง</span>
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="border-slate-100 shadow-sm rounded-2xl bg-white">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-bold text-slate-800">เปลี่ยนรหัสผ่าน</CardTitle>
                                <CardDescription>โปรดตั้งรหัสผ่านที่รัดกุมเพื่อรักษาความปลอดภัยบัญชีของคุณ</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleUpdatePassword} className="space-y-6">
                                    {/* Current Password */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor="currentPassword" className="text-slate-600 text-sm font-medium">รหัสผ่านเดิม</Label>
                                            {user?.avatar?.includes("googleusercontent") && (
                                                <span className="text-xs text-slate-400">หากเข้าสู่ระบบผ่าน Google ไม่ต้องกรอก</span>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <KeyRound className="h-4 w-4" />
                                            </span>
                                            <Input
                                                id="currentPassword"
                                                type={showCurrent ? "text" : "password"}
                                                className="pl-10 pr-10 h-11 border-slate-200 rounded-xl focus-visible:ring-blue-500"
                                                placeholder="กรอกรหัสผ่านปัจจุบันของคุณ"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                disabled={isUpdatingPassword}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrent(!showCurrent)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                            >
                                                {showCurrent ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="newPassword" className="text-slate-600 text-sm font-medium">รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)</Label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <Lock className="h-4 w-4" />
                                            </span>
                                            <Input
                                                id="newPassword"
                                                type={showNew ? "text" : "password"}
                                                className="pl-10 pr-10 h-11 border-slate-200 rounded-xl focus-visible:ring-blue-500"
                                                placeholder="กรอกรหัสผ่านใหม่ของคุณ"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                disabled={isUpdatingPassword}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNew(!showNew)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                            >
                                                {showNew ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm New Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-slate-600 text-sm font-medium">ยืนยันรหัสผ่านใหม่</Label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                                                <Lock className="h-4 w-4" />
                                            </span>
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirm ? "text" : "password"}
                                                className="pl-10 pr-10 h-11 border-slate-200 rounded-xl focus-visible:ring-blue-500"
                                                placeholder="ยืนยันรหัสผ่านใหม่ของคุณอีกครั้ง"
                                                value={passwordConfirmation}
                                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                disabled={isUpdatingPassword}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                                            >
                                                {showConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-2">
                                        <Button
                                            type="submit"
                                            className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/10 transition-all flex items-center gap-2 cursor-pointer"
                                            disabled={isUpdatingPassword}
                                        >
                                            {isUpdatingPassword ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>กำลังเปลี่ยน...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="h-4 w-4" />
                                                    <span>บันทึกรหัสผ่านใหม่</span>
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}
