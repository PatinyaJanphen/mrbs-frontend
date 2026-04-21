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

export interface ForgotPasswordRequest {
    email: string
}

export interface ResetPasswordRequest {
    token: string
    email: string
    password: string
    password_confirmation: string
}
