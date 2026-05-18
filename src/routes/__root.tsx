import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Link,
} from '@tanstack/react-router'
import TanStackQueryProvider from '../integrations/tanstack-query/root-provider'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import appCss from '../styles.css?url'
import type { QueryClient } from '@tanstack/react-query'
import type { AuthUser } from '@/lib/auth'

export interface AuthContext {
  isAuthenticated: boolean
  user: AuthUser | null
}

export interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthContext
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'MRBS Workspace - ระบบจองห้องประชุม' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

import { useEffect } from 'react'
import { useRouter } from '@tanstack/react-router'

function RootDocument({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    const handleUnauthorized = () => {
      router.navigate({ to: '/login', search: { error: 'session_expired' } })
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [router])

  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased bg-slate-50">
        <TanStackQueryProvider>
          {children}
        </TanStackQueryProvider>
        <Scripts />
      </body>
    </html>
  )
}

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center text-center max-w-sm">
        <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 border border-slate-100">
          <FileQuestion className="h-10 w-10 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">404 - ไม่พบหน้าที่ค้นหา</h1>
        <p className="text-slate-500 mb-8 leading-relaxed text-sm">
          ไม่พบหน้าที่คุณกำลังพยายามเข้าถึง
        </p>
        <Link to="/">
          <Button className="w-full sm:w-auto h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5" type="button">
            กลับหน้าหลัก
          </Button>
        </Link>
      </div>
    </div>
  )
}
