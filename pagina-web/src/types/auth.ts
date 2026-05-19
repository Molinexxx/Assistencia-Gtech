export type UserProfile = 'ADMIN' | 'ATENDENTE' | 'TECNICO'

export interface LoginPayload {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  username: string
  perfil: UserProfile
}

export interface AuthSession {
  accessToken: string
  expiresAt: number
  expiresIn: number
  username: string
  perfil: UserProfile
}
