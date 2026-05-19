import { Link, Outlet, useNavigate } from "@tanstack/react-router"
import {
    Building,
    CalendarDays,
    Home,
    LogOut,
    User,
    LayoutDashboard,
    DoorOpen,
    ClipboardCheck,
    ClipboardList,
    Settings,
    ChevronRight,
    PanelLeftClose,
    PanelLeftOpen,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Toaster } from "@/components/ui/sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { clearAuth } from "../lib/auth"
import { useAuth } from "@/hooks/useAuth"

const navItems = [
    { to: "/", label: "ภาพรวม", icon: LayoutDashboard, admin: false },
    { to: "/rooms", label: "ห้องประชุม", icon: DoorOpen },
    { to: "/bookings/calendar", label: "ปฏิทินการจอง", icon: CalendarDays },
    { to: "/bookings/my", label: "การจองของฉัน", icon: ClipboardList },
    { to: "/bookings/approvals", label: "อนุมัติการจอง", icon: ClipboardCheck, admin: true },
]

const bottomNavItems = [
    { to: "/", label: "ตั้งค่า", icon: Settings },
]

export function MainLayout() {
    const [collapsed, setCollapsed] = useState(false)
    const navigate = useNavigate()
    const { user, isAdmin, isSuperAdmin } = useAuth()

    const filteredNavItems = navItems.filter(item => !item.admin || isAdmin || isSuperAdmin)

    function handleLogout() {
        clearAuth()
        navigate({ to: '/login' })
    }

    return (
        <div className="min-h-screen bg-slate-50 flex">

            {/* Sidebar */}
            <aside
                className={`${collapsed ? "w-16" : "w-64"} shrink-0 bg-white border-r border-slate-100 flex flex-col fixed inset-y-0 left-0 z-40 shadow-sm transition-all duration-300 ease-in-out`}
            >
                {/* Logo */}
                <div className={`flex items-center h-16 border-b border-slate-100 overflow-hidden ${collapsed ? "justify-center px-0" : "gap-3 px-6"}`}>
                    <div className="shrink-0 flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 shadow-md shadow-blue-200">
                        <Building className="h-5 w-5 text-white" />
                    </div>
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="font-bold text-slate-800 text-sm leading-tight">MRBS</p>
                            <p className="text-xs text-slate-400 leading-tight">Workspace</p>
                        </div>
                    )}
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
                    {!collapsed && (
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 pb-2">เมนูหลัก</p>
                    )}
                    {filteredNavItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.label}
                                to={item.to}
                                activeOptions={{ exact: true }}
                                title={collapsed ? item.label : undefined}
                                className={`group flex items-center gap-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all [&.active]:bg-blue-50 [&.active]:text-blue-600 [&.active]:font-semibold ${collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"}`}
                            >
                                <Icon className="h-4.5 w-4.5 shrink-0" />
                                {!collapsed && (
                                    <>
                                        <span className="flex-1">{item.label}</span>
                                        <ChevronRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-40 group-[.active]:opacity-40 transition-opacity" />
                                    </>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                {/* Bottom Nav */}
                <div className={`px-2 pb-4 space-y-0.5 border-t border-slate-100 pt-3`}>
                    {bottomNavItems.map((item) => {
                        const Icon = item.icon
                        return (
                            <Link
                                key={item.label}
                                to={item.to}
                                title={collapsed ? item.label : undefined}
                                className={`group flex items-center gap-3 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all ${collapsed ? "justify-center px-0 py-2.5" : "px-3 py-2.5"}`}
                            >
                                <Icon className="h-4.5 w-4.5 shrink-0" />
                                {!collapsed && <span>{item.label}</span>}
                            </Link>
                        )
                    })}
                </div>
            </aside>

            {/* Right side: topbar + content */}
            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${collapsed ? "ml-16" : "ml-64"}`}>

                {/* Top Bar */}
                <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-4 shadow-sm">
                    {/* Left: collapse toggle + breadcrumb */}
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                            onClick={() => setCollapsed(!collapsed)}
                            title={collapsed ? "ขยาย sidebar" : "ย่อ sidebar"}
                        >
                            {collapsed
                                ? <PanelLeftOpen className="h-4.5 w-4.5" />
                                : <PanelLeftClose className="h-4.5 w-4.5" />
                            }
                        </Button>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                            <Home className="h-4 w-4" />
                            <span className="text-slate-300">/</span>
                            <span className="text-slate-600 font-medium">ระบบจองห้องประชุม</span>
                        </div>
                    </div>

                    {/* Right: Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative flex items-center gap-2.5 h-10 px-2 rounded-xl hover:bg-slate-50">
                                <Avatar className="h-8 w-8 border border-slate-200">
                                    <AvatarImage src={user?.avatar ?? ''} alt={user?.name} />
                                    <AvatarFallback className="text-xs">{user?.name?.slice(0, 2).toUpperCase() ?? 'US'}</AvatarFallback>
                                </Avatar>
                                <div className="hidden sm:flex flex-col text-left">
                                    <p className="text-xs font-semibold text-slate-700 leading-tight">{user?.name ?? 'Guest'}</p>
                                    <p className="text-xs text-slate-400 leading-tight">{user?.email ?? ''}</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.name ?? 'Guest'}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{user?.email ?? ''}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link to="/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    <span>โปรไฟล์</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>ออกจากระบบ</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>

            <Toaster position="top-right" richColors />
        </div>
    )
}