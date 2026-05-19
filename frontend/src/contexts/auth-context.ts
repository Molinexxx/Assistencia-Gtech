import { createContext } from 'react'

import type { AuthSession, LoginPayload, UserProfile } from '../types/auth'

export interface AuthContextValue {
  session: AuthSession | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
  hasRole: (...roles: UserProfile[]) => boolean
}

export const AuthContext = createContext<AuthContextValue | null>(null)
