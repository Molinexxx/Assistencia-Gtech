import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'
import type { UserProfile } from '../types/auth'

interface ProtectedRouteProps {
  roles?: UserProfile[]
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const location = useLocation()
  const { hasRole, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (roles && roles.length > 0 && !hasRole(...roles)) {
    return <Navigate replace to="/dashboard" />
  }

  return <Outlet />
}
