import type { PropsWithChildren } from 'react'

import type { OrdemServicoStatus } from '../../types/ordem-servico'
import { cn } from '../../utils/cn'
import { formatStatusLabel } from '../../utils/format'

interface BadgeProps extends PropsWithChildren {
  className?: string
  status?: OrdemServicoStatus
}

const statusClasses: Record<OrdemServicoStatus, string> = {
  EM_ANALISE: 'bg-blue-50 text-[#001F3F] ring-1 ring-blue-100',
  AGUARDANDO_APROVACAO: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100',
  EM_REPARO: 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
  AGUARDANDO_PECA: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100',
  FINALIZADA: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  ENTREGUE: 'bg-teal-50 text-teal-700 ring-1 ring-teal-100',
  CANCELADA: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
}

export function Badge({ children, className, status }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
        status ? statusClasses[status] : 'bg-slate-100 text-slate-700',
        className,
      )}
    >
      {children ?? (status ? formatStatusLabel(status) : null)}
    </span>
  )
}