import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { roomService } from '@/services/room.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Building2, LayoutGrid, Users, Check } from 'lucide-react'
import { toast } from 'sonner'

export function RoomsIndex() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        capacity: 10,
        equipment: '',
        requires_approval: false,
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await roomService.create({
                name: formData.name,
                description: formData.description,
                capacity: Number(formData.capacity),
                equipment: formData.equipment.split(',').map(s => s.trim()).filter(Boolean),
                requires_approval: formData.requires_approval,
            })
            toast.success('เพิ่มห้องประชุมสำเร็จ')
            navigate({ to: '/rooms' } as any)
        } catch (error) {
            toast.error('เกิดข้อผิดพลาดในการเพิ่มห้อง')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 text-slate-500 hover:text-slate-800"
                    onClick={() => navigate({ to: '/rooms' } as any)}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">เพิ่มห้องประชุมใหม่</h1>
                    <p className="text-slate-500 text-sm">กรอกรายละเอียดเพื่อสร้างห้องประชุมใหม่ในระบบ</p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name Input */}
                        <div className="space-y-2.5 md:col-span-2">
                            <Label htmlFor="name" className="text-slate-700 font-medium flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-blue-500" />
                                ชื่อห้องประชุม <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="เช่น Meeting Room 1, ห้องประชุมอาคาร A"
                                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Capacity Input */}
                        <div className="space-y-2.5">
                            <Label htmlFor="capacity" className="text-slate-700 font-medium flex items-center gap-2">
                                <Users className="w-4 h-4 text-emerald-500" />
                                ความจุ (คน) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="capacity"
                                type="number"
                                required
                                min="1"
                                value={formData.capacity}
                                onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Equipment Input */}
                        <div className="space-y-2.5">
                            <Label htmlFor="equipment" className="text-slate-700 font-medium flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-purple-500" />
                                อุปกรณ์ที่มี
                            </Label>
                            <Input
                                id="equipment"
                                value={formData.equipment}
                                onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                                placeholder="คั่นด้วยจุลภาค (,) เช่น TV, Projector, Whiteboard"
                                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Description Textarea */}
                        <div className="space-y-2.5 md:col-span-2">
                            <Label htmlFor="description" className="text-slate-700 font-medium">รายละเอียดเพิ่มเติม</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="ใส่รายละเอียดอื่นๆ ของห้องประชุม"
                                className="min-h-[120px] resize-y border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
                            />
                        </div>

                        {/* Requires Approval Checkbox */}
                        <div className="space-y-2.5 md:col-span-2 mt-2">
                            <label className="flex flex-row items-center gap-3 cursor-pointer p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.requires_approval ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                    {formData.requires_approval && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-800">ต้องรอการอนุมัติการจอง</div>
                                    <div className="text-sm text-slate-500">การจองห้องนี้จะต้องได้รับการยืนยันจากผู้ดูแลระบบก่อนเสมอ</div>
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.requires_approval}
                                    onChange={(e) => setFormData(prev => ({ ...prev, requires_approval: e.target.checked }))}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                            onClick={() => navigate({ to: '/rooms' } as any)}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                        >
                            {isLoading ? 'กำลังบันทึก...' : 'บันทึกห้องประชุม'}
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    )
}
