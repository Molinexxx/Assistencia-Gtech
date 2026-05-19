import { useCallback, useEffect, useMemo, useState, type PropsWithChildren } from 'react'

import { authService } from '../services/authService'
import { clearStoredSession, getStoredSession, setStoredSession } from '../services/storage'
import type { AuthSession, LoginPayload } from '../types/auth'
import { AuthContext, type AuthContextValue } from './auth-context'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    const storedSession = getStoredSession()

    if (storedSession && storedSession.expiresAt <= Date.now()) {
      clearStoredSession()
      return null
    }

    return storedSession
  })

  const logout = useCallback(() => {
    clearStoredSession()
    setSession(null)
  }, [])

  useEffect(() => {
    if (!session) {
      return undefined
    }

    const timeoutMs = Math.max(session.expiresAt - Date.now(), 0)
    const timeoutId = window.setTimeout(logout, timeoutMs)

    return () => window.clearTimeout(timeoutId)
  }, [logout, session])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await authService.login(payload)

    const nextSession: AuthSession = {
      accessToken: response.accessToken,
      expiresAt: Date.now() + response.expiresIn * 1000,
      expiresIn: response.expiresIn,
      username: response.username,
      perfil: response.perfil,
    }

    setStoredSession(nextSession)
    setSession(nextSession)
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    session,
    isAuthenticated: Boolean(session?.accessToken),
    login,
    logout,
    hasRole: (...roles) => {
      if (!session) {
        return false
      }

      if (roles.length === 0) {
        return true
      }

      return roles.includes(session.perfil)
    },
  }), [login, logout, session])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
