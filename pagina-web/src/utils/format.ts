import type { OrdemServicoStatus } from '../types/ordem-servico'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

const statusLabels: Record<OrdemServicoStatus, string> = {
  EM_ANALISE: 'Em análise',
  AGUARDANDO_APROVACAO: 'Aguardando aprovação',
  EM_REPARO: 'Em reparo',
  AGUARDANDO_PECA: 'Aguardando peça',
  FINALIZADA: 'Finalizada',
  ENTREGUE: 'Entregue',
  CANCELADA: 'Cancelada',
}

export function formatCurrency(value: number) {
  return currencyFormatter.format(value ?? 0)
}

export function formatDateTime(value: string) {
  if (!value) {
    return '-'
  }

  return dateFormatter.format(new Date(value))
}

export function formatStatusLabel(status: OrdemServicoStatus) {
  return statusLabels[status] ?? status
}

export function toWeekdayLabel(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(new Date(value))
}