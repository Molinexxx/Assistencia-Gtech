import { Bell, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { BrandLogo } from '../branding/BrandLogo'
import { Input } from '../ui/Input'

const pageTitles: Record<string, { title: string; description: string }> = {
  '/dashboard': {
    title: 'Dashboard administrativo',
    description: 'Monitore indicadores de OS, pendências e produtividade do time.',
  },
  '/ordens-servico': {
    title: 'Ordens de serviço',
    description: 'Consulte status, acompanhe gargalos e atualize a operação sem trocar de tela.',
  },
  '/ordens-servico/nova': {
    title: 'Abertura de nova OS',
    description: 'Cadastre o atendimento em etapas para evitar erros de coleta no balcão.',
  },
  '/clientes': {
    title: 'Clientes',
    description: 'Centralize cadastro, relacionamento e histórico de atendimento.',
  },
  '/estoque': {
    title: 'Estoque',
    description: 'Controle disponibilidade crítica e previna atraso por falta de peça.',
  },
}

export function Header() {
  const location = useLocation()
  const { session } = useAuth()
  const metadata = pageTitles[location.pathname] ?? {
    title: 'Painel operacional',
    description: 'Acompanhe a operação da assistência técnica.',
  }

  return (
    <header className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-5 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        <BrandLogo size="sm" showText={false} imageClassName="border-slate-200" />
        <div className="flex min-w-0 flex-col justify-center">
          <p className="text-sm font-medium text-slate-500">Bem-vindo de volta, {session?.username}</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">{metadata.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{metadata.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:items-center">
        <Input
          className="sm:w-80"
          icon={Search}
          placeholder="Busca rápida por cliente, IMEI ou código da OS"
        />
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 text-slate-600 transition hover:border-[#001F3F]/20 hover:bg-[#001F3F]/5 hover:text-[#001F3F]"
        >
          <Bell className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}