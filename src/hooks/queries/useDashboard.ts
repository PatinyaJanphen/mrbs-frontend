import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '@/services/dashboard.service'
import { QUERY_KEYS } from '@/constants/query-keys'

export function useDashboardStats(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: QUERY_KEYS.DASHBOARD.STATS,
        queryFn: () => dashboardService.getStats(),
        enabled: options?.enabled,
    })
}
