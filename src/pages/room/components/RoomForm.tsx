import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Building2, LayoutGrid, Users, Check } from 'lucide-react'
import type { CreateRoomDto } from '@/types/room.dto'

interface RoomFormProps {
    initialData?: Partial<CreateRoomDto>
    isLoading?: boolean
    onSubmit: (data: CreateRoomDto) => void
    onCancel: () => void
    submitLabel?: string
    isReadOnly?: boolean
}

export function RoomForm({
    initialData,
    isLoading,
    onSubmit,
    onCancel,
    submitLabel = 'บันทึกห้องประชุม',
    isReadOnly = false
}: RoomFormProps) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
        capacity: initialData?.capacity || 10,
        equipment: initialData?.equipment?.join(', ') || '',
        requires_approval: initialData?.requires_approval || false,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (isReadOnly) return

        onSubmit({
            name: formData.name,
            description: formData.description,
            capacity: Number(formData.capacity),
            equipment: formData.equipment.split(',').map(s => s.trim()).filter(Boolean),
            requires_approval: formData.requires_approval,
        })
    }

    return (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden ${isReadOnly ? 'bg-slate-50/50' : ''}`}>
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Input */}
                    <div className="space-y-2.5 md:col-span-2">
                        <Label htmlFor="name" className="text-slate-700 font-medium flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-500" />
                            ชื่อห้องประชุม {!isReadOnly && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            id="name"
                            required
                            disabled={isReadOnly}
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="เช่น Meeting Room 1, ห้องประชุมอาคาร A"
                            className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-80 disabled:bg-white"
                        />
                    </div>

                    {/* Capacity Input */}
                    <div className="space-y-2.5">
                        <Label htmlFor="capacity" className="text-slate-700 font-medium flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-500" />
                            ความจุ (คน) {!isReadOnly && <span className="text-red-500">*</span>}
                        </Label>
                        <Input
                            id="capacity"
                            type="number"
                            required
                            min="1"
                            disabled={isReadOnly}
                            value={formData.capacity}
                            onChange={(e) => setFormData(prev => ({ ...prev, capacity: Number(e.target.value) }))}
                            className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-80 disabled:bg-white"
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
                            disabled={isReadOnly}
                            value={formData.equipment}
                            onChange={(e) => setFormData(prev => ({ ...prev, equipment: e.target.value }))}
                            placeholder={isReadOnly ? 'ไม่ระบุอุปกรณ์' : "คั่นด้วยจุลภาค (,) เช่น TV, Projector, Whiteboard"}
                            className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-80 disabled:bg-white"
                        />
                    </div>

                    {/* Description Textarea */}
                    <div className="space-y-2.5 md:col-span-2">
                        <Label htmlFor="description" className="text-slate-700 font-medium">รายละเอียดเพิ่มเติม</Label>
                        <Textarea
                            id="description"
                            disabled={isReadOnly}
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder={isReadOnly ? 'ไม่ระบุรายละเอียด' : "ใส่รายละเอียดอื่นๆ ของห้องประชุม"}
                            className="min-h-[120px] resize-y border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 disabled:opacity-80 disabled:bg-white"
                        />
                    </div>

                    {/* Requires Approval Checkbox */}
                    <div className="space-y-2.5 md:col-span-2 mt-2">
                        <label className={`flex flex-row items-center gap-3 p-4 border border-slate-200 rounded-xl transition-colors ${isReadOnly ? 'cursor-default' : 'cursor-pointer hover:bg-slate-50'}`}>
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${formData.requires_approval ? 'bg-blue-600 border-blue-600' : 'border-slate-300'} ${isReadOnly && formData.requires_approval ? 'opacity-70' : ''}`}>
                                {formData.requires_approval && <Check className="w-3.5 h-3.5 text-white" />}
                            </div>
                            <div>
                                <div className="font-medium text-slate-800">ต้องรอการอนุมัติการจอง</div>
                                <div className="text-sm text-slate-500">การจองห้องนี้จะต้องได้รับการยืนยันจากผู้ดูแลระบบก่อนเสมอ</div>
                            </div>
                            {!isReadOnly && (
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData.requires_approval}
                                    onChange={(e) => setFormData(prev => ({ ...prev, requires_approval: e.target.checked }))}
                                />
                            )}
                        </label>
                    </div>
                </div>

                {!isReadOnly && (
                    <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100 mt-8">
                        <Button
                            type="button"
                            variant="outline"
                            className="bg-white hover:bg-slate-100 text-slate-600 border-slate-200"
                            onClick={onCancel}
                        >
                            ยกเลิก
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white min-w-[120px]"
                        >
                            {isLoading ? 'กำลังบันทึก...' : submitLabel}
                        </Button>
                    </div>
                )}
            </form>
        </div>
    )
}
