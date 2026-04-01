"use client"


import { CalendarIcon, Clock } from "lucide-react"
import { format, setHours, setMinutes } from "date-fns"
import { th } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export interface DateTimePickerProps {
    date: Date | undefined
    setDate: (date: Date | undefined) => void
    label?: string
}

export function DateTimePicker({ date, setDate, label }: DateTimePickerProps) {
    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = Array.from({ length: 60 }, (_, i) => i)

    const handleDateSelect = (newDate: Date | undefined) => {
        if (!newDate) {
           setDate(undefined)
           return
        }
        
        // If we already have a date, preserve the current hours/minutes
        if (date) {
            const result = setHours(setMinutes(newDate, date.getMinutes()), date.getHours())
            setDate(result)
        } else {
            // Default to current hour or 09:00 for new selection
            const result = setHours(setMinutes(newDate, 0), 9)
            setDate(result)
        }
    }

    const handleTimeChange = (type: 'hours' | 'minutes', value: string) => {
        if (!date) return
        
        const numValue = parseInt(value)
        if (type === 'hours') {
            setDate(setHours(date, numValue))
        } else {
            setDate(setMinutes(date, numValue))
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full h-12 justify-start text-left font-normal rounded-xl border-slate-200 bg-slate-50 hover:bg-white hover:ring-2 hover:ring-blue-500 transition-all shadow-sm",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4 text-blue-500" />
                    {date ? format(date, "PPP HH:mm", { locale: th }) : <span>{label || "เลือกวันและเวลา"}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 rounded-2xl border-slate-100 shadow-2xl overflow-hidden" align="start">
                <div className="flex flex-col sm:flex-row">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        locale={th}
                        className="p-3"
                    />
                    <div className="border-t sm:border-t-0 sm:border-l border-slate-100 p-4 bg-slate-50/50 min-w-[150px] flex flex-col justify-center">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1 text-center">ระบุเวลา</label>
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex flex-col gap-1">
                                <Select 
                                    value={date ? date.getHours().toString() : undefined} 
                                    onValueChange={(v) => handleTimeChange('hours', v)}
                                    disabled={!date}
                                >
                                    <SelectTrigger className="h-10 w-[70px] rounded-lg border-slate-200 bg-white shadow-sm focus:ring-blue-500 font-medium text-center">
                                        <SelectValue placeholder="00" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px] rounded-xl border-slate-100 shadow-xl">
                                        {hours.map((h) => (
                                            <SelectItem key={h} value={h.toString()} className="rounded-lg">
                                                {h.toString().padStart(2, '0')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <span className="text-slate-400 font-bold">:</span>

                            <div className="flex flex-col gap-1">
                                <Select 
                                    value={date ? date.getMinutes().toString() : undefined} 
                                    onValueChange={(v) => handleTimeChange('minutes', v)}
                                    disabled={!date}
                                >
                                    <SelectTrigger className="h-10 w-[70px] rounded-lg border-slate-200 bg-white shadow-sm focus:ring-blue-500 font-medium text-center">
                                        <SelectValue placeholder="00" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px] rounded-xl border-slate-100 shadow-xl">
                                        {minutes.filter(m => m % 5 === 0).map((m) => (
                                            <SelectItem key={m} value={m.toString()} className="rounded-lg">
                                                {m.toString().padStart(2, '0')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-center opacity-20">
                             <Clock className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
