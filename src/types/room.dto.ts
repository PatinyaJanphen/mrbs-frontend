export interface Room {
    id: number
    company_id: number
    name: string
    description?: string
    capacity?: number
    equipment?: string[]
    is_active: boolean
    requires_approval: boolean
    created_at: string
    updated_at: string
}

export interface CreateRoomDto {
    name: string
    description?: string
    capacity?: number
    equipment?: string[]
    requires_approval?: boolean
}

export type UpdateRoomDto = Partial<CreateRoomDto> & { is_active?: boolean }

export interface PaginatedRooms {
    data: Room[]
    total: number
    per_page: number
    current_page: number
    last_page: number
}
