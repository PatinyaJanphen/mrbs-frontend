import { apiClient } from '@/lib/axios'

export interface DashboardStats {
    total_rooms: number
    today_bookings: number
    active_bookings: number
    total_users: number
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStats> => {
        const { data } = await apiClient.get<DashboardStats>('/dashboard/stats')
        return data
    },
}
