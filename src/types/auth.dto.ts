// Auth DTOs

export interface AuthUser {
    id: number
    name: string
    email: string
    avatar?: string
    role: number
    company_id: number
}

export interface LoginResponse {
    token: string
    user: AuthUser
}
