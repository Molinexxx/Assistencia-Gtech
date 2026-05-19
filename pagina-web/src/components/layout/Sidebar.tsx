import { Boxes, ClipboardList, LayoutDashboard, LogOut, PlusSquare, Users } from 'lucide-react'
import { NavLink } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'
import { BrandLogo } from '../branding/BrandLogo'
import { Button } from '../ui/Button'

const navigation = [
  { icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'ATENDENTE', 'TECNICO'], to: '/dashboard', end: true },
  { icon: ClipboardList, label: 'Ordens de serviço', roles: ['ADMIN', 'ATENDENTE', 'TECNICO'], to: '/ordens-servico', end: true },
  { icon: PlusSquare, label: 'Nova OS', roles: ['ADMIN', 'ATENDENTE'], to: '/ordens-servico/nova', end: true },
  { icon: Users, label: 'Clientes', roles: ['ADMIN', 'ATENDENTE'], to: '/clientes', end: true },
  { icon: Boxes, label: 'Estoque', roles: ['ADMIN'], to: '/estoque', end: true },
] as const

export function Sidebar() {
  const { hasRole, logout, session } = useAuth()
  const initials = session?.username?.slice(0, 2).toUpperCase() ?? 'GT'

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-[304px] flex-col border-r border-white/6 bg-[#1A1A1B] px-5 py-6 text-slate-100 shadow-[0_24px_48px_rgba(2,6,23,0.18)]">
      <div>
        <BrandLogo size="md" />
        <p className="mt-5 max-w-[220px] text-sm leading-6 text-slate-400">
          Operação centralizada para ordens de serviço, clientes, estoque e acompanhamento técnico.
        </p>
      </div>

      <nav className="mt-9 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {navigation.filter((item) => hasRole(...item.roles)).map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              end={item.end}
              to={item.to}
              className={({ isActive }) => cn(
                'group flex items-center gap-3 rounded-2xl border-l-4 px-4 py-3 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'border-l-[#001F3F] bg-[linear-gradient(90deg,rgba(0,31,63,0.30),rgba(0,31,63,0.14))] text-white'
                  : 'border-l-transparent text-slate-300 hover:bg-white/5 hover:text-white',
              )}
            >
              <span className={cn(
                'inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors',
                'bg-white/5 text-slate-300 group-hover:bg-white/8 group-hover:text-white',
              )}>
                <Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-8 rounded-[22px] border border-white/10 bg-white/[0.04] p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#001F3F] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(0,31,63,0.35)]">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{session?.username}</p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-slate-500">{session?.perfil}</p>
          </div>
        </div>

        <Button
          className="mt-4 w-full justify-center border border-white/10 bg-transparent text-slate-300 hover:bg-white/8 hover:text-white"
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