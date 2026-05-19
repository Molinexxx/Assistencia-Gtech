import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import { ProtectedRoute } from './ProtectedRoute'

const AppLayout = lazy(async () => ({
  default: (await import('../layouts/AppLayout')).AppLayout,
}))
const ClientesPage = lazy(async () => ({
  default: (await import('../pages/ClientesPage')).ClientesPage,
}))
const DashboardPage = lazy(async () => ({
  default: (await import('../pages/DashboardPage')).DashboardPage,
}))
const EstoquePage = lazy(async () => ({
  default: (await import('../pages/EstoquePage')).EstoquePage,
}))
const LoginPage = lazy(async () => ({
  default: (await import('../pages/LoginPage')).LoginPage,
}))
const NotFoundPage = lazy(async () => ({
  default: (await import('../pages/NotFoundPage')).NotFoundPage,
}))
const NovaOrdemServicoPage = lazy(async () => ({
  default: (await import('../pages/NovaOrdemServicoPage')).NovaOrdemServicoPage,
}))
const OrdensServicoPage = lazy(async () => ({
  default: (await import('../pages/OrdensServicoPage')).OrdensServicoPage,
}))

export function AppRouter() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 text-sm font-medium text-slate-500">
          Carregando modulo...
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate replace to="/dashboard" />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/ordens-servico" element={<OrdensServicoPage />} />

            <Route element={<ProtectedRoute roles={['ADMIN', 'ATENDENTE']} />}>
              <Route path="/ordens-servico/nova" element={<NovaOrdemServicoPage />} />
              <Route path="/clientes" element={<ClientesPage />} />
            </Route>

            <Route element={<ProtectedRoute roles={['ADMIN']} />}>
              <Route path="/estoque" element={<EstoquePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
