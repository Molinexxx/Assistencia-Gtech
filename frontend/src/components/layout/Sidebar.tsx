import { Boxes, ClipboardList, LayoutDashboard, LogOut, PlusSquare, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'
import { BrandLogo } from '../branding/BrandLogo'
import { Button } from '../ui/Button'

const navigation = [
  { icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'ATENDENTE', 'TECNICO'], to: '/dashboard' },
  { icon: ClipboardList, label: 'Ordens de serviço', roles: ['ADMIN', 'ATENDENTE', 'TECNICO'], to: '/ordens-servico' },
  { icon: PlusSquare, label: 'Nova OS', roles: ['ADMIN', 'ATENDENTE'], to: '/ordens-servico/nova' },
  { icon: Users, label: 'Clientes', roles: ['ADMIN', 'ATENDENTE'], to: '/clientes' },
  { icon: Boxes, label: 'Estoque', roles: ['ADMIN'], to: '/estoque' },
] as const

export function Sidebar() {
  const { hasRole, logout, session } = useAuth()
  const initials = session?.username?.slice(0, 2).toUpperCase() ?? 'GT'

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-[296px] flex-col bg-[#1A1A1B] p-6 text-slate-100 shadow-[0_18px_40px_rgba(2,6,23,0.28)]">
      <div>
        <BrandLogo size="md" />
        <p className="mt-4 text-sm leading-6 text-slate-400">Dashboard operacional com foco em clareza, status e decisões rápidas.</p>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {navigation.filter((item) => hasRole(...item.roles)).map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn(
                'flex items-center gap-3 rounded-2xl border-l-4 px-4 py-3 text-sm font-medium transition',
                isActive
                  ? 'border-l-[#001F3F] bg-[rgba(0,31,63,0.28)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
                  : 'border-l-transparent text-slate-300 hover:bg-white/5 hover:text-white',
              )}
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-300 transition">
                <Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-4">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#001F3F] text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{session?.username}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">{session?.perfil}</p>
          </div>
        </div>
        <Button
          className="mt-4 w-full justify-center border border-white/10 text-slate-300 hover:bg-white/8 hover:text-white"
          size="sm"
          variant="ghost"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  )
}