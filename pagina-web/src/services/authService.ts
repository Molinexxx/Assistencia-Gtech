import { apiClient } from './apiClient'
import type { AuthResponse, LoginPayload } from '../types/auth'

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload)
    return data
  },
}
